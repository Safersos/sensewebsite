"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppDetailSheet } from "./app-detail-sheet";

interface AppTileProps {
  index: number;
  onTileClick: (appId: number) => void;
  onAddClick: (appId: number) => void;
}

// Placeholder app data
const APP_DATA: Record<number, { name: string; description: string; tags: string[] }> = {
  0: {
    name: "Music Player",
    description: "Stream and manage your music library with AI-powered recommendations and seamless playback.",
    tags: ["Play songs", "Create playlists", "Music recommendations"],
  },
  1: {
    name: "Note Taking",
    description: "Intelligent note-taking app with voice transcription, handwriting recognition, and smart organization.",
    tags: ["Write notes", "Voice notes", "Organize notes"],
  },
  2: {
    name: "Calendar Sync",
    description: "Keep your schedule in sync across all devices with smart event detection and reminders.",
    tags: ["Update calendar", "Event reminders", "Schedule sync"],
  },
};

function AppTile({ index, onTileClick, onAddClick }: AppTileProps) {
  const appId = index + 1;
  const appName = APP_DATA[index % 3]?.name || `App ${appId}`;

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
         onClick={() => onTileClick(appId)}>
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
        <span className="text-2xl font-bold text-white/60">{appId}</span>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-white/90 mb-1">
          {appName}
        </h3>
        <p className="text-xs text-white/50">Placeholder</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-7 px-3 bg-white/10 hover:bg-white/20 text-white/90 border border-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onAddClick(appId);
        }}
      >
        <Plus className="w-3 h-3 mr-1" />
        Add to Sense
      </Button>
    </div>
  );
}

interface AppMarketplaceProps {
  leftWidth: number;
  isDragging?: boolean;
}

export function AppMarketplace({ leftWidth, isDragging = false }: AppMarketplaceProps) {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  // Generate 32 placeholder app tiles (8 rows × 4 columns)
  const appTiles = Array.from({ length: 32 }, (_, i) => i);

  const handleTileClick = (appId: number) => {
    setSelectedApp(appId);
    setIsSheetOpen(true);
  };

  const handleAddClick = (appId: number) => {
    setSelectedApp(appId);
    setIsSheetOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    // Delay clearing selectedApp to allow exit animation to complete
    setTimeout(() => {
      setSelectedApp(null);
    }, 400);
  };

  const handleCloseCreateSheet = () => {
    setIsCreateSheetOpen(false);
  };

  const getAppDetail = (appId: number) => {
    const appIndex = (appId - 1) % 3;
    const baseData = APP_DATA[appIndex] || {
      name: `App ${appId}`,
      description: "A powerful app for your Sense device. Connect and integrate seamlessly with your workflow.",
      tags: ["Feature 1", "Feature 2", "Feature 3"],
    };
    return {
      id: appId,
      ...baseData,
    };
  };

  return (
    <>
      <div
        className={`absolute top-0 bottom-0 left-0 overflow-y-auto bg-black/40 backdrop-blur-md border-r border-white/10 neural-scrollbar-left ${
          !isDragging ? "transition-all duration-300 ease-out" : ""
        }`}
        style={{ width: `${leftWidth}%` }}
      >
        <div className="p-6" style={{ direction: "ltr" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">App Marketplace</h2>
            <button
              onClick={handleCreateClick}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
              aria-label="Create new app"
              title="Create your own app"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {appTiles.map((index) => (
              <AppTile 
                key={index} 
                index={index}
                onTileClick={handleTileClick}
                onAddClick={handleAddClick}
              />
            ))}
          </div>
        </div>
      </div>

      <AppDetailSheet
        app={selectedApp ? getAppDetail(selectedApp) : null}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        isCreateMode={false}
      />
      
      <AppDetailSheet
        app={null}
        isOpen={isCreateSheetOpen}
        onClose={handleCloseCreateSheet}
        isCreateMode={true}
      />
    </>
  );
}
