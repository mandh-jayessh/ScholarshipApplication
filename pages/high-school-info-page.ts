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
  calendarIcon: Locator;
  graduationYear: Locator;
  uploadFileButton: Locator;
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
    this.calendarIcon = page.locator("[class$=-DateInput-section]");
    this.graduationYear = page.getByPlaceholder("Enter a date");
    this.uploadFileButton = page.getByText("Upload File");
    this.nextPageButton = this.page.getByRole("button", { name: "Next Page" });
  }

  async validateHighSchoolInfoPage() {
    await this.schoolName.waitFor({ state: "visible" });
    await expect(this.heading).toHaveText("High School Information");
  }

  async fillUpSchoolDetails(
    name: string,
    address: string,
    city: string,
    state: string,
    zip: number,
    gpa: number,
    year: number
  ) {
    await this.fillSchoolName(name);
    await this.fillStreetAddress(address);
    await this.fillSchoolCity(city);
    await this.fillSchoolState(state);
    await this.fillSchoolZip(zip);
    await this.fillGPA(gpa);
    await this.fillGraduationYear(year);
    await this.uploadFile();
  }

  async fillSchoolName(name: string) {
    expect(this.schoolName).toBeEditable();
    await this.schoolName.fill(name);
  }

  async fillStreetAddress(address: string) {
    expect(this.schoolStreetAddress).toBeEditable();
    await this.schoolStreetAddress.fill(address);
  }

  async fillSchoolCity(city: string) {
    expect(this.schoolCity).toBeEditable();
    await this.schoolCity.fill(city);
  }

  async fillSchoolState(state: string) {
    expect(this.schoolState).toBeEditable();
    await this.schoolState.click();
    await this.page.getByRole("option", { name: state }).click();
  }

  async fillSchoolZip(zip: number) {
    expect(this.schoolZip).toBeEditable();
    await this.schoolZip.click();
    await this.schoolZip.fill(zip.toString());
  }

  async fillGPA(gpa: number) {
    expect(this.gpa).toBeEditable();
    await this.gpa.click();
    await this.gpa.fill(gpa.toString());
  }

  async fillGraduationYear(year: number) {
    expect(this.graduationYear).toBeEditable();
    await this.graduationYear.fill(year.toString());
  }

  async uploadFile() {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await expect(this.uploadFileButton).toBeEnabled();
    await this.uploadFileButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
      path.join(__dirname, "My School Transcript.pdf")
    );
    await this.page
      .getByRole("button", { name: "My School Transcript.pdf" })
      .waitFor({ state: "visible" });
  }

  async nextPageClick() {
    await this.nextPageButton.click();
  }
}
