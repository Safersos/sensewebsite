"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppDetail {
  id: number;
  name: string;
  description: string;
  tags: string[];
}

interface AppDetailSheetProps {
  app: AppDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isCreateMode?: boolean;
  leftWidth?: number; // Left panel width percentage for desktop positioning
}

export function AppDetailSheet({ app, isOpen, onClose, isCreateMode = false, leftWidth = 50 }: AppDetailSheetProps) {
  const [senseCode, setSenseCode] = useState("");
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset form when sheet opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSenseCode("");
      setAppName("");
      setAppDescription("");
      setTags([]);
      setTagInput("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle sense code input (9 digits only)
  const handleSenseCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setSenseCode(value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCreate = () => {
    if (appName.trim() && appDescription.trim()) {
      // Handle create logic here
      console.log("Creating app:", { appName, appDescription, tags });
      onClose();
    }
  };

  const handleAdd = () => {
    if (senseCode.length === 9) {
      // Handle add logic here
      console.log("Adding app with code:", senseCode);
      onClose();
    }
  };

  // Logic:
  // - Create mode: only render when isOpen is true (no need to keep mounted after close)
  // - App detail mode: render when isOpen is true OR when app exists (to allow exit animation while app data persists 400ms)
  
  // Early return: don't render create sheet when closed, don't render app sheet when closed and no app data
  if (isCreateMode && !isOpen) return null;
  if (!isCreateMode && !isOpen && !app) return null;

  const sheetKey = isCreateMode ? "create-sheet" : `app-sheet-${app?.id || "none"}`;
  
  // For AnimatePresence: always check isOpen directly so it can detect state changes and trigger exit animation
  // The early return logic above already keeps the component mounted during exit animation (when app exists)
  const shouldShowInAnimatePresence = isOpen;

  return (
    <AnimatePresence>
      {shouldShowInAnimatePresence && (
        <>
          {/* Backdrop - only on mobile, desktop uses transparent overlay */}
          <motion.div
            key={`${sheetKey}-backdrop`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: "tween",
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:bg-black/40 md:left-0"
            style={{
              // On desktop: only cover left panel area
              width: !isMobile ? `${leftWidth}%` : '100%',
            }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key={sheetKey}
            initial={{ 
              y: "100%", 
              opacity: 0,
            }}
            animate={{ 
              y: 0, 
              opacity: 1,
            }}
            exit={{ 
              y: "100%", 
              opacity: 0,
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 280,
              mass: 0.7,
            }}
            className="fixed bottom-0 left-0 z-[101] max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-xl border-t border-white/20 rounded-t-2xl shadow-2xl md:right-auto md:rounded-t-none"
            style={{
              // On mobile: full width, on desktop: constrained to left panel
              width: !isMobile ? `${leftWidth}%` : '100%',
              right: !isMobile ? 'auto' : '0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {isCreateMode ? (
                <>
                  {/* Create App Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-500/30 to-teal-500/30 flex items-center justify-center border border-white/10 flex-shrink-0">
                      <Plus className="w-10 h-10 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-white mb-2">Create Your Own App</h2>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Share your app with other Sense users
                      </p>
                    </div>
                  </div>

                  {/* App Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      App Name
                    </label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="Enter app name"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                    />
                  </div>

                  {/* App Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Description
                    </label>
                    <textarea
                      value={appDescription}
                      onChange={(e) => setAppDescription(e.target.value)}
                      placeholder="Describe what your app does..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm resize-none"
                    />
                  </div>

                  {/* Tags/Capabilities */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-white/90 mb-3">
                      Capabilities (Tags)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add capability (e.g., Play songs)"
                        className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm text-sm"
                      />
                      <Button
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="px-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium backdrop-blur-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-white/100 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Create Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreate}
                      disabled={!appName.trim() || !appDescription.trim()}
                      className="px-6 bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create App
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </>
              ) : app ? (
                <>
                  {/* App Icon/Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 flex-shrink-0">
                      <span className="text-3xl font-bold text-white/60">{app.id}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-white mb-2">{app.name}</h2>
                      <p className="text-white/70 text-sm leading-relaxed">{app.description}</p>
                    </div>
                  </div>

                  {/* Tags/Capabilities */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-white/90 mb-3">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {app.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sense Code Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Enter your Sense code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={9}
                          value={senseCode}
                          onChange={handleSenseCodeChange}
                          placeholder="123456789"
                          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm text-lg font-mono tracking-wider"
                        />
                        <Button
                          onClick={handleAdd}
                          disabled={senseCode.length !== 9}
                          className="px-6 bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-white/50">
                        {senseCode.length}/9 digits
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
