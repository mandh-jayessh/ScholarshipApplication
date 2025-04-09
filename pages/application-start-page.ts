import { Page, Locator, expect } from "@playwright/test";

export class ApplicationStartPage {
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
    this.streetAddressField = page.getByPlaceholder(
      "Enter your street address"
    );
    this.stateField = page.getByPlaceholder("Enter your state");
    this.cityField = page.getByPlaceholder("Enter your city");
    this.zipcodeField = page.getByPlaceholder("Enter your zip code");
    this.countryField = page.getByPlaceholder("Enter your country");
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
  }

  async validateGetToKnowYouPage() {
    await this.streetAddressField.waitFor({ state: "visible" });
    await expect(this.heading).toHaveText("Lets get to know you!");
  }

  async fillUpDetails(
    address: string,
    state: string,
    city: string,
    zip: string,
    country: string
  ) {
    await this.fillStreetAddress(address);
    await this.fillState(state);
    await this.fillCity(city);
    await this.fillZipcode(zip);
    await this.fillCountry(country);
  }

  async fillStreetAddress(address: string) {
    await expect(this.streetAddressField).toBeEditable();
    await this.streetAddressField.fill(address);
  }

  async fillState(state: string) {
    await expect(this.stateField).toBeEditable();
    await this.stateField.click();
    await this.page.getByRole("option", { name: state }).click();
  }

  async fillCity(city: string) {
    await expect(this.cityField).toBeEditable();
    await this.cityField.fill(city);
  }

  async fillZipcode(zip: string) {
    await expect(this.zipcodeField).toBeEditable();
    await this.zipcodeField.fill(zip);
  }

  async fillCountry(country: string) {
    await expect(this.countryField).toBeEditable();
    await this.countryField.click();
    await this.page.getByRole("option", { name: country }).click();
  }

  async nextPageClick() {
    await this.nextPageButton.click();
  }
}
