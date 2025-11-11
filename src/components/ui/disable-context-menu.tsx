"use client";

import { useEffect } from "react";

const blockedKeys = new Set(["F12", "I", "J", "C", "U"]);

export function DisableContextMenu() {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && blockedKeys.has(event.key.toUpperCase())) ||
        (event.ctrlKey && blockedKeys.has(event.key.toUpperCase()))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    const capture = true;
    window.addEventListener("keydown", handleKeyDown, { capture });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown, { capture });
    };
  }, []);

  return null;
}


