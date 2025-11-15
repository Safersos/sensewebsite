/**
 * API utilities for communicating with the Sense backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''; // Optional, only if backend requires it

export interface ChatSession {
  sessionId: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

/**
 * Create a new chat session
 */
export async function createSession(): Promise<string> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/session`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    const data: ChatSession = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Send a message to the chat API
 */
export async function sendMessage(
  sessionId: string,
  message: string,
  userId?: string
): Promise<string> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sessionId,
        message,
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Check if the backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

