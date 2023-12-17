import { TFile } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { DataviewApi } from "obsidian-dataview";

import Day from "../day";
import { PlannedItem, PlannedItemLoader } from "../planned-items";

export default class DailyNotesItemLoader
  implements PlannedItemLoader<PlannedItem>
{
  private allDailyNotes: Record<string, TFile> | null = null;

  constructor(
    private dataview: DataviewApi,
    private heading: string,
  ) {}

  public async forDays(days: Set<Day>): Promise<Map<Day, Array<PlannedItem>>> {
    const result = new Map();

    for (const day of days) {
      result.set(day, this.itemsFor(day));
    }

    return result;
  }

  refresh(): void {
    this.allDailyNotes = null;
  }

  public setHeading(heading: string): void {
    this.heading = heading;
  }

  private itemsFor(day: Day): Array<PlannedItem> {
    const allDailyNotes = this.dailyNotes();
    const dailyNote = getDailyNote(window.moment(day.asIso()), allDailyNotes);
    if (dailyNote === null) {
      return [];
    }

    const note = this.dataview.page(dailyNote.basename);
    if (typeof note === "undefined") {
      return [];
    }

    return note.file.lists.values.filter((item: PlannedItem) =>
      this.isValidItem(item),
    );
  }

  private dailyNotes(): Record<string, TFile> {
    if (this.allDailyNotes === null) {
      this.allDailyNotes = getAllDailyNotes();
    }

    return this.allDailyNotes;
  }

  private isValidItem(item: PlannedItem): boolean {
    return (
      this.inCorrectSection(item) &&
      this.isTopLevelItem(item) &&
      this.isListItemOrUnscheduledTask(item)
    );
  }

  private inCorrectSection(item: PlannedItem): boolean {
    return item.section.subpath === this.heading;
  }

  private isTopLevelItem(item: PlannedItem): boolean {
    return !item.parent;
  }

  private isListItemOrUnscheduledTask(item: PlannedItem): boolean {
    return !item.task || (item.task && !item.scheduled);
  }
}
