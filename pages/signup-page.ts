import { Page, Locator, expect } from "@playwright/test";

export class SignupPage {
  page: Page;
  heading: Locator;
  emailField: Locator;
  nextButton: Locator;
  firstNameField: Locator;
  lastNameField: Locator;
  mobilePhoneField: Locator;
  passwordField: Locator;
  ageConfirmCheckbox: Locator;
  smsNotificationCheckbox: Locator;
  emailNotificationCheckbox: Locator;
  promotionalEmailCheckbox: Locator;
  backButton: Locator;
  submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("//h2");
    this.emailField = page.getByLabel("Email Address");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.firstNameField = page.getByRole("textbox", { name: "First Name" });
    this.lastNameField = page.getByRole("textbox", { name: "Last Name" });
    this.mobilePhoneField = page.getByPlaceholder("1 (702) 123-4567");
    this.passwordField = page.getByLabel("Create a Password");
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
    this.backButton = page.getByRole("link", { name: "Back" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
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
    await expect(this.emailField).not.toBeEditable();
    await this.fillFirstName(fname);
    await this.fillLastName(lname);
    await this.fillPhoneNumber(mobno);
    await this.fillPassword(password);
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

  async fillPassword(password: string) {
    await expect(this.passwordField).toBeEditable();
    await this.passwordField.fill(password);
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
