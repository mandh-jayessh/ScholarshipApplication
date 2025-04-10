import { Page, Locator, expect } from "@playwright/test";

export class SubmittedApplicationPage {
  page: Page;
  editButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editButtons = page.getByText("Edit");
  }

  async validateNoEditing() {
    await this.editButtons.waitFor({ state: "detached" });
    await expect(this.editButtons).not.toBeAttached;
    await expect(this.editButtons).toHaveCount(0);
  }
}
