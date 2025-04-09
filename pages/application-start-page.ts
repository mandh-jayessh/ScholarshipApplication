import { Page, Locator, expect } from "@playwright/test";

export class ApplicationStartPage {
  page: Page;
  streetAddressField: Locator;
  stateDropdown: Locator;
  cityField: Locator;
  zipcodeField: Locator;
  countryField: Locator;
  nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.streetAddressField = page.getByPlaceholder(
      "Enter your street address"
    );
    this.stateDropdown = page.getByPlaceholder("Enter your state");
    this.cityField = page.getByPlaceholder("Enter your city");
    this.zipcodeField = page.getByPlaceholder("Enter your zip code");
    this.countryField = page.getByPlaceholder("Enter your country");
    this.nextPageButton = page.getByRole("button", { name: "Next Page" })
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
    await this.streetAddressField.fill(address);
  }

  async fillState(state: string) {
    await this.stateDropdown.click();
    await this.page.getByRole("option", { name: state }).click();
  }

  async fillCity(city: string) {
    await this.cityField.fill(city);
  }

  async fillZipcode(zip: string) {
    await this.zipcodeField.fill(zip);
  }

  async fillCountry(country: string) {
    await this.countryField.click();
    await this.page.getByRole("option", { name: country }).click();
  }

  async nextPageClick() {
    await this.nextPageButton.click();
  }
}
