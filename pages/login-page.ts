import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  page: Page;
  emailField: Locator;
  nextButton: Locator;
  passwordField: Locator;
  signinButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.getByPlaceholder("Email Address");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.passwordField = page.getByPlaceholder("Password");
    this.signinButton = page.getByRole("button", { name: "Sign In" });
  }

  async fillEmail(email: string) {
    await expect(this.page.locator("h1")).toContainText(
      "Sign In To Kaleidoscope"
    );
    await expect(this.emailField).toBeEditable();
    await this.emailField.fill(email);
  }

  async clickNext() {
    await this.nextButton.click();
    await this.emailField.waitFor({ state: "detached" });
  }

  async fillPasswordAndSignIn(password: string) {
    await expect(this.passwordField).toBeEditable();
    await this.passwordField.fill(password);
    await this.clickSignin()
  }

  async clickSignin() {
    await this.signinButton.click();
  }
}
