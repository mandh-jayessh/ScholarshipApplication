import { test, expect, chromium, Browser, Page, BrowserContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { SdetScholarshipLandingPage } from "../pages/landing-page";
import { UserRegisterPage } from "../pages/user-register-page";
import { GetToKnowYouPage } from "../pages/get-to-know-you-page";
import { ExtracurricularActivitiesPage } from "../pages/extracurricular-activities-page";
import { HighSchoolInfoPage } from "../pages/high-school-info-page";
import { EssayPage } from "../pages/essay-page";
import { ReviewYourApplicationPage } from "../pages/review-your-application-page";
import { SubmittedApplicationPage } from "../pages/submitted-application-page";

import userData from "../data/test-data/user-details.json";
import schoolData from "../data/test-data/high-school-info.json";
import activityData from "../data/test-data/curricular-activities.json";
import essayData from "../data/test-data/essays.json";
import essayTextBoxHeaders from "../data/validation-data/essay-textbox-header.json";
import headerData from "../data/validation-data/heading-data.json";


test.describe("Kaleidoscope Application", () => {
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

  // Page Object Initialization - fixtures
  const createPages = (page: Page) => {
    return {
      landing: new SdetScholarshipLandingPage(page),
      userRegister: new UserRegisterPage(page),
      getToKnowYou: new GetToKnowYouPage(page),
      curricularActivity: new ExtracurricularActivitiesPage(page),
      highSchoolInfo: new HighSchoolInfoPage(page),
      essay: new EssayPage(page),
      reviewApplication: new ReviewYourApplicationPage(page),
      submittedApplication: new SubmittedApplicationPage(page),
    };
  };

  for (let run = 1; run <= noOfRuns; run++) {

    test(`1. Register User - Run No: ${run}`, async ({}) => {
      const { landing, userRegister } = createPages(page);

      await landing.goto();
      await landing.validatelandingPage(headerData.LandingPage);
      await landing.loginApply();
      await userRegister.fillEmail(globalThis.email);
      await userRegister.clickNext();
      await userRegister.waitForLoad();

      if ((await page.title()) === "Signup") {
        await userRegister.validateSignupPage(headerData.SignUpPage);
        await userRegister.fillSignupDetails(
          userData.firstName, userData.lastName,
          userData.mobilePhone, userData.password
        );
        await userRegister.clickSubmit()
      } else if ((await page.title()) === "Login") {
        await userRegister.validateSigninPage(headerData.LoginPage);
        await userRegister.enterPassword(userData.password);
        await userRegister.clickSignin()
      }
    });

    test(`2. Fill 'Get to Know You' Page - Run No: ${run}`, async () => {
      const { getToKnowYou } = createPages(page);

      await getToKnowYou.validateGetToKnowYouPage(headerData.GetToKnowYouPage);
      await getToKnowYou.fillRequiredFields(
        userData.streetAddress, userData.state, userData.city,
        userData.zip, userData.country
      )
      await getToKnowYou.navigateToNextPage();
      if(await page.getByText("Failed to save").isVisible()){
        console.log("Application issue - Failed to save")
      }
    });

    test(`3. Fill 'Extracurricular Activities' Page - Run No: ${run}`, async () => {
      const { curricularActivity } = createPages(page);

      await curricularActivity.validateActivitiesPage(headerData.ExtracurricularActivitiesPage);
      await curricularActivity.addEntry(
        activityData[0].activityName, activityData[0].yearsInvolved,
        activityData[0].description, activityData[0].achievements
      );
      await curricularActivity.navigateToNextPage();
      await curricularActivity.validateAtLeast2activitiesRequired();
      for (let i = 1; i < 4; i++) {
        await curricularActivity.addEntry(
          activityData[i].activityName, activityData[i].yearsInvolved,
          activityData[i].description, activityData[i].achievements
        );
      }
      await curricularActivity.navigateToNextPage();
    });

    test(`4. Fill 'High School Info' Page - Run No: ${run}`, async () => {
      const { highSchoolInfo } = createPages(page);
      
      await highSchoolInfo.validateHighSchoolInfoPage(headerData.HighSchoolInfoPage);
      await highSchoolInfo.fillRequiredFields(
        schoolData.schoolName, schoolData.schoolStreet, schoolData.city,
        schoolData.state, schoolData.zip, schoolData.grade, 
        schoolData.graduationYear, schoolData.uploadFilePath
      );
      await highSchoolInfo.navigateToNextPage();
    });

    test(`5. Fill 'Essay' Page - Run No: ${run}`, async () => {
      const { essay } = createPages(page);

      await essay.validateEssayPage(headerData.EssayPage);
      await essay.validateEssayBox(essay.carsCheckbox, essay.essayCarsInputBox, essayTextBoxHeaders.carsTextbox)
      await essay.validateEssayBox(essay.animalsCheckbox, essay.essayAnimalInputBox, essayTextBoxHeaders.animalsTextbox);
      await essay.validateEssayBox(essay.schoolCheckbox, essay.essaySchoolInputBox, essayTextBoxHeaders.schoolsTextbox);
      await essay.validateEssayBox(essay.otherCheckbox, essay.essayOtherInputBox, essayTextBoxHeaders.othersTextbox);
      await essay.answerAnimalsAndSchoolsEssays(essayData.essay1, essayData.essay2);
      await essay.navigateToNextPage();
    });

    test(`6. Review Application and Submit - Run No: ${run}`, async () => {
     const { reviewApplication } = createPages(page);

      await reviewApplication.validateReviewPage();
      await reviewApplication.validateAnswersGetToKnowYouPage(
        userData.firstName, userData.lastName, globalThis.email,
        userData.streetAddress, userData.state, userData.city,
        userData.zip, userData.country
      );
      await reviewApplication.validateAnswersExtraCurricularActivitiesPage();
      await reviewApplication.validateAnswersHighSchoolInfoPage(
        schoolData.schoolName, schoolData.schoolStreet, schoolData.city,
        schoolData.state, schoolData.zip, 
        schoolData.grade, schoolData.graduationYear
      );
      await reviewApplication.validateAnswersEssayPage(essayData.essay1, essayData.essay2);

      const url = page.url();
      console.log(`URL: ${url}`);
      await reviewApplication.submitApplication();
      await reviewApplication.confirmSubmission();
      await page.goto(url);
    });

    test(`7. Validate Editing is not allowed after Application has been submitted - Run No: ${run}`, async () => {
      const { submittedApplication } = createPages(page);
      
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
