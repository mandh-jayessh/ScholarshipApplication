import { Page, Locator, expect } from "@playwright/test";

export class GetToKnowYouPage {
  page: Page;
  heading: Locator;
  streetAddressField: Locator;
  stateField: Locator;
  cityField: Locator;
  zipcodeField: Locator;
  countryField: Locator;
  nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId("page-title");
    this.streetAddressField = page.getByPlaceholder("Enter your street address");
    this.stateField = page.getByPlaceholder("Enter your state");
    this.cityField = page.getByPlaceholder("Enter your city");
    this.zipcodeField = page.getByPlaceholder("Enter your zip code");
    this.countryField = page.getByPlaceholder("Enter your country");
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
  }

  async validateGetToKnowYouPage(heading: string) {
    await this.streetAddressField.waitFor({ state: "visible" });
    await expect(this.heading).toHaveText(heading);
  }

  async validateRequiredFields() {
    await this.assertFieldEditable(this.streetAddressField);
    await this.assertFieldEditable(this.stateField);
    await this.assertFieldEditable(this.cityField);
    await this.assertFieldEditable(this.zipcodeField);
    await this.assertFieldEditable(this.countryField);
  }

  async assertFieldEditable(element: Locator) {
    await expect(element).toBeEditable();
}

  async fillRequiredFields(
    address: string, state: string, city: string,
    zip: string, country: string
  ) {
    await this.streetAddressField.fill(address);
    await this.stateField.click().then(() => this.page.getByRole("option", { name: state }).click())
    await this.cityField.fill(city);
    await this.zipcodeField.fill(zip);
    await this.countryField.click().then(() => this.page.getByRole("option", { name: country }).click())
  }

  async navigateToNextPage() {
    await this.nextPageButton.click();
  }
}
