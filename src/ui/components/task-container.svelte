<script lang="ts">
  import { Moment } from "moment";
  import { getContext } from "svelte";

  import { obsidianContext } from "../../constants";
  import { getVisibleHours } from "../../global-store/derived-settings";
  import { settings } from "../../global-store/settings";
  import { visibleDayInTimeline } from "../../global-store/visible-day-in-timeline";
  import Day from "../../planned-items/day";
  import type { ObsidianContext } from "../../types";
  import { mapToTasksForDay } from "../../util/get-tasks-for-day";
  import { isToday } from "../../util/moment";
  import { getRenderKey } from "../../util/task-utils";
  import { styledCursor } from "../actions/styled-cursor";
  import { useCursor } from "../hooks/use-edit/cursor";
  import { useEditContext } from "../hooks/use-edit/use-edit-context";

  import Column from "./column.svelte";
  import Grip from "./grip.svelte";
  import Needle from "./needle.svelte";
  import ResizeHandle from "./resize-handle.svelte";
  import Ruler from "./ruler.svelte";
  import ScheduledTaskContainer from "./scheduled-task-container.svelte";
  import ScheduledTask from "./scheduled-task.svelte";
  import Scroller from "./scroller.svelte";
  import Task from "./task.svelte";
  import TimelineControls from "./timeline-controls.svelte";
  import UnscheduledTaskContainer from "./unscheduled-task-container.svelte";

  export let hideControls = false;
  export let day: Moment | undefined = undefined;
  export let tasks = undefined;

  const { plannedItems, planEditor } =
    getContext<ObsidianContext>(obsidianContext);

  $: actualDay = day || $visibleDayInTimeline;
  $: tasks = plannedItems.forDay(Day.fromMoment(actualDay || window.moment()));

  $: editContext = useEditContext({
    obsidianFacade: this.obsidianFacade,
    onUpdate: planEditor.syncTasksWithFile,
    settings: $settings,
    visibleTasks: { [actualDay.format("YYYY-MM-DD")]: mapToTasksForDay(actualDay, $tasks, $settings) }
  });

  $: ({
    displayedTasks,
    cancelEdit,
    handleContainerMouseDown,
    handleResizerMouseDown,
    handleTaskMouseUp,
    handleGripMouseDown,
    handleUnscheduledTaskGripMouseDown,
    handleMouseEnter,
    pointerOffsetY
  } = editContext.getEditHandlers(actualDay));

  $: ({ confirmEdit, editOperation } = editContext);

  $: ({ bodyCursor, gripCursor } = useCursor({
    editMode: undefined
  }));
</script>

<svelte:window on:blur={cancelEdit} />
<svelte:body use:styledCursor={bodyCursor} />
<svelte:document on:mouseup={cancelEdit} />

{#if !hideControls}
  <TimelineControls />

  {#if $displayedTasks.noTime.length > 0 && $settings.showUncheduledTasks}
    <UnscheduledTaskContainer>
      {#each $displayedTasks.noTime as task}
        <Task
          --task-height="{$settings.defaultDurationMinutes *
            $settings.zoomLevel}px"
          {task}
          on:mouseup={() => handleTaskMouseUp(task)}
        >
          <Grip
            cursor={gripCursor}
            on:mousedown={() => handleUnscheduledTaskGripMouseDown(task)}
          />
        </Task>
      {/each}
    </UnscheduledTaskContainer>
  {/if}
{/if}
<Scroller let:hovering={autoScrollBlocked}>
  {#if !hideControls}
    <Ruler visibleHours={getVisibleHours($settings)} />
  {/if}

  <Column visibleHours={getVisibleHours($settings)}>
    {#if isToday(actualDay)}
      <Needle {autoScrollBlocked} />
    {/if}

    <ScheduledTaskContainer
      {pointerOffsetY}
      on:mousedown={handleContainerMouseDown}
      on:mouseup={confirmEdit}
      on:mouseenter={handleMouseEnter}
    >
      {#each $displayedTasks.withTime as task (getRenderKey(task))}
        <ScheduledTask {task} on:mouseup={() => handleTaskMouseUp(task)}>
          <Grip
            cursor={gripCursor}
            on:mousedown={(event) => handleGripMouseDown(event, task)}
          />
          <ResizeHandle
            visible={!$editOperation}
            on:mousedown={(event) => handleResizerMouseDown(event, task)}
          />
        </ScheduledTask>
      {/each}
    </ScheduledTaskContainer>
  </Column>
</Scroller>
