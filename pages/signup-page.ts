import { Page, Locator, expect } from "@playwright/test";

export class SignupPage {
  page: Page;
  emailField: Locator;
  nextButton: Locator;
  firstNameField: Locator;
  lastNameField: Locator;
  mobilePhoneField: Locator;
  passwordField: Locator;
  confirmCheckbox: Locator;
  submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.getByLabel("Email Address");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.firstNameField = page.getByRole("textbox", { name: "First Name" });
    this.lastNameField = page.getByRole("textbox", { name: "Last Name" });
    this.mobilePhoneField = page.getByPlaceholder("1 (702) 123-4567");
    this.passwordField = page.getByLabel("Create a Password");
    this.confirmCheckbox = page.getByRole("checkbox", {
      name: "I confirm that I am at least 13 years old",
    });
    this.submitButton = page.getByRole("button", { name: "Submit" });
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
    await this.confirmCheckbox.check();
    await expect(this.confirmCheckbox).toBeChecked();
  }
  async clickSubmit() {
    await this.submitButton.click();
  }
}
