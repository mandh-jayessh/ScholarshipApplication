import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

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

test.beforeEach("Register the User", async ({ page }) => {
  const landing = new SdetScholarshipLandingPage(page);
  const userRegister = new UserRegisterPage(page);
  globalThis.email = faker.internet.email();

  await landing.goto();
  await landing.validatelandingPage(headerData.LandingPage);
  await landing.loginApply();
  await userRegister.fillEmail(globalThis.email);
  console.log(`Email: ${globalThis.email}`);
  await userRegister.clickNext();
  await userRegister.waitForLoad();
  if ((await page.title()) === "Signup") {
    await userRegister.validateSignupPage(headerData.SignUpPage);
    await userRegister.submitSignupDetails(
      userData.firstName,
      userData.lastName,
      userData.mobilePhone,
      userData.password
    );
  } else if ((await page.title()) === "Login") {
    await userRegister.validateLoginPage(headerData.LoginPage);
    await userRegister.enterPasswordAndSignIn(userData.password);
  }
});
for (let i = 0; i < 1; i++) {
  test(`Application for SDET Scholarship Program - Run No. ${i + 1}`, async ({
    page,
  }) => {
    const getToKnowYou = new GetToKnowYouPage(page);
    const curricularActivity = new ExtracurricularActivitiesPage(page);
    const highSchoolInfo = new HighSchoolInfoPage(page);
    const essay = new EssayPage(page);
    const reviewApplication = new ReviewApplicationPage(page);
    const submittedApplication = new SubmittedApplicationPage(page);

    await getToKnowYou.validateGetToKnowYouPage(headerData.GetToKnowYouPage);
    await getToKnowYou.fillUpDetails(
      userData.streetAddress,
      userData.state,
      userData.city,
      userData.zip,
      userData.country
    );
    await getToKnowYou.nextPageClick();
    await curricularActivity.validateActivitiesPage(headerData.ExtracurricularActivitiesPage);
    await curricularActivity.addEntry(
      activityData[0].activityName,
      activityData[0].yearsInvolved,
      activityData[0].description,
      activityData[0].achievements
    );
    await curricularActivity.nextPageClick();
    await curricularActivity.validate2entriesRequired();
    for (let i = 1; i <= 3; i++) {
      await curricularActivity.addEntry(
        activityData[i].activityName,
        activityData[i].yearsInvolved,
        activityData[i].description,
        activityData[i].achievements
      );
    }
    await curricularActivity.nextPageClick();
    await highSchoolInfo.validateHighSchoolInfoPage(headerData.HighSchoolInfoPage);
    await highSchoolInfo.fillUpSchoolDetails(
      schoolData.schoolName,
      schoolData.schoolStreet,
      schoolData.city,
      schoolData.state,
      schoolData.zip,
      schoolData.grade,
      schoolData.graduationYear
    );
    await highSchoolInfo.nextPageClick();
    await essay.validateEssayPage(headerData.EssayPage);
    await essay.validatePresenceOfEssayBoxes();
    await essay.fillupAnimalsAndSchoolsEssays(
      essayData.essay1,
      essayData.essay2
    );
    await essay.nextPageClick();
    await reviewApplication.validateReviewPage();
    await reviewApplication.reviewPage1Contents();
    await reviewApplication.reviewCurricularPageContents();
    await reviewApplication.reviewhighSchoolInfoPageContents();
    await reviewApplication.reviewEssayPageContents();
    const url = page.url();
    console.log(`URL: ${url}`);
    await reviewApplication.submitApplication();
    await reviewApplication.confirmSubmission();
    await page.goto(url);
    await submittedApplication.validateNoEditing();
  });
}

test.afterEach("Close and Log Status", async ({ page }, testInfo) => {
  await page.close();
  console.log(
    `Test: "${testInfo.title}" finished with status ${testInfo.status}`
  );
});
