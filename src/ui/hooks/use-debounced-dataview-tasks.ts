import { MetadataCache } from "obsidian";
import { derived, readable } from "svelte/store";

import { settings } from "../../global-store/settings";
import DayPlanner from "../../main";
import { debounceWithDelay } from "../../util/debounce-with-delay";

export interface UseDataviewTasksProps {
  metadataCache: MetadataCache;
  getAllTasks: ReturnType<DayPlanner["getAllTasks"]>;
}

export function useDebouncedDataviewTasks({
  metadataCache,
  getAllTasks,
}: UseDataviewTasksProps) {
  return readable(getAllTasks(), (set) => {
    const [updateTasks, delayUpdateTasks] = debounceWithDelay(() => {
      set(getAllTasks());
    }, 1000);

    metadataCache.on(
      // @ts-expect-error
      "dataview:metadata-change",
      updateTasks,
    );
    document.addEventListener("keydown", delayUpdateTasks);

    const source = derived(settings, ($settings) => {
      return $settings.dataviewSource;
    });

    const unsubscribeFromSettings = source.subscribe(() => {
      updateTasks();
    });

    return () => {
      metadataCache.off("dataview:metadata-change", updateTasks);
      document.removeEventListener("keydown", delayUpdateTasks);
      unsubscribeFromSettings();
    };
  });
}
