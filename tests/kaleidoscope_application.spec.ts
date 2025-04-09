import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SdetScholarshipLandingPage } from "../pages/landing-page";
import { LoginPage } from "../pages/login-page";
import { SignupPage } from "../pages/signup-page";
import { ApplicationStartPage } from "../pages/application-start-page";
import { ExtracurricularActivitiesPage } from "../pages/extracurricular-activities-page";
import { HighSchoolInfoPage } from "../pages/high-school-info-page";
import { EssayPage } from "../pages/essay-page";
import { ReviewApplicationPage } from "../pages/review-application-page";
import testData from "../data/test-data.json";
test.setTimeout(9000000)

test.beforeEach("Register the User", async ({ page }) => {
  const landing = new SdetScholarshipLandingPage(page);
  const login = new LoginPage(page);
  const signup = new SignupPage(page);
  const email = faker.internet.email();
  
  await landing.goto();
  await landing.validatelandingPage()
  await landing.loginApply();
  await page.waitForLoadState("networkidle");
  await login.validateloginPage()
  await login.fillEmail("Russ24@hotmail.com");
  console.log(`Email: ${email}`);
  await login.clickNext();
  await page.waitForLoadState("domcontentloaded");
  const pageTitle = await page.title();
  if ((await page.title()) === "Signup") {
    await signup.validateSignupPage()
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

  await applicationStart.validateGetToKnowYouPage()
  await applicationStart.fillUpDetails(
    testData.userAddress.streetAddress,
    testData.userAddress.state,
    testData.userAddress.city,
    testData.userAddress.zip,
    testData.userAddress.country
  );
  await applicationStart.nextPageClick();
  await curricularActivity.validateActivitiesPage();
  await curricularActivity.addEntry(
    testData.curricularActivities[0].activityName,
    testData.curricularActivities[0].hoursPerWeek,
    testData.curricularActivities[0].description,
    testData.curricularActivities[0].achievements
  );
  await curricularActivity.nextPageClick();
  await curricularActivity.validate2entriesRequired();
  for (let i = 1; i <= 3; i++) {
    const activity = testData.curricularActivities[i];
    await curricularActivity.addEntry(
      activity.activityName,
      activity.hoursPerWeek,
      activity.description,
      activity.achievements
    );
  }
  await curricularActivity.nextPageClick();
  await highSchoolInfo.validateHighSchoolInfoPage()
  await highSchoolInfo.fillUpSchoolDetails(
    testData.highSchoolInfo.schoolName,
    testData.highSchoolInfo.schoolStreet,
    testData.highSchoolInfo.city,
    testData.highSchoolInfo.state,
    testData.highSchoolInfo.zip,
    testData.highSchoolInfo.grade,
    testData.highSchoolInfo.graduationYear
  );
  await highSchoolInfo.nextPageClick()
  await essay.validateEssayPage()
  await essay.validatePresenceOfEssayBoxes();
  await essay.fillupAnimalsAndSchoolsEssays(
    testData.essays.essay1,
    testData.essays.essay2
  );
  await essay.nextPageClick();
  await reviewApplication.validateReviewPage()
  await reviewApplication.reviewPage1Contents();
  await reviewApplication.reviewCurricularPageContents();
  await reviewApplication.reviewhighSchoolInfoPageContents();
  await reviewApplication.reviewEssayPageContents();
  const url = page.url()
  console.log(url)
  await reviewApplication.submitApplication();
});

test.afterEach("Close and Log Status", async ({ page }, testInfo) => {
  await page.close();
  console.log(
    `Test: "${testInfo.title}" finished with status ${testInfo.status}`
  );
});
