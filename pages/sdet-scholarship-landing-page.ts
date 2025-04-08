import { Page, Locator, expect } from "@playwright/test";

export class SdetScholarshipLandingPage {
  page: Page;
  loginToApplyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginToApplyButton = page.getByRole("button", {
      name: "Log In to Apply",
    });
  }

  async goto() {
    await this.page.goto(
      "https://apply.mykaleidoscope.com/program/sdet-test-scholarship",
      { waitUntil: "domcontentloaded" }
    );
    await expect(this.page).toHaveTitle("Kaleidoscope - SDET Scholarship");
  }

  async loginApply() {
    await this.loginToApplyButton.click();
  }
}
