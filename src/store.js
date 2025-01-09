import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";

const UNDO_LEVELS = 10;

const useCSStore = create(
  persist(
    subscribeWithSelector((set) => ({
      campaignId: undefined,
      layouts: [],
      charSheets: [],
      storeCharSheet: (charSheet) => {
        set((state) => {
          const newSheets = { charSheets: [charSheet, ...state.charSheets] };
          while (newSheets.charSheets.length > UNDO_LEVELS) {
            newSheets.pop();
          }
          return newSheets;
        });
      },
      storeLayout: (layout) => {
        set((state) => {
          const newLayouts = { layouts: [layout, ...state.layouts] };
          while (newLayouts.layouts.length > UNDO_LEVELS) {
            newLayouts.layouts.pop();
          }
          return newLayouts;
        });
      },
    })),
    {
      name: "charsheet-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCSStore;
