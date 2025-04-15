import { test, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
// Page Classes
import { SdetScholarshipLandingPage } from "../pages/landing-page";
import { UserRegisterPage } from "../pages/user-register-page";
import { GetToKnowYouPage } from "../pages/get-to-know-you-page";
import { ExtracurricularActivitiesPage } from "../pages/extracurricular-activities-page";
import { HighSchoolInfoPage } from "../pages/high-school-info-page";
import { EssayPage } from "../pages/essay-page";
import { ReviewYourApplicationPage } from "../pages/review-your-application-page";
import { SubmittedApplicationPage } from "../pages/submitted-application-page";
// Data Files
import userData from "../data/test-data/user-details.json";
import schoolData from "../data/test-data/high-school-info.json";
import activityData from "../data/test-data/curricular-activities.json";
import essayData from "../data/test-data/essays.json";
import essayTextBoxHeaders from "../data/validation-data/essay-textbox-header.json";
import headerData from "../data/validation-data/heading-data.json";

test.describe("Kaleidoscope Application", () => {
  let url: string;
  let numberOfRuns: number = 2;

  // ==========          Page Object Initialization - fixtures          ==========
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

  test.beforeEach("Navigate to Scholarship Landing Page", async ({ page }) => {
    const { landing } = createPages(page);

    // Random emails are picked in each run.
    globalThis.email = faker.internet.email();
    console.log(`Generated Email: ${globalThis.email}`);
    await test.step("[ACTION] Navigate to Scholarship Landing Page", async () => {
      await landing.gotoLandingPage();
    });

    await test.step("[VERIFY] Validate Contents of Landing Page", async () => {
      await landing.validatelandingPage(headerData.LandingPage);
      await landing.loginToApply();
    });
  });

  for (let run = 1; run <= numberOfRuns; run++) {
    test(`Complete the Application for SDET Test Scholarship Program ${run}`, async ({ page }) => {
      const { userRegister, getToKnowYou, curricularActivity, highSchoolInfo, essay, reviewApplication, submittedApplication } = createPages(page);

      // ==========          Pre Conditions for Applying to Scholarship          ==========
      await test.step("[ACTION] Begin a New Application by Registering user or Logging In", async () => {
        await userRegister.fillEmail(globalThis.email);
        await userRegister.navigateToNextScreen();
        await userRegister.waitForLoad();

        if ((await page.title()) === "Signup") {
          await test.step("[VERIFY] Signup Page", async () => {
            await userRegister.validateSignupPage(headerData.SignUpPage);
          });
          await test.step("[ACTION] Fill Details and Register User on Signup Page", async () => {
            await userRegister.fillSignupDetails(userData.firstName, userData.lastName, userData.mobilePhone, userData.password);
            await userRegister.clickSubmit();
            console.log(`Registered the User: ${globalThis.email}`);
          });
        } else if ((await page.title()) === "Login") {
          await test.step("[VERIFY] Signin Page", async () => {
            await userRegister.validateSigninPage(headerData.LoginPage);
            await userRegister.validateRequiredFields();
          });
          await test.step("[ACTION] Perform Signin", async () => {
            await userRegister.enterPassword(userData.password);
            await userRegister.signIn();
          });
        }
      });

      // ==========          Page 1: Get to Know you Page          ==========
      await test.step("[VERIFY] Validate contents on Page 1 - Get to Know You Page", async () => {
        await getToKnowYou.validateGetToKnowYouPage(headerData.GetToKnowYouPage);
        await getToKnowYou.validateRequiredFields();  // generic assertion
      });

      await test.step("[ACTION] Fill all Required Fields in Page 1 - Get to Know You Page", async () => {
        await getToKnowYou.fillRequiredFields(
          userData.streetAddress, userData.state,
          userData.city, userData.zip, userData.country
        );
        await getToKnowYou.navigateToNextPage();
      });

      // ==========          Page 2: Extra Curricular Activity Page          ==========
      await test.step("[VERIFY] Validate contents on Page 2 - Extra Curricular Activity Page", async () => {
        await curricularActivity.validateActivitiesPage(headerData.ExtracurricularActivitiesPage);
        await curricularActivity.ValidateAddEntryDialogModal();
        await curricularActivity.navigateToNextPage();
      });

      await test.step("[VERIFY] Validate that at least 2 Extracurricular Activities are required, when not providing enough.", async () => {
        await curricularActivity.validateAtLeast2activitiesRequired();
      });

      await test.step("[ACTION] Finish Page 2 by providing 4 Activities", async () => {
        for (let i = 0; i < 4; i++) {
          await curricularActivity.addEntry(
            activityData[i].activityName, activityData[i].yearsInvolved, 
            activityData[i].description, activityData[i].achievements
          );
        }
        await curricularActivity.navigateToNextPage();
      });

      // ==========          Page 3: High School Information Page          ==========
      await test.step("[VERIFY] Validate contents on Page 3 - High School Information Page", async () => {
        await highSchoolInfo.validateHighSchoolInfoPage(headerData.HighSchoolInfoPage);
        await highSchoolInfo.validateRequiredFields();   // generic assertion
      });

      await test.step("[ACTION] Fill out the Form on High School Information Page", async () => {
        await highSchoolInfo.fillRequiredFields(
          schoolData.schoolName,
          schoolData.schoolStreet,
          schoolData.city,
          schoolData.state,
          schoolData.zip,
          schoolData.grade,
          schoolData.graduationYear
        );
      });

      await test.step("[ACTION] Upload School Transcript on High School Information Page", async () => {
        await highSchoolInfo.uploadFile(schoolData.uploadFilePath);
        await highSchoolInfo.navigateToNextPage();
      });

      // ==========          Page 4: Essay Page          ==========
      await test.step("[VERIFY] Validate contents on Page 4 - Essay Page", async () => {
        await essay.validateEssayPage(headerData.EssayPage);
      });

      await test.step("[VERIFY] Validate Cars Checkbox on Essay Page", async () => {
        await essay.validateEssayBox(essay.carsCheckbox, essay.essayCarsInputBox, essayTextBoxHeaders.carsTextbox);
      });

      await test.step("[VERIFY] Validate Animals Checkbox on Essay Page", async () => {
        await essay.validateEssayBox(essay.animalsCheckbox, essay.essayAnimalInputBox, essayTextBoxHeaders.animalsTextbox);
      });

      await test.step("[VERIFY] Validate School Checkbox on Essay Page", async () => {
        await essay.validateEssayBox(essay.schoolCheckbox, essay.essaySchoolInputBox, essayTextBoxHeaders.schoolsTextbox);
      });

      await test.step("[VERIFY] Validate Others Checkbox on Essay Page", async () => {
        await essay.validateEssayBox(essay.otherCheckbox, essay.essayOtherInputBox, essayTextBoxHeaders.othersTextbox);
      });

      await test.step("[ACTION] On Essay Page - Select Animals,School Checkbox and Provide answers to their essays", async () => {
        await essay.answerAnimalsAndSchoolsEssays(essayData.essay1,essayData.essay2);
        await essay.navigateToNextPage();
      });

      // ==========          Review Your Application Page          ==========
      await test.step("[VERIFY] Validate contents on Review Page", async () => {
        await reviewApplication.validateReviewPage();
      });
      // generic assertion
      await test.step("[VERIFY] Validate Get to Know You Section answers", async () => {
        await reviewApplication.validateAnswersGetToKnowYouPage(
          userData.firstName, userData.lastName, globalThis.email, userData.streetAddress,
          userData.state, userData.city,userData.zip, userData.country
        );
      });
      
      await test.step("[VERIFY] Validate Extra Curricular Activities Section answers", async () => {
        await reviewApplication.validateAnswersExtraCurricularActivitiesPage();
      });
      // generic assertion
      await test.step("[VERIFY] Validate High School Information Section answers", async () => {
        await reviewApplication.validateAnswersHighSchoolInfoPage(
          schoolData.schoolName, schoolData.schoolStreet, schoolData.city, schoolData.state,
          schoolData.zip, schoolData.grade, schoolData.graduationYear
        );
      });

      await test.step("[VERIFY] Validate Essay Section answers", async () => {
        await reviewApplication.validateAnswersEssayPage(essayData.essay1, essayData.essay2);
      });

      await test.step("[ACTION] Capture the Page URL", async () => {
        url = page.url();
        console.log(`URL: ${url}`);
      });

      await test.step("[ACTION] Submit the Application", async () => {
        await reviewApplication.submitApplication();
        await reviewApplication.confirmSubmission();
        console.log("Application submitted successfully");
      });

      // ==========          Submitted Application           ==========
      await test.step("[ACTION] Navigate To Captured URL", async () => {
        await page.goto(url);
        console.log(`Navigated to: ${url}`);
      });

      await test.step("[VERIFY] Validate Editing is not allowed after Application has been submitted.", async () => {
        await submittedApplication.validateNoEditing();
      });
    });
  }

  test.afterEach("Close and Log Status", async ({ page }, testInfo) => {
    await page.close();
    console.log(`Test: "${testInfo.title}",Ran in Worker index ${testInfo.workerIndex} finished with status ${testInfo.status}`);
  });
});
