import { Page, Locator, expect } from "@playwright/test";
import activityData from "../data/test-data/curricular-activities.json";
import headerData from "../data/validation-data/heading-data.json";

export class ReviewYourApplicationPage {
  page: Page;
  applicationTab: Locator;
  applicationSection: Locator;
  documentsTab: Locator;
  documentsSection: Locator;
  editButtons: Locator;
  continueApplicationLink: Locator;
  expandGetToKnow: Locator;
  expandCurricularActivities: Locator;
  expandHighSchoolInfo: Locator;
  expandEssay: Locator;
  submitButton: Locator;
  printApplicationButton: Locator;

  submitted_fields_section: Locator;
  activity1: Locator;
  activity1Section: Locator;
  activity2: Locator;
  activity2Section: Locator;
  activity3: Locator;
  activity3Section: Locator;
  activity4: Locator;
  activity4Section: Locator;
  
  essayAboutSection: Locator;
  submissionConfirmText: Locator;


  constructor(page: Page) {
    this.page = page;
    this.applicationTab = page.getByRole("tab", { name: "Application" });
    this.applicationSection = page.getByRole("tabpanel", { name: "Application" });
    this.documentsTab = page.getByRole("tab", { name: "Documents" });
    this.documentsSection = page.getByRole("tabpanel", { name: "Documents" })
    this.editButtons = page.getByText("Edit");
    this.continueApplicationLink = page.getByRole("link", { name: "Continue Application" });
    this.expandGetToKnow = page.getByRole("button", { name: headerData.GetToKnowYouPage });
    this.expandCurricularActivities = page.getByRole("button", { name: headerData.ExtracurricularActivitiesPage });
    this.expandHighSchoolInfo = page.getByRole("button", { name: headerData.HighSchoolInfoPage });
    this.expandEssay = page.getByRole("button", { name: headerData.EssayPage });
    this.submitButton = page.getByRole("button", { name: "Submit" })
    this.printApplicationButton = page.getByRole("button", { name: "Print Application" })
    this.submitted_fields_section = page.getByRole("list")

    this.activity1 = page.getByRole("button", { name: activityData[0].activityName });
    this.activity1Section = page.getByLabel(activityData[0].activityName);
    this.activity2 = page.getByRole("button", { name: activityData[1].activityName });
    this.activity2Section = page.getByLabel(activityData[1].activityName);
    this.activity3 = page.getByRole("button", { name: activityData[2].activityName });
    this.activity3Section = page.getByLabel(activityData[2].activityName);
    this.activity4 = page.getByRole("button", { name: activityData[3].activityName });
    this.activity4Section = page.getByLabel(activityData[3].activityName);

    this.essayAboutSection = page.getByRole("listitem").filter({ hasText: "Essay about"})

    this.submissionConfirmText = page.getByText("Application submitted");
  }

  async validateReviewPage() {
    await this.applicationSection.waitFor({ state: "visible" });
    await this.documentsTab.click();
    await expect(this.documentsSection).toBeVisible();
    await this.applicationTab.click();
    await expect(this.editButtons).toHaveCount(4);
    await expect(this.continueApplicationLink).toBeVisible();
    await expect(this.applicationSection).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.printApplicationButton).toBeVisible();
  }


  async openCloseSection(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  getFieldValue(label: string): Locator {
    return this.page.getByRole("listitem").filter({ hasText: label })
  }

  async reviewUserContents(
    fname: string, lname: string, email: string,
    address: string, state: string, city: string,
    zip: string, country: string
  ) {
    await this.openCloseSection(this.expandGetToKnow);
    await expect(this.getFieldValue("First Name")).toContainText(fname);
    await expect(this.getFieldValue("Last Name")).toContainText(lname);
    await expect(this.getFieldValue("Email Address")).toContainText(email, { ignoreCase: true });
    await expect(this.getFieldValue("Street Address").first()).toContainText(address);
    await expect(this.getFieldValue("State (Full)")).toContainText(state);
    await expect(this.getFieldValue("City")).toContainText(city);
    await expect(this.getFieldValue("Zip Code")).toContainText(zip);
    await expect(this.getFieldValue("Country")).toContainText(country);
    await this.openCloseSection(this.expandGetToKnow);
  }

  // generic assertion
  async reviewCurricularPageContents() {
    await this.openCloseSection(this.expandCurricularActivities);
    const activities = [
      {
        button: this.activity1, section: this.activity1Section, data: activityData[0],
      },
      {
        button: this.activity2, section: this.activity2Section, data: activityData[1],
      },
      {
        button: this.activity3, section: this.activity3Section, data: activityData[2],
      },
      {
        button: this.activity4, section: this.activity4Section, data: activityData[3],
      },
    ];
    for (const activity of activities) {
      await activity.button.click();
      await expect(activity.section).toContainText(activity.data.activityName);
      await expect(activity.section).toContainText(activity.data.yearsInvolved.toString());
      await expect(activity.section).toContainText(activity.data.description);
      await expect(activity.section).toContainText(activity.data.achievements);
      await activity.button.click();
    }
    await this.openCloseSection(this.expandCurricularActivities);
  }

  async reviewHighSchoolInfoPageContents(
    name: string, address: string, city: string, state: string, 
    zip: number, gpa: number, year: number
  ) {
    await this.openCloseSection(this.expandHighSchoolInfo);
    await expect(this.getFieldValue("High School Name")).toContainText(name);
    await expect(this.getFieldValue("High School Street Address").first()).toContainText(address);
    await expect(this.getFieldValue("High School City")).toContainText(city);
    await expect(this.getFieldValue("High School State (Full)")).toContainText(state);
    await expect(this.getFieldValue("High School Zip Code")).toContainText(zip.toString());
    await expect(this.getFieldValue("GPA")).toContainText(gpa.toString());
    await expect(this.getFieldValue("Year of High School Graduation")).toContainText(year.toString());
    await this.openCloseSection(this.expandHighSchoolInfo);
  }

  async reviewEssayPageContents(essay1: string, essay2: string) {
    await this.openCloseSection(this.expandEssay);
    await expect(this.getFieldValue("Essay about").nth(0)).toContainText(essay1);
    await expect(this.getFieldValue("Essay about").nth(1)).toContainText(essay2);
    await this.openCloseSection(this.expandEssay);
  }

  async submitApplication() {
    await this.submitButton.click();
  }

  async confirmSubmission() {
    await this.submissionConfirmText.waitFor({ state: "visible" });
  }
}
