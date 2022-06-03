import React from "react";

import { ImagesContextProvider } from "./images/context";
import { VideosContextProvider } from "./videos/context";

/**
 * Combine all contexts
 */
export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ImagesContextProvider>
      <VideosContextProvider>{children}</VideosContextProvider>
    </ImagesContextProvider>
  );
}
