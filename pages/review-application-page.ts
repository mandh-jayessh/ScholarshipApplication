import { Page, Locator, expect } from "@playwright/test";
import testData from "../data/test-data.json";

export class ReviewApplicationPage {
  page: Page;
  expandGetToKnow: Locator;
  expandCirricularActivities: Locator;
  expandHighSchoolInfo: Locator;
  expandEssay: Locator;
  submitButton: Locator;
  firstName: Locator;
  lastName: Locator;
  email: Locator;
  userStreetSAddress: Locator;
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
    this.expandGetToKnow = page.getByRole("button", {
      name: "1.Lets get to know you! Edit",
    });
    this.expandCirricularActivities = page.getByRole("button", {
      name: "2.Extracurricular Activities Edit",
    });
    this.expandHighSchoolInfo = page.getByRole("button", {
      name: "3.High School Information Edit",
    });
    this.expandEssay = page.getByRole("button", { name: "4.Essay Edit" });
    this.submitButton = page.locator("span").getByText("Submit");
    this.firstName = page.locator("span:has-text('First Name')");
    this.lastName = page.locator("span:has-text('Last Name')");
    this.email = page.locator("span:has-text('Email Address')");
    this.userStreetSAddress = page
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

  async openCloseGetToKnow(){
    await this.expandGetToKnow.waitFor({ state: "visible" });
    await this.expandGetToKnow.click();
}
  async reviewPage1Contents() {
    await this.openCloseGetToKnow()
    await expect(this.firstName).toContainText(testData.userDetails.firstName);
    await expect(this.lastName).toContainText(testData.userDetails.lastName);
    await expect(this.email).toContainText("@");
    await expect(this.userStreetSAddress).toContainText(
      testData.userAddress.streetAddress
    );
    await expect(this.userState).toContainText(testData.userAddress.state);
    await expect(this.userCity).toContainText(testData.userAddress.city);
    await expect(this.userZip).toContainText(testData.userAddress.zip);
    await expect(this.userCountry).toContainText(testData.userAddress.country);
    await this.openCloseGetToKnow()
  }

  async openCloseCurricularActivities(){
    await this.expandCirricularActivities.scrollIntoViewIfNeeded()
    await this.expandCirricularActivities.click();
  }

  async reviewCurricularPageContents(){
    await this.openCloseCurricularActivities()

    await this.activity1.click();
    await expect(this.page.getByLabel('Singing')).toContainText(testData.curricularActivities[1].activityName);
    await expect(this.page.getByLabel('Singing')).toContainText(testData.curricularActivities[1].hoursPerWeek.toString());
    await expect(this.page.getByLabel('Singing')).toContainText(testData.curricularActivities[1].description);
    await expect(this.page.getByLabel('Singing')).toContainText(testData.curricularActivities[1].achievements);
    await this.activity1.click();

    await this.activity2.click();
    await expect(this.activity2section).toContainText(testData.curricularActivities[2].activityName);
    await expect(this.activity2section).toContainText(testData.curricularActivities[2].hoursPerWeek.toString());
    await expect(this.activity2section).toContainText(testData.curricularActivities[2].description);
    await expect(this.activity2section).toContainText(testData.curricularActivities[2].achievements);
    await this.activity2.click();

    await this.activity3.click();
    await expect(this.activity3section).toContainText(testData.curricularActivities[3].activityName);
    await expect(this.activity3section).toContainText(testData.curricularActivities[3].hoursPerWeek.toString());
    await expect(this.activity3section).toContainText(testData.curricularActivities[3].description);
    await expect(this.activity3section).toContainText(testData.curricularActivities[3].achievements);
    await this.activity3.click();

    await this.activity4.click();
    await expect(this.activity4section).toContainText(testData.curricularActivities[0].activityName);
    await expect(this.activity4section).toContainText(testData.curricularActivities[0].hoursPerWeek.toString());
    await expect(this.activity4section).toContainText(testData.curricularActivities[0].description);
    await expect(this.activity4section).toContainText(testData.curricularActivities[0].achievements);
    await this.activity4.click();
    await this.openCloseCurricularActivities()
  }

  async openCloseSchoolInfo(){
    await this.expandHighSchoolInfo.scrollIntoViewIfNeeded()
    await this.expandHighSchoolInfo.click(); 
  }

  async reviewhighSchoolInfoPageContents(){
   await this.openCloseSchoolInfo()
    await expect(this.schoolName).toContainText(testData.highSchoolInfo.schoolName)
    await expect(this.schoolstreet.first()).toContainText(testData.highSchoolInfo.schoolStreet)
    await expect(this.schoolcity).toContainText(testData.highSchoolInfo.city)
    await expect(this.schoolstate).toContainText(testData.highSchoolInfo.state)
    await expect(this.schoolZip).toContainText(testData.highSchoolInfo.zip.toString())
    await expect(this.grade).toContainText(testData.highSchoolInfo.grade.toString())
    await expect(this.graduationYear).toContainText(testData.highSchoolInfo.graduationYear.toString())
    await this.openCloseSchoolInfo()
  }

  async openCloseEssaySection(){
    await this.expandEssay.scrollIntoViewIfNeeded()
    await this.expandEssay.click()
  }

  async reviewEssayPageContents(){
    await this.openCloseEssaySection()
    await expect(this.essayAboutSection.locator("nth=0")).toContainText(testData.essays.essay1)
    await expect(this.essayAboutSection.locator("nth=1")).toContainText(testData.essays.essay2)
    await this.openCloseEssaySection()
  }

  async submitApplication() {
    await this.submitButton.click();
  }
}
