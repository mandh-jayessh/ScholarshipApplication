import { Page, Locator, expect } from "@playwright/test";
import { fail } from "assert";

export class ExtracurricularActivitiesPage {
  page: Page;
  heading: Locator;
  addEntryButton: Locator;
  addEntryModalClose: Locator;
  extracurricularActivityName: Locator;
  yearsInvolvedUpArrow: Locator;
  yearsInvolvedField: Locator;
  leadershipRolesField: Locator;
  descriptionOfInvolvement: Locator;
  nextPageButton: Locator;
  addCompletedEntry: Locator;
  minActivyRequiredError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId("page-title");
    this.addEntryButton = page.getByRole('button', { name: 'Add Entry', exact: true })
    this.addEntryModalClose = page.getByRole("button", { name: "Close Add Entry modal" });
    this.extracurricularActivityName = page.getByPlaceholder("Short Input");
    this.yearsInvolvedUpArrow = page.getByRole('dialog', { name: 'Add Entry' }).locator('button').nth(1)
    this.yearsInvolvedField = page.getByRole("textbox", { name: "Total Number of Years Involved" });
    this.leadershipRolesField = page.getByPlaceholder("Long Input").first();
    this.descriptionOfInvolvement = page.getByPlaceholder("Long Input").last();
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
    this.minActivyRequiredError = page.getByText("Please add at least 2 entries")
    this.addCompletedEntry = page.getByText("Add", { exact: true });
  }

  async validateActivitiesPage(heading: string) {
    await this.addEntryButton
      .waitFor({ state: "visible", timeout: 30000 }).catch(() => {
        fail("Application Issue, Failed to Navigate From Previous Page");
      });
    await expect(this.heading).toHaveText(heading);
  }

  async ValidateAddEntryDialogModal() {
    await this.addNewEntry();
    await expect(this.extracurricularActivityName).toBeEditable();
    await expect(this.yearsInvolvedField).toBeEditable();
    await expect(this.leadershipRolesField).toBeEditable();
    await expect(this.descriptionOfInvolvement).toBeEditable();
    await this.addEntryModalClose.click();
  }

  async addEntry(activity: string, years: number, roles: string, description: string) {
    await this.addNewEntry();
    await this.extracurricularActivityName.waitFor({ state: "visible" });
    await this.extracurricularActivityName.fill(activity);
    await this.yearsInvolvedUpArrow.click();
    await this.yearsInvolvedField.fill(years.toString());
    await this.leadershipRolesField.fill(roles);
    await this.descriptionOfInvolvement.fill(description);
    await this.completeEntry();
  }

  async addNewEntry() {
    await expect(this.addEntryButton).toBeVisible();
    await this.addEntryButton.click();
  }

  async validateAtLeast2activitiesRequired() {
    const errorText: string = "Please add at least 2 entries";
    await expect(this.minActivyRequiredError).toContainText(errorText);
  }

  async completeEntry() {
    await this.addCompletedEntry.scrollIntoViewIfNeeded();
    await expect(this.addCompletedEntry).toBeVisible();
    await this.addCompletedEntry.click();
  }

  async navigateToNextPage() {
    await this.nextPageButton.click();
  }
}
