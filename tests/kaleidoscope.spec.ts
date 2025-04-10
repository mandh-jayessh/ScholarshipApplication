import { test, expect, chromium, Browser, Page, BrowserContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { SdetScholarshipLandingPage } from "../pages/landing-page";
import { UserRegisterPage } from "../pages/user-register-page";
import { GetToKnowYouPage } from "../pages/get-to-know-you-page";
import { ExtracurricularActivitiesPage } from "../pages/extracurricular-activities-page";
import { HighSchoolInfoPage } from "../pages/high-school-info-page";
import { EssayPage } from "../pages/essay-page";
import { ReviewApplicationPage } from "../pages/review-application-page";
import { SubmittedApplicationPage } from "../pages/submitted-application-page";

import userData from "../data/test-data/user-details.json";
import schoolData from "../data/test-data/high-school-info.json";
import activityData from "../data/test-data/curricular-activities.json";
import essayData from "../data/test-data/essays.json";
import headerData from "../data/validation-data/heading-data.json";

test.describe("Kaleidoscope", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let noOfRuns: number = 2;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    globalThis.email = faker.internet.email();
    console.log(`Generated Email: ${globalThis.email}`);
  });
  for (let run = 1; noOfRuns <= 2; run++) {
  test(`1. Register User - Run No: ${run}`, async () => {
    const landing = new SdetScholarshipLandingPage(page);
    const userRegister = new UserRegisterPage(page);

    await landing.goto();
    await landing.validatelandingPage(headerData.LandingPage);
    await landing.loginApply();
    await userRegister.fillEmail(globalThis.email);
    await userRegister.clickNext();
    await userRegister.waitForLoad();

    if ((await page.title()) === "Signup") {
      await userRegister.validateSignupPage(headerData.SignUpPage);
      await userRegister.submitSignupDetails(
        userData.firstName, userData.lastName,
        userData.mobilePhone, userData.password
      );
    } else if ((await page.title()) === "Login") {
      await userRegister.validateLoginPage(headerData.LoginPage);
      await userRegister.enterPasswordAndSignIn(userData.password);
    }
  });

  test(`2. Fill 'Get to Know You' Page - Run No: ${run}`, async () => {
    const getToKnowYou = new GetToKnowYouPage(page);
    await getToKnowYou.validateGetToKnowYouPage(headerData.GetToKnowYouPage);
    await getToKnowYou.fillUpDetails(
      userData.streetAddress, userData.state, userData.city,
      userData.zip, userData.country
    );
    await getToKnowYou.nextPageClick();
  });

  test(`3. Fill 'Extracurricular Activities' Page - Run No: ${run}`, async () => {
    const curricularActivity = new ExtracurricularActivitiesPage(page);
    await curricularActivity.validateActivitiesPage(headerData.ExtracurricularActivitiesPage);
    await curricularActivity.addEntry(
      activityData[0].activityName, activityData[0].yearsInvolved,
      activityData[0].description, activityData[0].achievements
    );
    await curricularActivity.nextPageClick();
    await curricularActivity.validate2entriesRequired();
    for (let i = 1; i < 4; i++) {
      await curricularActivity.addEntry(
        activityData[i].activityName, activityData[i].yearsInvolved,
        activityData[i].description, activityData[i].achievements
      );
    }
    await curricularActivity.nextPageClick();
  });

  test(`4. Fill 'High School Info' Page - Run No: ${run}`, async () => {
    const highSchoolInfo = new HighSchoolInfoPage(page);
    await highSchoolInfo.validateHighSchoolInfoPage(headerData.HighSchoolInfoPage);
    await highSchoolInfo.fillUpSchoolDetails(
      schoolData.schoolName, schoolData.schoolStreet, schoolData.city,
      schoolData.state, schoolData.zip,
      schoolData.grade, schoolData.graduationYear
    );
    await highSchoolInfo.nextPageClick();
  });

  test(`5. Fill 'Essay' Page - Run No: ${run}`, async () => {
    const essay = new EssayPage(page);
    await essay.validateEssayPage(headerData.EssayPage);
    await essay.validatePresenceOfEssayBoxes();
    await essay.fillupAnimalsAndSchoolsEssays(essayData.essay1, essayData.essay2);
    await essay.nextPageClick();
  });

  test(`6. Review Application ${run}`, async () => {
    const reviewApplication = new ReviewApplicationPage(page);
    await reviewApplication.validateReviewPage();
    await reviewApplication.reviewUserContents();
    await reviewApplication.reviewCurricularPageContents();
    await reviewApplication.reviewHighSchoolInfoPageContents();
    await reviewApplication.reviewEssayPageContents();

    const url = page.url();
    console.log(`URL: ${url}`);
    await reviewApplication.submitApplication();
    await reviewApplication.confirmSubmission();
    await page.goto(url);
  });

  test(`7. Submit Application - Run No: ${run}`, async () => {
    const submittedApplication = new SubmittedApplicationPage(page);
    await submittedApplication.validateNoEditing();
    console.log("Application submitted successfully");
  });
}

  test.afterEach("Close and Log Status", async ({ page }, testInfo) => {
    await page.close();
    console.log(`Test: "${testInfo.title}" finished with status ${testInfo.status}`);
    console.log(`Ran in Worker ${testInfo.workerIndex}`)  
  });

  test.afterAll(async () => {
    await browser.close();
    console.log("Browser closed");
  });
});
