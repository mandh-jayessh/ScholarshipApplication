import { Page, Locator, expect } from "@playwright/test";
import path from "path";

export class HighSchoolInfoPage {
  page: Page;
  heading: Locator;
  schoolName: Locator;
  schoolStreetAddress: Locator;
  schoolCity: Locator;
  schoolState: Locator;
  schoolZip: Locator;
  gpa: Locator;
  graduationYear: Locator;
  uploadFileButton: Locator;
  deleteUploadedFileButton: Locator;
  nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId("page-title");
    this.schoolName = page.getByRole("textbox", { name: "High School Name" });
    this.schoolStreetAddress = page.getByRole("textbox", {
      name: "High School Street Address",
      exact: true,
    });
    this.schoolCity = page.getByRole("textbox", { name: "High School City" });
    this.schoolState = page.getByPlaceholder("Enter high school state");
    this.schoolZip = page.getByPlaceholder("e.g. 55413");
    this.gpa = page.getByPlaceholder("Enter your current GPA");
    this.graduationYear = page.getByPlaceholder("Enter a date");
    this.uploadFileButton = page.getByText("Upload File");
    this.deleteUploadedFileButton = page.getByRole("button", { name: "delete" });
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
  }

  async validateHighSchoolInfoPage(heading: string) {
    await this.schoolName.waitFor({ state: 'visible', timeout: 30000  });
    await expect(this.heading).toHaveText(heading);
  }

  async validateRequiredFields() {
    await this.assertFieldEditable(this.schoolName); 
    await this.assertFieldEditable(this.schoolStreetAddress);
    await this.assertFieldEditable(this.schoolCity);
    await this.assertFieldEditable(this.schoolState);
    await this.assertFieldEditable(this.schoolZip);
    await this.assertFieldEditable(this.gpa);
    await this.assertFieldEditable(this.graduationYear);
    await this.assertFieldVisibleAndEnabled(this.uploadFileButton);
  }

  async assertFieldEditable(element: Locator) {
      await expect(element).toBeEditable();
  }

  async assertFieldVisibleAndEnabled(element: Locator) {
    await expect(element).toBeVisible();
    await expect(element).toBeEnabled();
  }


  async fillRequiredFields(
    name: string, address: string, city: string, state: string, 
    zip: number, gpa: number, year: number, filePath: string
  ) {
    await this.schoolName.fill(name);
    await this.schoolStreetAddress.fill(address);
    await this.schoolCity.fill(city);
    await this.schoolState.click().then(() => this.page.getByRole("option", { name: state }).click());
    await this.schoolZip.click().then(() => this.schoolZip.fill(zip.toString()));
    await this.gpa.click().then(() => this.gpa.fill(gpa.toString()));
    await this.graduationYear.fill(year.toString()).then(() => this.graduationYear.blur());
    await this.uploadFile(path.resolve(filePath));
  }

  async uploadFile(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.uploadFileButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await this.deleteUploadedFileButton.waitFor({ state: "visible" });
  }

  async navigateToNextPage() {
    await this.nextPageButton.click();
  }
}
