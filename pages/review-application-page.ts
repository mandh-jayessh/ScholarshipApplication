import { Page, Locator, expect } from "@playwright/test";
import userData from "../data/user-details.json";
import schoolData from "../data/high-school-info.json";
import activityData from "../data/curricular-activities.json";
import essayData from "../data/essays.json";

export class ReviewApplicationPage {
  page: Page;
  application_tab: Locator;
  application_section: Locator;
  documents_tab: Locator;
  documents_section: Locator;
  editButtons: Locator;
  continueApplicationLink: Locator;
  expandGetToKnow: Locator;
  expandCurricularActivities: Locator;
  expandHighSchoolInfo: Locator;
  expandEssay: Locator;
  submitButton: Locator;
  printApplicationButton: Locator;
  firstName: Locator;
  lastName: Locator;
  email: Locator;
  userStreetAddress: Locator;
  userState: Locator;
  userCity: Locator;
  userZip: Locator;
  userCountry: Locator;
  activity1: Locator;
  activity1section: Locator;
  activity2: Locator;
  activity2section: Locator;
  activity3: Locator;
  activity3section: Locator;
  activity4: Locator;
  activity4section: Locator;
  schoolName: Locator;
  schoolstreet: Locator;
  schoolcity: Locator;
  schoolstate: Locator;
  schoolZip: Locator;
  grade: Locator;
  graduationYear: Locator;
  essayAboutSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.application_tab = page.getByRole("tab", { name: "Application" });
    this.application_section = page.locator("[id*='-panel-application']");
    this.documents_tab = page.getByRole("tab", { name: "Documents" });
    this.documents_section = page.locator("[id*='-panel-documents']");
    this.editButtons = page.getByText("Edit");
    this.continueApplicationLink = page.getByRole("link", {
      name: "Continue Application",
    });
    this.expandGetToKnow = page.getByRole("button", {
      name: "1.Lets get to know you! Edit",
    });
    this.expandCurricularActivities = page.getByRole("button", {
      name: "2.Extracurricular Activities Edit",
    });
    this.expandHighSchoolInfo = page.getByRole("button", {
      name: "3.High School Information Edit",
    });
    this.expandEssay = page.getByRole("button", { name: "4.Essay Edit" });
    this.submitButton = page.locator("span").getByText("Submit");
    this.printApplicationButton = page
      .locator("span")
      .getByText("Print Application");
    this.firstName = page.locator("span:has-text('First Name')");
    this.lastName = page.locator("span:has-text('Last Name')");
    this.email = page.locator("span:has-text('Email Address')");
    this.userStreetAddress = page
      .locator("span:has-text('Street Address')")
      .first();
    this.userState = page.locator("span:has-text('State ')").first();
    this.userCity = page.locator("span:has-text('City')").first();
    this.userZip = page.locator("span:has-text('Zip Code')").first();
    this.userCountry = page.locator("span:has-text('Country')");
    this.activity1 = page.getByRole("button", { name: "Yoga" });
    this.activity1section = page.getByLabel("Yoga");
    this.activity2 = page.getByRole("button", { name: "Singing" });
    this.activity2section = page.getByLabel("Singing");
    this.activity3 = page.getByRole("button", { name: "Dancing" });
    this.activity3section = page.getByLabel("Dancing");
    this.activity4 = page.getByRole("button", { name: "Coding" });
    this.activity4section = page.getByLabel("Coding");
    this.schoolName = page.locator("span:has-text('High School Name')");
    this.schoolstreet = page.locator("span:has-text('High School Street')");
    this.schoolcity = page.locator("span:has-text('High School City')");
    this.schoolstate = page.locator("span:has-text('High School State')");
    this.schoolZip = page.locator("span:has-text('High School Zip')");
    this.grade = page.locator("span:has-text('GPA')");
    this.graduationYear = page.locator("span:has-text('Graduation')");
    this.essayAboutSection = page.locator("span:has-text('Essay About')");
  }

  async validateReviewPage() {
    await this.application_section.waitFor({ state: "visible" });
    await this.documents_tab.click();
    await expect(this.documents_section).toBeVisible();
    await this.application_tab.click();
    await expect(this.editButtons).toHaveCount(4);
    await expect(this.continueApplicationLink).toBeVisible();
    await expect(this.application_section).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.printApplicationButton).toBeVisible();
  }

  async openCloseSection(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async reviewPage1Contents() {
    await this.openCloseSection(this.expandGetToKnow);
    await expect(this.firstName).toContainText(userData.firstName);
    await expect(this.lastName).toContainText(userData.lastName);
    await expect(this.email).toContainText(globalThis.email, {
      ignoreCase: true,
    });
    await expect(this.userStreetAddress).toContainText(userData.streetAddress);
    await expect(this.userState).toContainText(userData.state);
    await expect(this.userCity).toContainText(userData.city);
    await expect(this.userZip).toContainText(userData.zip);
    await expect(this.userCountry).toContainText(userData.country);
    await this.openCloseSection(this.expandGetToKnow);
  }

  async reviewCurricularPageContents() {
    await this.openCloseSection(this.expandCurricularActivities);
    const activities = [
      {
        button: this.activity1,
        section: this.activity1section,
        data: activityData[0],
      },
      {
        button: this.activity2,
        section: this.activity2section,
        data: activityData[1],
      },
      {
        button: this.activity3,
        section: this.activity3section,
        data: activityData[2],
      },
      {
        button: this.activity4,
        section: this.activity4section,
        data: activityData[3],
      },
    ];
    for (const activity of activities) {
      await activity.button.click();
      await expect(activity.section).toContainText(activity.data.activityName);
      await expect(activity.section).toContainText(
        activity.data.yearsInvolved.toString()
      );
      await expect(activity.section).toContainText(activity.data.description);
      await expect(activity.section).toContainText(activity.data.achievements);
      await activity.button.click();
    }
    await this.openCloseSection(this.expandCurricularActivities);
  }

  async reviewhighSchoolInfoPageContents() {
    await this.openCloseSection(this.expandHighSchoolInfo);
    await expect(this.schoolName).toContainText(schoolData.schoolName);
    await expect(this.schoolstreet.first()).toContainText(
      schoolData.schoolStreet
    );
    await expect(this.schoolcity).toContainText(schoolData.city);
    await expect(this.schoolstate).toContainText(schoolData.state);
    await expect(this.schoolZip).toContainText(schoolData.zip.toString());
    await expect(this.grade).toContainText(schoolData.grade.toString());
    await expect(this.graduationYear).toContainText(
      schoolData.graduationYear.toString()
    );
    await this.openCloseSection(this.expandHighSchoolInfo);
  }

  async reviewEssayPageContents() {
    await this.openCloseSection(this.expandEssay);
    await expect(this.essayAboutSection.locator("nth=0")).toContainText(
      essayData.essay1
    );
    await expect(this.essayAboutSection.locator("nth=1")).toContainText(
      essayData.essay2
    );
    await this.openCloseSection(this.expandEssay);
  }

  async submitApplication() {
    await this.submitButton.click();
  }
}
