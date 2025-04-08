import { Page, Locator, expect } from "@playwright/test";

export class ReviewApplicationPage {
  page: Page;
  down_arrow: Locator;
  submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.down_arrow = page.locator("[class*=chevron-down]");
    this.submitButton = page.locator("span").getByText("Submit");
  }
  async submitApplication() {
    await this.submitButton.clear();
  }
}
