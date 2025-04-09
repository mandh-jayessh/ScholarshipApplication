import { Page, Locator, expect } from "@playwright/test";

export class ExtracurricularActivitiesPage {
  page: Page;
  heading: Locator;
  addEntryButton: Locator;
  addEntryBanner: Locator;
  addEntryModalClose: Locator;
  extracurricularActivityName: Locator;
  hoursInvolvedUpArrow: Locator;
  hoursInvolvedField: Locator;
  leadershipRolesField: Locator;
  descriptionOfInvolvement: Locator;
  nextPageButton: Locator;
  addCompletedEntry: Locator;
  errorFor1Entry: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("//h2");
    // this.heading = page.getByTestId("page-title");
    this.addEntryButton = page.locator("span").getByText("Add Entry");
    this.addEntryBanner = page.getByRole("banner");
    this.addEntryModalClose = page.getByRole("button", {
      name: "Close Add Entry modal",
    });
    this.extracurricularActivityName = page.getByPlaceholder("Short Input");
    this.hoursInvolvedUpArrow = page.locator("//*[@data-direction='up']");
    this.hoursInvolvedField = page.getByRole("textbox", {
      name: "Total Number of Years Involved",
    });
    this.leadershipRolesField = page.getByPlaceholder("Long Input").first();
    this.descriptionOfInvolvement = page.getByPlaceholder("Long Input").last();
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
    this.errorFor1Entry = page.locator("[class$=error]");
    this.addCompletedEntry = page.getByRole("button", {
      name: "Add",
      exact: true,
    });
  }

  async validateActivitiesPage() {
    await this.addEntryButton.waitFor({ state: "visible" });
    await expect(this.heading).toHaveText("Extracurricular Activities");
    await this.ValidateAddEntryModal();
  }

  async ValidateAddEntryModal() {
    await this.addNewEntry();
    await expect(this.addEntryBanner).toContainText("Add Entry");
    await expect(this.extracurricularActivityName).toBeEditable();
    await expect(this.hoursInvolvedField).toBeEditable();
    await expect(this.leadershipRolesField).toBeEditable();
    await expect(this.descriptionOfInvolvement).toBeEditable();
    await this.addEntryModalClose.click();
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
    await this.completeEntry();
  }

  async addNewEntry() {
    await expect(this.addEntryButton).toBeVisible();
    await this.addEntryButton.click();
  }

  async fillextracurricularActivity(activity: string) {
    await this.extracurricularActivityName.waitFor({ state: "visible" });
    await this.extracurricularActivityName.fill(activity);
  }

  async fillYearsInvolved(years: number) {
    await this.hoursInvolvedUpArrow.click();
    await this.hoursInvolvedField.fill(years.toString());
  }

  async fillLeadershipRoles(roles: string) {
    await this.leadershipRolesField.fill(roles);
  }

  async fillInvolvementDescription(description: string) {
    await this.descriptionOfInvolvement.fill(description);
  }

  async nextPageClick() {
    await this.nextPageButton.click();
  }

  async validate2entriesRequired() {
    await expect(this.errorFor1Entry).toContainText(
      "Please add at least 2 entries"
    );
  }

  async completeEntry() {
    await this.addCompletedEntry.scrollIntoViewIfNeeded();
    await expect(this.addCompletedEntry).toBeVisible();
    await this.addCompletedEntry.click();
  }
}
