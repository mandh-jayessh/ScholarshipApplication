import { Page, Locator, expect } from "@playwright/test";

export class UserRegisterPage {
  page: Page;
  heading: Locator;
  emailField: Locator;
  enterPasswordField: Locator;
  signinButton: Locator;
  waitForField: Locator;
  firstNameField: Locator;
  lastNameField: Locator;
  mobilePhoneField: Locator;
  createPasswordField: Locator;
  ageConfirmCheckbox: Locator;
  smsNotificationCheckbox: Locator;
  emailNotificationCheckbox: Locator;
  promotionalEmailCheckbox: Locator;
  nextButton: Locator;
  backButton: Locator;
  submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading");
    this.emailField = page.getByPlaceholder("Email Address");
    this.enterPasswordField = page.getByPlaceholder("Password");
    this.signinButton = page.getByRole("button", { name: "Sign In" });
    this.waitForField = page
      .getByPlaceholder("Password")
      .or(page.getByLabel("Create a Password"));
    this.firstNameField = page.getByRole("textbox", { name: "First Name" });
    this.lastNameField = page.getByRole("textbox", { name: "Last Name" });
    this.mobilePhoneField = page.getByPlaceholder("1 (702) 123-4567");
    this.createPasswordField = page.getByLabel("Create a Password");
    this.ageConfirmCheckbox = page.getByRole("checkbox", {
      name: "I confirm that I am at least 13 years old",
    });
    this.smsNotificationCheckbox = page.getByRole("checkbox", {
      name: "Opt-in to program related SMS notifications",
    });
    this.emailNotificationCheckbox = page.getByRole("checkbox", {
      name: "Opt-in to email notifications about your application status",
    });
    this.promotionalEmailCheckbox = page.getByRole("checkbox", {
      name: "Opt-in to promotional emails",
    });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.backButton = page.getByRole("link", { name: "Back" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  async validateLoginPage() {
    // await this.enterPasswordField.waitFor({ state: "visible" });
    await expect(this.page).toHaveTitle("Login");
    await expect(this.page).toHaveURL("https://apply.mykaleidoscope.com/login");
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
  }

  async waitForLoad() {
    await this.waitForField.waitFor({ state: "visible" });
  }

  async enterPasswordAndSignIn(password: string) {
    await this.enterPassword(password);
    await this.clickSignin();
  }

  async enterPassword(password: string) {
    await expect(this.enterPasswordField).toBeEditable();
    await this.enterPasswordField.fill(password);
  }

  async clickSignin() {
    await this.signinButton.click();
  }

  async validateSignupPage() {
    await expect(this.page).toHaveTitle("Signup");
    await expect(this.page).toHaveURL(
      "https://apply.mykaleidoscope.com/signup"
    );
    await expect(this.heading).toHaveText("Let's create your account.");
    await expect(this.ageConfirmCheckbox).not.toBeChecked();
    await expect(this.smsNotificationCheckbox).toBeChecked();
    await expect(this.emailNotificationCheckbox).toBeChecked();
    await expect(this.promotionalEmailCheckbox).toBeChecked();
    await expect(this.backButton).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.backButton).toBeEnabled();
    await expect(this.submitButton).toBeEnabled();
  }

  async submitSignupDetails(
    fname: string,
    lname: string,
    mobno: string,
    password: string
  ) {
    await this.fillFirstName(fname);
    await this.fillLastName(lname);
    await this.fillPhoneNumber(mobno);
    await this.createPassword(password);
    await this.checkConfirmCheckbox();
    await this.clickSubmit();
  }

  async fillFirstName(fname: string) {
    await expect(this.firstNameField).toBeEditable();
    await this.firstNameField.fill(fname);
  }

  async fillLastName(lname: string) {
    await expect(this.lastNameField).toBeEditable();
    await this.lastNameField.fill(lname);
  }

  async fillPhoneNumber(mobno: string) {
    await expect(this.mobilePhoneField).toBeEditable();
    await this.mobilePhoneField.fill(mobno);
  }

  async createPassword(password: string) {
    await expect(this.createPasswordField).toBeEditable();
    await this.createPasswordField.fill(password);
  }

  async checkConfirmCheckbox() {
    await this.ageConfirmCheckbox.check();
    await expect(this.ageConfirmCheckbox).toBeChecked();
  }

  async clickSubmit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }
}
