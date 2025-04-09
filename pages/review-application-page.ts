import { Page, Locator, expect } from "@playwright/test";
import testData from "../data/test-data.json";

export class ReviewApplicationPage {
  page: Page;
  application_tab: Locator
  application_section: Locator
  documents_tab: Locator
  documents_section: Locator
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
  schoolName: Locator
  schoolstreet: Locator
  schoolcity: Locator
  schoolstate: Locator
  schoolZip: Locator
  grade: Locator
  graduationYear: Locator
  essayAboutSection: Locator

  constructor(page: Page) {
    this.page = page;
    this.application_tab = page.getByRole('tab', { name: 'Application' })
    this.application_section = page.locator("[id*='-panel-application']")
    this.documents_tab = page.getByRole('tab', { name: 'Documents' })
    this.documents_section = page.locator("[id*='-panel-documents']")
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
    this.printApplicationButton = page.locator("span").getByText("Print Application")
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
    this.activity1 = page.getByRole("button", { name: "Singing" })
    this.activity1section = page.getByLabel('Singing')
    this.activity2 = page.getByRole("button", { name: "Dancing" })
    this.activity2section = page.getByLabel('Dancing')
    this.activity3 = page.getByRole("button", { name: "Coding" })
    this.activity3section = page.getByLabel('Coding')
    this.activity4 = page.getByRole("button", { name: "Yoga" })
    this.activity4section = page.getByLabel('Yoga')
    this.schoolName =  page.locator("span:has-text('High School Name')")
    this.schoolstreet = page.locator("span:has-text('High School Street')")
    this.schoolcity = page.locator("span:has-text('High School City')")
    this.schoolstate = page.locator("span:has-text('High School State')")
    this.schoolZip = page.locator("span:has-text('High School Zip')")
    this.grade = page.locator("span:has-text('GPA')")
    this.graduationYear = page.locator("span:has-text('Graduation')")
    this.essayAboutSection = page.locator("span:has-text('Essay About')");
  }

  async validateReviewPage() {
    await this.application_section.waitFor({ state: "visible" });
    await this.documents_tab.click()
    await expect(this.documents_section).toBeVisible()
    await this.application_tab.click()
    await expect(this.application_section).toBeVisible()
  }

  async openCloseSection(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async reviewPage1Contents() {
    await this.openCloseSection(this.expandGetToKnow);
    await expect(this.firstName).toContainText(testData.userDetails.firstName);
    await expect(this.lastName).toContainText(testData.userDetails.lastName);
    await expect(this.email).toContainText("@");
    await expect(this.userStreetAddress).toContainText(
      testData.userAddress.streetAddress
    );
    await expect(this.userState).toContainText(testData.userAddress.state);
    await expect(this.userCity).toContainText(testData.userAddress.city);
    await expect(this.userZip).toContainText(testData.userAddress.zip);
    await expect(this.userCountry).toContainText(testData.userAddress.country);
    await this.openCloseSection(this.expandGetToKnow);
  }

  async reviewCurricularPageContents(){
    await this.openCloseSection(this.expandCurricularActivities);
      const activities = [
      { button: this.activity1, section: this.activity1section, data: testData.curricularActivities[1] },
      { button: this.activity2, section: this.activity2section, data: testData.curricularActivities[2] },
      { button: this.activity3, section: this.activity3section, data: testData.curricularActivities[3] },
      { button: this.activity4, section: this.activity4section, data: testData.curricularActivities[0] },
    ];
    for (const activity of activities) {
      await activity.button.click();
      await expect(activity.section).toContainText(activity.data.activityName);
      await expect(activity.section).toContainText(activity.data.hoursPerWeek.toString());
      await expect(activity.section).toContainText(activity.data.description);
      await expect(activity.section).toContainText(activity.data.achievements);
      await activity.button.click(); 
    }
    await this.openCloseSection(this.expandCurricularActivities);
  }

  async reviewhighSchoolInfoPageContents(){
    await this.openCloseSection(this.expandHighSchoolInfo);
    await expect(this.schoolName).toContainText(testData.highSchoolInfo.schoolName)
    await expect(this.schoolstreet.first()).toContainText(testData.highSchoolInfo.schoolStreet)
    await expect(this.schoolcity).toContainText(testData.highSchoolInfo.city)
    await expect(this.schoolstate).toContainText(testData.highSchoolInfo.state)
    await expect(this.schoolZip).toContainText(testData.highSchoolInfo.zip.toString())
    await expect(this.grade).toContainText(testData.highSchoolInfo.grade.toString())
    await expect(this.graduationYear).toContainText(testData.highSchoolInfo.graduationYear.toString())
    await this.openCloseSection(this.expandHighSchoolInfo);
  }

  async reviewEssayPageContents(){
    await this.openCloseSection(this.expandEssay);
    await expect(this.essayAboutSection.locator("nth=0")).toContainText(testData.essays.essay1)
    await expect(this.essayAboutSection.locator("nth=1")).toContainText(testData.essays.essay2)
    await this.openCloseSection(this.expandEssay);
  }

  async submitApplication() {
    await this.submitButton.click();
  }
}
