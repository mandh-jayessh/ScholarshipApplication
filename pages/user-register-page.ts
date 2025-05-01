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
    this.waitForField = page.getByPlaceholder("Password").or(page.getByLabel("Create a Password"));
    this.firstNameField = page.getByRole("textbox", { name: "First Name" });
    this.lastNameField = page.getByRole("textbox", { name: "Last Name" });
    this.mobilePhoneField = page.getByPlaceholder("1 (702) 123-4567");
    this.createPasswordField = page.getByLabel("Create a Password");
    this.ageConfirmCheckbox = page.getByRole("checkbox", { name: "I confirm that I am at least 13 years old" });
    this.smsNotificationCheckbox = page.getByRole("checkbox", { name: "Opt-in to program related SMS notifications" });
    this.emailNotificationCheckbox = page.getByRole("checkbox", { name: "Opt-in to email notifications about your application status" });
    this.promotionalEmailCheckbox = page.getByRole("checkbox", { name: "Opt-in to promotional emails" });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.backButton = page.getByRole("link", { name: "Back" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  async validateSigninPage(heading: string) {
    await expect(this.heading).toHaveText(heading);
    await expect(this.signinButton).toBeVisible();
    await this.assertFieldEditable(this.enterPasswordField)
  }

  async fillEmail(email: string) {
    await this.emailField.waitFor({ state: "visible" });
    await this.emailField.fill(email);
  }

  async navigateToNextScreen() {
    await this.nextButton.click();
  }

  async waitForLoad() {
    await this.waitForField.waitFor({ state: "visible" });
  }

  async enterPassword(password: string) {
    await this.enterPasswordField.fill(password);
  }

  async signIn() {
    await this.signinButton.click();
  }

  async validateSignupPage(heading: string) {
    await expect(this.heading).toHaveText(heading);
  }

  async validateRequiredFields() {
    await this.assertFieldEditable(this.firstNameField)
    await this.assertFieldEditable(this.lastNameField)
    await this.assertFieldEditable(this.mobilePhoneField)
    await this.assertFieldEditable(this.createPasswordField)
    await this.assertCheckboxChecked(this.smsNotificationCheckbox)
    await this.assertCheckboxChecked(this.emailNotificationCheckbox)
    await this.assertCheckboxChecked(this.promotionalEmailCheckbox)
    await this.assertFieldVisibleAndEnabled(this.backButton)
    await this.assertFieldVisibleAndEnabled(this.submitButton)
  }

  async assertFieldEditable(element: Locator) {
    await expect(element).toBeEditable();
  }

  async assertFieldVisibleAndEnabled(element: Locator) {
    await expect(element).toBeVisible()
    await expect(element).toBeEnabled()
  }

  async assertCheckboxChecked(element: Locator) {
    await expect(element).toBeChecked()
  }

  async fillSignupDetails(fname: string, lname: string, mobno: string, password: string) {
    await this.firstNameField.fill(fname);
    await this.lastNameField.fill(lname);
    await this.mobilePhoneField.fill(mobno);
    await this.createPasswordField.fill(password);
    await this.ageConfirmCheckbox.check();
  }

  async clickSubmit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }
}
