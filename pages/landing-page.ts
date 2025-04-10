import { Page, Locator, expect } from "@playwright/test";

export class SdetScholarshipLandingPage {
  page: Page;
  logo: Locator;
  heading: Locator;
  loginToApplyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByAltText("Program Logo").first();
    this.heading = page.locator("//h1");
    this.loginToApplyButton = page.getByRole("button", {
      name: "Log In to Apply",
    });
  }

  async goto() {
    await this.page.goto(
      "https://apply.mykaleidoscope.com/program/sdet-test-scholarship",
      { waitUntil: "domcontentloaded" }
    );
  }

  async validatelandingPage(heading: string) {
    await expect(this.page).toHaveTitle("Kaleidoscope - SDET Scholarship");
    await expect(this.logo).toBeVisible();
    await expect(this.heading).toHaveText(heading);
  }

  async loginApply() {
    await expect(this.loginToApplyButton).toBeVisible();
    await expect(this.loginToApplyButton).toBeEnabled();
    await this.loginToApplyButton.click();
  }
}
