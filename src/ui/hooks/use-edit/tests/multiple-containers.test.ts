import { get } from "svelte/store";

import { Tasks } from "../../../../types";
import { toMinutes } from "../../../../util/moment";
import { baseTask } from "../../test-utils";

import {
  baseTasks,
  dayKey,
  emptyTasks,
  nextDayKey,
  unscheduledTask,
} from "./util/fixtures";
import { setUp } from "./util/setup";

describe("moving tasks between containers", () => {
  test("with no edit operation in progress, nothing happens on mouse move", () => {
    const { todayControls, moveCursorTo, displayedTasks } = setUp({
      tasks: baseTasks,
    });

    const initial = get(displayedTasks);

    todayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toEqual(initial);
  });

  test("scheduling works between days", () => {
    const { todayControls, nextDayControls, moveCursorTo, displayedTasks } =
      setUp({
        tasks: unscheduledTask,
      });

    todayControls.handleGripMouseDown({} as MouseEvent, baseTask);
    nextDayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        noTime: [],
        withTime: [],
      },
      [nextDayKey]: {
        withTime: [{ startMinutes: toMinutes("01:00") }],
      },
    });
  });

  test("drag works between days", () => {
    const tasks: Tasks = {
      [dayKey]: {
        withTime: [
          baseTask,
          { ...baseTask, id: "2", startMinutes: toMinutes("01:00") },
        ],
        noTime: [],
      },
      [nextDayKey]: {
        withTime: [{ ...baseTask, id: "3", startMinutes: toMinutes("01:00") }],
        noTime: [],
      },
    };

    const { todayControls, nextDayControls, moveCursorTo, displayedTasks } =
      setUp({
        tasks,
      });

    todayControls.handleGripMouseDown({} as MouseEvent, baseTask);
    nextDayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        withTime: [{ id: "2", startMinutes: toMinutes("01:00") }],
      },
      [nextDayKey]: {
        withTime: [
          { startMinutes: toMinutes("01:00") },
          { id: "3", startMinutes: toMinutes("01:00") },
        ],
      },
    });
  });

  test("drag many works between days", () => {
    const tasks: Tasks = {
      [dayKey]: {
        withTime: [
          baseTask,
          { ...baseTask, id: "2", startMinutes: toMinutes("01:00") },
        ],
        noTime: [],
      },
      [nextDayKey]: {
        withTime: [{ ...baseTask, id: "3", startMinutes: toMinutes("01:00") }],
        noTime: [],
      },
    };

    const { todayControls, nextDayControls, moveCursorTo, displayedTasks } =
      setUp({
        tasks,
      });

    todayControls.handleGripMouseDown(
      { ctrlKey: true } as MouseEvent,
      baseTask,
    );
    nextDayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        withTime: [{ id: "2", startMinutes: toMinutes("01:00") }],
      },
      [nextDayKey]: {
        withTime: [
          { startMinutes: toMinutes("01:00") },
          { id: "3", startMinutes: toMinutes("02:00") },
        ],
      },
    });
  });

  test("create doesn't work between days", () => {
    const { todayControls, moveCursorTo, nextDayControls, displayedTasks } =
      setUp({
        tasks: emptyTasks,
      });

    moveCursorTo("01:00");
    todayControls.handleContainerMouseDown();
    nextDayControls.handleMouseEnter();
    moveCursorTo("02:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        withTime: [{ startMinutes: toMinutes("01:00"), durationMinutes: 60 }],
      },
      [nextDayKey]: {
        withTime: [],
      },
    });
  });

  test("resize doesn't work between days", () => {
    const { todayControls, nextDayControls, displayedTasks } = setUp();

    todayControls.handleResizerMouseDown({} as MouseEvent, baseTask);
    nextDayControls.handleMouseEnter();

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        withTime: [{ id: "id" }],
      },
      [nextDayKey]: {
        withTime: [],
      },
    });
  });
});
