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

test.describe("Kaleidoscope", () => {
  let landing: SdetScholarshipLandingPage;
  let userRegister: UserRegisterPage;
  let getToKnowYou: GetToKnowYouPage;
  let curricularActivity: ExtracurricularActivitiesPage;
  let highSchoolInfo: HighSchoolInfoPage;
  let essay: EssayPage;
  let reviewApplication: ReviewApplicationPage;
  let submittedApplication: SubmittedApplicationPage;
  let noOfRuns: number = 2;

  test.beforeEach("Register the User", async ({ page }) => {
    landing = new SdetScholarshipLandingPage(page);
    userRegister = new UserRegisterPage(page);
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
        userData.firstName, userData.lastName,
        userData.mobilePhone, userData.password
      );
    } else if ((await page.title()) === "Login") {
      await userRegister.validateLoginPage(headerData.LoginPage);
      await userRegister.enterPasswordAndSignIn(userData.password);
    }
  });

  for (let run = 1; run <= noOfRuns; run++) {
    test(`Fill Application - Run No. ${run}`, async ({ page }) => {
      getToKnowYou = new GetToKnowYouPage(page);
      curricularActivity = new ExtracurricularActivitiesPage(page);
      highSchoolInfo = new HighSchoolInfoPage(page);
      essay = new EssayPage(page);
      reviewApplication = new ReviewApplicationPage(page);
      submittedApplication = new SubmittedApplicationPage(page);
      // Fill Get to Know Page
      await getToKnowYou.validateGetToKnowYouPage(headerData.GetToKnowYouPage);
      await getToKnowYou.fillUpDetails(
        userData.streetAddress, userData.state, userData.city,
        userData.zip, userData.country
      );
      await getToKnowYou.nextPageClick();

      // Fill Extra Curricular Activities Page
      await curricularActivity.validateActivitiesPage( headerData.ExtracurricularActivitiesPage );
      await curricularActivity.addEntry(
        activityData[0].activityName, activityData[0].yearsInvolved,
        activityData[0].description, activityData[0].achievements
      );
      await curricularActivity.nextPageClick();
      // Validate that at least 2 Extracurricular Activities are required, when not providing enough.
      await curricularActivity.validate2entriesRequired();
      // Finish page by providing 4 Activities(add 3 more as 1 is added earlier)
      for (let i = 1; i <= 3; i++) {
        await curricularActivity.addEntry(
          activityData[i].activityName, activityData[i].yearsInvolved, 
          activityData[i].description, activityData[i].achievements
        );
      }
      await curricularActivity.nextPageClick();

      // Fill High School Info Page
      await highSchoolInfo.validateHighSchoolInfoPage(headerData.HighSchoolInfoPage);
      await highSchoolInfo.fillUpSchoolDetails(
        schoolData.schoolName, schoolData.schoolStreet,
        schoolData.city, schoolData.state, schoolData.zip,
        schoolData.grade, schoolData.graduationYear
      );
      await highSchoolInfo.nextPageClick();

      // Fill Essay Page
      await essay.validateEssayPage(headerData.EssayPage);
      await essay.validatePresenceOfEssayBoxes();
      await essay.fillupAnimalsAndSchoolsEssays( essayData.essay1, essayData.essay2 );
      await essay.nextPageClick();

      // Validate things in Review Page
      await reviewApplication.validateReviewPage();
      await reviewApplication.reviewUserContents();
      await reviewApplication.reviewCurricularPageContents();
      await reviewApplication.reviewhighSchoolInfoPageContents();
      await reviewApplication.reviewEssayPageContents();
      // Capture the Page URL so it can be redirected back to after Submitting the Application.
      const url = page.url();
      console.log(`URL: ${url}`);
      await reviewApplication.submitApplication();
      await reviewApplication.confirmSubmission();
      await page.goto(url);

      // Validate Editing is not allowed after Application has been submitted.
      await submittedApplication.validateNoEditing();
    });
  }

  test.afterEach("Close and Log Status", async ({ page }, testInfo) => {
    await page.close();
    console.log(
      `Test: "${testInfo.title}" finished with status ${testInfo.status}`
    );
  });
});
