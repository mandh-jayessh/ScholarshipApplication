import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SdetScholarshipLandingPage } from "../pages/sdet-scholarship-landing-page";
import { LoginPage } from "../pages/login-page";
import { SignupPage } from "../pages/signup-page";
import { ApplicationStartPage } from "../pages/application-start-page";
import { ExtracurricularActivitiesPage } from "../pages/extracurricular-activities-page";
import { HighSchoolInfoPage } from "../pages/high-school-info-page";
import { EssayPage } from "../pages/essay-page";
import { ReviewApplicationPage } from "../pages/review-application-page";
import testData from "../data/test-data.json";

test.beforeEach("Register the User", async ({ page }) => {
  const apply = new SdetScholarshipLandingPage(page);
  const login = new LoginPage(page);
  const signup = new SignupPage(page);
  const email = faker.internet.email();

  await apply.goto();
  await apply.loginApply();
  await page.waitForLoadState("networkidle");
  await login.fillEmail(email);
  console.log(`Email: ${email}`);
  await login.clickNext();
  await page.waitForLoadState("domcontentloaded");
  const pageTitle = await page.title();
  if ((await page.title()) === "Signup") {
    await signup.submitSignupDetails(
      testData.userDetails.firstName,
      testData.userDetails.lastName,
      testData.userDetails.mobilePhone,
      testData.userDetails.password
    );
  } else if ((await page.title()) === "Login") {
    await login.fillPasswordAndSignIn(testData.userDetails.password);
  }
});

test("Application for SDET Scholarship Program", async ({ page }) => {
  const applicationStart = new ApplicationStartPage(page);
  const curricularActivity = new ExtracurricularActivitiesPage(page);
  const highSchoolInfo = new HighSchoolInfoPage(page);
  const essay = new EssayPage(page);
  const reviewApplication = new ReviewApplicationPage(page);

  await applicationStart.fillUpDetails(
    testData.userAddress.streetAddress,
    testData.userAddress.state,
    testData.userAddress.city,
    testData.userAddress.zip,
    testData.userAddress.country
  );
  await applicationStart.nextPageClick();
  await curricularActivity.addEntry(
    testData.curricularActivities[1].activityName,
    testData.curricularActivities[1].hoursPerWeek,
    testData.curricularActivities[1].description,
    testData.curricularActivities[1].achievements
  );
  await curricularActivity.nextPageClick();
  await curricularActivity.validate2entriesRequired();
  await curricularActivity.addEntry(
    testData.curricularActivities[2].activityName,
    testData.curricularActivities[2].hoursPerWeek,
    testData.curricularActivities[2].description,
    testData.curricularActivities[2].achievements
  );
  await curricularActivity.addEntry(
    testData.curricularActivities[3].activityName,
    testData.curricularActivities[3].hoursPerWeek,
    testData.curricularActivities[3].description,
    testData.curricularActivities[3].achievements
  );
  await curricularActivity.addEntry(
    testData.curricularActivities[0].activityName,
    testData.curricularActivities[0].hoursPerWeek,
    testData.curricularActivities[0].description,
    testData.curricularActivities[0].achievements
  );
  await curricularActivity.nextPageClick();
  await highSchoolInfo.fillUpSchoolDetails(
    testData.highSchoolInfo.schoolName,
    testData.highSchoolInfo.schoolStreet,
    testData.highSchoolInfo.city,
    testData.highSchoolInfo.state,
    testData.highSchoolInfo.zip,
    testData.highSchoolInfo.grade,
    testData.highSchoolInfo.graduationYear
  );

  await essay.validatePresenceOfEssayBoxes();
  await essay.fillupAnimalsAndSchoolsEssays(
    testData.essays.essay1,
    testData.essays.essay2
  );
  await essay.nextPageClick();
  await reviewApplication.reviewPage1Contents();
  await reviewApplication.reviewCurricularPageContents();
  await reviewApplication.reviewhighSchoolInfoPageContents();
  await reviewApplication.reviewEssayPageContents();
  await reviewApplication.submitApplication();
});

test.afterEach("Close and Log Status", async ({ page }, testInfo) => {
  await page.close();
  console.log(
    `Test: "${testInfo.title}" finished with status ${testInfo.status}`
  );
});
