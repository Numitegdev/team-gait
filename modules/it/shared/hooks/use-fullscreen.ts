"use client";

import {
  useEffect,
  useState,
} from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] =
    useState(false);

  async function enterFullscreen() {
    const target =
      document.documentElement;

    if (target.requestFullscreen) {
      await target.requestFullscreen();
    }
  }

  async function exitFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        !!document.fullscreenElement
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}