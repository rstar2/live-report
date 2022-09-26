import React, { useMemo, useContext } from "react";

import { VideosAction, VideosActionType, useVideosReducer } from "./reducer";
import { VideosContextValue, VideosState } from "@/types";
import * as api from "@/service/api";

const VideosContext = React.createContext<VideosContextValue | undefined>(undefined);

function createVideosContextValue(
  state: VideosState,
  dispatch: React.Dispatch<VideosAction>
): VideosContextValue {
  const refresh = async (type: VideosActionType) => {
    //   setLoading(true, "Refreshing videos...");
    try {
      const { list, date } = await (type === "LIST_TODAY"
        ? api.getVideosToday()
        : api.getVideosYesterday());

      dispatch({ type, list, date });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load/refresh videos", err);
      // showError("Failed to refresh");
    } finally {
      // setLoading(false);
    }
  };

  return {
    // current context state
    state,

    // send to server (async) and on response update (sync)
    refreshToday: async () => refresh("LIST_TODAY"),
    refreshYesterday: async () => refresh("LIST_YESTERDAY"),
  };
}

export function VideosContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useVideosReducer();

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const context = useMemo<VideosContextValue>(
    () => createVideosContextValue(state, dispatch),
    [state, dispatch]
  );

  return <VideosContext.Provider value={context}>{children}</VideosContext.Provider>;
}

export function useVideosContext(): VideosContextValue {
  const context = useContext(VideosContext);
  if (context === undefined) {
    throw new Error("useVideosContext must be used within a VideosContextProvider");
  }
  return context;
}
