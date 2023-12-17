import moment from "moment";
import { DataArray, DataviewApi, STask } from "obsidian-dataview";

import Day from "../day";
import { PlannedItem, PlannedItemLoader } from "../planned-items";

export default class ScheduledTasksLoader
  implements PlannedItemLoader<PlannedItem>
{
  private allTasks: Map<Day, Array<PlannedItem>> | null = null;

  constructor(private dataview: DataviewApi) {}

  public async forDays(days: Set<Day>): Promise<Map<Day, Array<PlannedItem>>> {
    const result = new Map<Day, Array<PlannedItem>>();

    if (this.allTasks === null) {
      const tasks = this.dataview.pages("").file.tasks as DataArray<STask>;

      this.allTasks = new Map(
        tasks
          .filter((sTask: STask) => sTask.scheduled)
          .groupBy((sTask: STask) => sTask.scheduled?.toFormat?.("yyyy-MM-dd"))
          .map(({ key, rows }) => [Day.fromMoment(moment(key)), rows.array()]),
      );
    }

    for (const day of days) {
      if (this.allTasks.has(day)) {
        result.set(day, this.allTasks.get(day));
      } else {
        result.set(day, []);
      }
    }

    return result;
  }

  public refresh(): void {
    this.allTasks = null;
  }
}
