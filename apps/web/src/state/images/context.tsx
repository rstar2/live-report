import React, { useMemo, useContext } from "react";

import { ImagesAction, ImagesActionType, useImagesReducer } from "./reducer";
import { ImagesContextValue, ImagesState } from "@/types";
import * as api from "@/service/api";

const ImagesContext = React.createContext<ImagesContextValue | undefined>(undefined);

function createImagesContextValue(
  state: ImagesState,
  dispatch: React.Dispatch<ImagesAction>
): ImagesContextValue {
  const refresh = async (type: ImagesActionType) => {
    //   setLoading(true, "Refreshing images...");
    try {
      const { list, date } = await (type === "LIST_TODAY"
        ? api.getImagesToday()
        : api.getImagesYesterday());

      dispatch({ type, list, date });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load/refresh images", err);
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

export function ImagesContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useImagesReducer();

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const context = useMemo<ImagesContextValue>(
    () => createImagesContextValue(state, dispatch),
    [state, dispatch]
  );

  return <ImagesContext.Provider value={context}>{children}</ImagesContext.Provider>;
}

export function useImagesContext(): ImagesContextValue {
  const context = useContext(ImagesContext);
  if (context === undefined) {
    throw new Error("useImagesContext must be used within a ImagesContextProvider");
  }
  return context;
}
