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
  const [shouldMount, setShouldMount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Track mount state for create mode to allow exit animation
  useEffect(() => {
    if (isOpen) {
      setShouldMount(true);
    } else if (isCreateMode && shouldMount) {
      // For create mode, keep mounted for exit animation then unmount
      const timer = setTimeout(() => {
        setShouldMount(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isCreateMode, shouldMount]);

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

  const handleCreate = async () => {
    if (appName.trim() && appDescription.trim()) {
      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success dialog
      setShowSuccessDialog(true);
      setIsSubmitting(false);

      // Clear form
      setAppName("");
      setAppDescription("");
      setTags([]);
      setTagInput("");

      // Close sheet after showing success dialog for a moment
      setTimeout(() => {
        setShowSuccessDialog(false);
        onClose();
      }, 2000);
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
  // - Create mode: render when isOpen is true, keep mounted during exit animation
  // - App detail mode: render when isOpen is true OR when app exists (to allow exit animation while app data persists 400ms)

  // For AnimatePresence: always check isOpen directly so it can detect state changes and trigger exit animation
  const shouldShowInAnimatePresence = isOpen;

  // Early return: only for app detail mode when closed and no app data
  // For create mode: only return null if not mounted (after exit animation completes)
  if (!isOpen && !isCreateMode && !app) return null;
  if (!isOpen && isCreateMode && !shouldMount) return null;

  const sheetKey = isCreateMode ? "create-sheet" : `app-sheet-${app?.id || "none"}`;

  // Calculate responsive padding and text sizes based on leftWidth
  const getSheetPadding = () => {
    if (isMobile) {
      return "p-4 sm:p-6 md:p-8";
    }
    // On desktop, adjust based on leftWidth
    if (leftWidth < 30) return "p-2 sm:p-3";
    if (leftWidth < 40) return "p-3 sm:p-4";
    return "p-4 sm:p-6";
  };

  const getSheetTextSize = (baseSize: string = "base") => {
    if (isMobile) {
      return baseSize === "xl" ? "text-xl sm:text-2xl" : baseSize === "lg" ? "text-lg sm:text-xl" : "text-sm sm:text-base";
    }
    // On desktop, adjust based on leftWidth
    if (leftWidth < 30) return baseSize === "xl" ? "text-lg" : baseSize === "lg" ? "text-base" : "text-xs sm:text-sm";
    if (leftWidth < 40) return baseSize === "xl" ? "text-lg sm:text-xl" : baseSize === "lg" ? "text-sm sm:text-base" : "text-xs sm:text-sm";
    return baseSize === "xl" ? "text-xl sm:text-2xl" : baseSize === "lg" ? "text-lg sm:text-xl" : "text-sm sm:text-base";
  };

  const sheetPadding = getSheetPadding();
  const headingSize = getSheetTextSize("xl");
  const bodySize = getSheetTextSize();
  const labelSize = getSheetTextSize("lg");

  return (
    <>
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
              <div className={`max-w-2xl mx-auto ${sheetPadding}`}>
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {isCreateMode ? (
                  <>
                    {/* Request New Module Header */}
                    <div className={`flex items-start gap-2 sm:gap-4 ${leftWidth < 30 ? "mb-4" : "mb-6"}`}>
                      <div className={`${leftWidth < 30 ? "w-12 h-12" : leftWidth < 40 ? "w-16 h-16" : "w-20 h-20"} rounded-xl bg-gradient-to-br from-green-500/30 to-teal-500/30 flex items-center justify-center border border-white/10 flex-shrink-0`}>
                        <Plus className={`${leftWidth < 30 ? "w-6 h-6" : leftWidth < 40 ? "w-8 h-8" : "w-10 h-10"} text-white/60`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className={`${headingSize} font-semibold text-white ${leftWidth < 30 ? "mb-1" : "mb-2"}`}>Request New Module</h2>
                        <p className={`text-white/70 ${bodySize} leading-relaxed`}>
                          Share your module idea with other Sense users
                        </p>
                      </div>
                    </div>

                    {/* App Name */}
                    <div className={leftWidth < 30 ? "mb-4" : "mb-6"}>
                      <label className={`block ${labelSize} font-medium text-white/90 ${leftWidth < 30 ? "mb-1" : "mb-2"}`}>
                        App Name
                      </label>
                      <input
                        type="text"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="Enter module name"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                      />
                    </div>

                    {/* Module Description */}
                    <div className={leftWidth < 30 ? "mb-4" : "mb-6"}>
                      <label className={`block ${labelSize} font-medium text-white/90 ${leftWidth < 30 ? "mb-1" : "mb-2"}`}>
                        Description
                      </label>
                      <textarea
                        value={appDescription}
                        onChange={(e) => setAppDescription(e.target.value)}
                        placeholder="Describe what your module does..."
                        rows={leftWidth < 30 ? 3 : 4}
                        className={`w-full ${leftWidth < 30 ? "px-2 py-1.5 text-xs" : leftWidth < 40 ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm sm:text-base"} rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm resize-none`}
                      />
                    </div>

                    {/* Tags/Capabilities */}
                    <div className={leftWidth < 30 ? "mb-6" : "mb-8"}>
                      <label className={`block ${labelSize} font-medium text-white/90 ${leftWidth < 30 ? "mb-2" : "mb-3"}`}>
                        Capabilities (Tags)
                      </label>
                      <div className={`flex gap-2 ${leftWidth < 30 ? "mb-2" : "mb-3"}`}>
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
                          className={`flex-1 ${leftWidth < 30 ? "px-2 py-1 text-xs" : leftWidth < 40 ? "px-3 py-1.5 text-xs sm:text-sm" : "px-4 py-2 text-sm"} rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm`}
                        />
                        <Button
                          onClick={handleAddTag}
                          disabled={!tagInput.trim()}
                          className={`${leftWidth < 30 ? "px-2" : "px-4"} bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50`}
                        >
                          <Plus className={`${leftWidth < 30 ? "w-3 h-3" : "w-4 h-4"}`} />
                        </Button>
                      </div>
                      <div className={`flex flex-wrap ${leftWidth < 30 ? "gap-1" : "gap-2"}`}>
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`${leftWidth < 30 ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"} rounded-full bg-white/10 border border-white/20 text-white/80 font-medium backdrop-blur-sm flex items-center ${leftWidth < 30 ? "gap-1" : "gap-2"}`}
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-white/100 transition-colors"
                            >
                              <X className={`${leftWidth < 30 ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Submit Request Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCreate}
                        disabled={!appName.trim() || !appDescription.trim() || isSubmitting}
                        className={`${leftWidth < 30 ? "px-3 text-xs" : "px-6 text-sm sm:text-base"} bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Request
                            <ArrowRight className={`${leftWidth < 30 ? "w-3 h-3" : "w-5 h-5"}`} />
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : app ? (
                  <>
                    {/* Module Icon/Header */}
                    <div className={`flex items-start ${leftWidth < 30 ? "gap-2 mb-4" : leftWidth < 40 ? "gap-3 mb-5" : "gap-4 mb-6"}`}>
                      <div className={`${leftWidth < 30 ? "w-12 h-12" : leftWidth < 40 ? "w-16 h-16" : "w-20 h-20"} rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 flex-shrink-0`}>
                        <span className={`${leftWidth < 30 ? "text-xl" : leftWidth < 40 ? "text-2xl" : "text-3xl"} font-bold text-white/60`}>{app.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className={`${headingSize} font-semibold text-white ${leftWidth < 30 ? "mb-1" : "mb-2"}`}>{app.name}</h2>
                        <p className={`text-white/70 ${bodySize} leading-relaxed`}>{app.description}</p>
                      </div>
                    </div>

                    {/* Tags/Capabilities */}
                    <div className={leftWidth < 30 ? "mb-6" : "mb-8"}>
                      <h3 className={`${labelSize} font-medium text-white/90 ${leftWidth < 30 ? "mb-2" : "mb-3"}`}>Capabilities</h3>
                      <div className={`flex flex-wrap ${leftWidth < 30 ? "gap-1" : "gap-2"}`}>
                        {app.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`${leftWidth < 30 ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"} rounded-full bg-white/10 border border-white/20 text-white/80 font-medium backdrop-blur-sm`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sense Code Input */}
                    <div className={leftWidth < 30 ? "space-y-2" : "space-y-4"}>
                      <div>
                        <label className={`block ${labelSize} font-medium text-white/90 ${leftWidth < 30 ? "mb-1" : "mb-2"}`}>
                          Enter your Sense code
                        </label>
                        <div className={`flex ${leftWidth < 30 ? "gap-1" : "gap-2"}`}>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={9}
                            value={senseCode}
                            onChange={handleSenseCodeChange}
                            placeholder="123456789"
                            className={`flex-1 ${leftWidth < 30 ? "px-2 py-1.5 text-sm" : leftWidth < 40 ? "px-3 py-2 text-base" : "px-4 py-3 text-lg"} rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm font-mono tracking-wider`}
                          />
                          <Button
                            onClick={handleAdd}
                            disabled={senseCode.length !== 9}
                            className={`${leftWidth < 30 ? "px-3" : "px-6"} bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <ArrowRight className={`${leftWidth < 30 ? "w-4 h-4" : "w-5 h-5"}`} />
                          </Button>
                        </div>
                        <p className={`mt-1 sm:mt-2 ${leftWidth < 30 ? "text-xs" : "text-xs sm:text-sm"} text-white/50`}>
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

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[102] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSuccessDialog(false)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 sm:p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Request Submitted Successfully</h3>
                <p className="text-white/70 text-sm">Your module request has been received.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
