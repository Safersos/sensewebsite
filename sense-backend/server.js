// server.js
import express from 'express';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

dotenv.config();

const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || 'You are SenseBot — friendly and factual.';
const AUTH_KEY = process.env.AUTH_KEY || '';
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

/**
 * Simple memory store:
 * - uses Redis if REDIS_URL present (placeholder)
 * - otherwise falls back to in-memory Map (not for prod)
 */
let useRedis = false;
let redisClient = null;
const sessionMemory = new Map(); // key: sessionId -> array of messages [{role,content,ts}]

if (process.env.REDIS_URL) {
  useRedis = true;
  // For brevity we use ioredis or node-redis in production; placeholder:
  // import Redis from 'ioredis'; redisClient = new Redis(process.env.REDIS_URL);
  // Implementation left as an exercise / replace with your Redis client.
  console.log('REDIS_URL detected — implement Redis client in server.js for production.');
}

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL === '*' ? true : FRONTEND_URL,
  credentials: true,
}));

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/chat', limiter);
app.use('/session', limiter);

// Simple auth middleware to ensure only your app calls this
function requireAuth(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!AUTH_KEY) return next(); // dev mode: no auth
  if (!key || key !== AUTH_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/**
 * Utility: store message in short-term session memory (last N turns)
 */
const MAX_RECENT = 12;

async function pushSessionMessage(sessionId, role, content) {
  const msg = { role, content, ts: Date.now() };
  if (useRedis) {
    // implement Redis LPush / LTrim here
    // await redisClient.lpush(`session:${sessionId}`, JSON.stringify(msg));
    // await redisClient.ltrim(`session:${sessionId}`, 0, MAX_RECENT - 1);
  } else {
    const arr = sessionMemory.get(sessionId) || [];
    arr.push(msg);
    if (arr.length > MAX_RECENT) arr.shift();
    sessionMemory.set(sessionId, arr);
  }
}

async function getSessionMessages(sessionId) {
  if (useRedis) {
    // implement Redis LRange here
    // const messages = await redisClient.lrange(`session:${sessionId}`, 0, MAX_RECENT - 1);
    // return messages.map(m => JSON.parse(m));
    return [];
  } else {
    return sessionMemory.get(sessionId) || [];
  }
}

/**
 * Optional placeholder for retrieval-augmented context (RAG)
 * Implement: compute embedding for userMessage -> query vector DB -> return top-K text
 */
async function getRetrievalContext(userMessage, userId) {
  // For now return empty string. Replace with vector DB calls if needed.
  return '';
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Create new session
 */
app.post('/session', requireAuth, async (req, res) => {
  try {
    const sessionId = uuidv4();
    // optionally record user info: req.body.userId or anonymous
    sessionMemory.set(sessionId, []);
    res.json({ sessionId });
  } catch (err) {
    console.error('session creation error', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * Main chat endpoint
 * Body: { sessionId, message }
 */
app.post('/chat', requireAuth, async (req, res) => {
  try {
    const { sessionId, message, userId } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Store user message in short-term memory
    await pushSessionMessage(sessionId, 'user', message);

    // Retrieve recent session messages for context
    const recent = await getSessionMessages(sessionId); // array of {role, content}

    // Build messages in chat format
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Include RAG context if any
    const rag = await getRetrievalContext(message, userId);
    if (rag) {
      messages.push({ role: 'system', content: `Reference:\n${rag}` });
    }

    // Include recent turns (limit to last 8 or so)
    const lastTurns = recent.slice(-8); // keep a few turns
    for (const m of lastTurns) {
      messages.push({ role: m.role, content: m.content });
    }

    // Finally include the new user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI Chat Completions (Chat API)
    const openaiResponse = await callOpenAIChat(messages);

    const assistantText = openaiResponse?.choices?.[0]?.message?.content ?? 
                         openaiResponse?.choices?.[0]?.text ?? 
                         'Sorry, I encountered an error processing your request.';

    // Store assistant reply
    await pushSessionMessage(sessionId, 'assistant', assistantText);

    // Optionally extract memory candidates here, and send to your long-term store if needed
    return res.json({ 
      reply: assistantText, 
      sessionId,
      // raw: openaiResponse // uncomment for debugging
    });
  } catch (err) {
    console.error('chat error', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

/**
 * Helper: call OpenAI Chat Completions
 * Uses official HTTP endpoint so this works with any modern SDK/edge.
 */
async function callOpenAIChat(messages) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: OPENAI_MODEL,
    messages,
    max_tokens: 800,
    temperature: 0.2,
    // stream: true // optional streaming
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    console.error('OpenAI error', r.status, txt);
    throw new Error(`OpenAI API error ${r.status}: ${txt}`);
  }

  const json = await r.json();
  return json;
}

app.listen(PORT, () => {
  console.log(`🚀 Sense backend listening on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  if (!OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set in environment variables');
  }
});

