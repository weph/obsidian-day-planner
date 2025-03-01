import type { HexString } from "obsidian";
import { DEFAULT_DAILY_NOTE_FORMAT } from "obsidian-daily-notes-interface";

export interface DayPlannerSettings {
  progressIndicator: "pie" | "bar" | "none";
  showTaskNotification: boolean;
  zoomLevel: number;
  timelineIcon: string;
  endLabel: string;
  startHour: number;
  timelineDateFormat: string;
  centerNeedle: boolean;
  plannerHeading: string;
  plannerHeadingLevel: number;
  timelineColored: boolean;
  timelineStartColor: HexString;
  timelineEndColor: HexString;
  timestampFormat: string;
  hourFormat: string;
  dataviewSource: string;
  showDataviewMigrationWarning: boolean;
  extendDurationUntilNext: boolean;
  defaultDurationMinutes: number;
  showTimestampInTaskBlock: boolean;
  unscheduledTasksHeight: number;
  showUncheduledTasks: boolean;
  showUnscheduledNestedTasks: boolean;
  showNow: boolean;
  showNext: boolean;
  snapStepMinutes: number;
}

export const defaultSettings: DayPlannerSettings = {
  snapStepMinutes: 10,
  progressIndicator: "bar",
  showTaskNotification: false,
  zoomLevel: 2,
  timelineIcon: "calendar-with-checkmark",
  endLabel: "All done",
  startHour: 6,
  timelineDateFormat: DEFAULT_DAILY_NOTE_FORMAT,
  centerNeedle: false,
  plannerHeading: "Day planner",
  plannerHeadingLevel: 1,
  timelineColored: false,
  timelineStartColor: "#006466",
  timelineEndColor: "#4d194d",
  timestampFormat: "HH:mm",
  hourFormat: "H",
  dataviewSource: "",
  showDataviewMigrationWarning: true,
  extendDurationUntilNext: false,
  defaultDurationMinutes: 30,
  showTimestampInTaskBlock: false,
  unscheduledTasksHeight: 100,
  showUncheduledTasks: true,
  showUnscheduledNestedTasks: true,
  showNow: true,
  showNext: true,
};

export const defaultSettingsForTests = {
  ...defaultSettings,
  startHour: 0,
  zoomLevel: 1,
};
