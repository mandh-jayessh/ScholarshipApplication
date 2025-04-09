import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  page: Page;
  heading: Locator;
  emailField: Locator;
  nextButton: Locator;
  passwordField: Locator;
  signinButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("//h1");
    this.emailField = page.getByPlaceholder("Email Address");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.passwordField = page.getByPlaceholder("Password");
    this.signinButton = page.getByRole("button", { name: "Sign In" });
  }

  async validateloginPage() {
    await expect(this.page).toHaveTitle("Login");
    await expect(this.page).toHaveURL("https://apply.mykaleidoscope.com/login");
    await this.heading.waitFor({ state: "visible" });
    await expect(this.heading).toHaveText("Sign In To Kaleidoscope");
  }

  async fillEmail(email: string) {
    await expect(this.emailField).toBeEditable();
    await this.emailField.fill(email);
  }

  async clickNext() {
    await expect(this.nextButton).toBeVisible();
    await expect(this.nextButton).toBeEnabled();
    await this.nextButton.click();
    // await this.emailField.waitFor({ state: "detached" });
  }

  async fillPasswordAndSignIn(password: string) {
    await this.fillPassword(password);
    await this.clickSignin();
  }

  async fillPassword(password: string) {
    await expect(this.passwordField).toBeEditable();
    await this.passwordField.fill(password);
  }

  async clickSignin() {
    await this.signinButton.click();
  }
}
