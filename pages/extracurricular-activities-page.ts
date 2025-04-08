import { Page, Locator, expect } from "@playwright/test";

export class ExtracurricularActivitiesPage {
  page: Page;
  addEntryButton: Locator;
  extracurricularActivityName: Locator;
  yearsInvolvedUpArrow: Locator;
  yearsInvolvedField: Locator;
  leadershipRolesField: Locator;
  descriptionOfInvolvement: Locator;
  nextPage: Locator;
  errorFor1Entry: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEntryButton = page.locator("span").getByText("Add Entry");
    this.extracurricularActivityName = page.getByPlaceholder("Short Input");
    this.yearsInvolvedUpArrow = page.locator("//*[@data-direction='up']");
    this.yearsInvolvedField = page.getByRole("textbox", {
      name: "Total Number of Years Involved",
    });
    this.leadershipRolesField = page.getByPlaceholder("Long Input").first();
    this.descriptionOfInvolvement = page.getByPlaceholder("Long Input").last();
    this.nextPage = page.getByText("Next Page");
    this.errorFor1Entry = page.locator("[class$=error]");
  }

  async addEntry(
    activity: string,
    number: number,
    roles: string,
    description: string
  ) {
    await this.addNewEntry();
    await this.fillextracurricularActivity(activity);
    await this.fillYearsInvolved(number);
    await this.fillLeadershipRoles(roles);
    await this.fillInvolvementDescription(description);
    await this.page.getByRole("button", { name: "Add", exact: true }).click();
  }

  async addNewEntry() {
    await this.addEntryButton.waitFor({ state: "visible" });
    await this.addEntryButton.click();
  }

  async fillextracurricularActivity(activity: string) {
    await this.extracurricularActivityName.fill(activity);
  }

  async fillYearsInvolved(years: number) {
    await this.yearsInvolvedUpArrow.click();
    await this.yearsInvolvedField.fill(years.toString());
  }

  async fillLeadershipRoles(roles: string) {
    await this.leadershipRolesField.fill(roles);
  }

  async fillInvolvementDescription(description) {
    await this.descriptionOfInvolvement.fill(description);
  }

  async nextPageClick() {
    await this.nextPage.click();
  }

  async validate2entriesRequired() {
    await expect(this.errorFor1Entry).toContainText(
      "Please add at least 2 entries"
    );
  }
}
