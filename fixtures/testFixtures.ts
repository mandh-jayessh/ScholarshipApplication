import { test as baseTest } from "@playwright/test";
import { SdetScholarshipLandingPage } from "../pages/landing-page";
import { UserRegisterPage } from "../pages/user-register-page";
import { GetToKnowYouPage } from "../pages/get-to-know-you-page";
import { ExtracurricularActivitiesPage } from "../pages/extracurricular-activities-page";
import { HighSchoolInfoPage } from "../pages/high-school-info-page";
import { EssayPage } from "../pages/essay-page";
import { ReviewYourApplicationPage } from "../pages/review-your-application-page";
import { SubmittedApplicationPage } from "../pages/submitted-application-page";

type Fixtures = {
  landing: SdetScholarshipLandingPage;
  userRegister: UserRegisterPage;
  getToKnowYou: GetToKnowYouPage;
  curricularActivity: ExtracurricularActivitiesPage;
  highSchoolInfo: HighSchoolInfoPage;
  essay: EssayPage;
  reviewApplication: ReviewYourApplicationPage;
  submittedApplication: SubmittedApplicationPage;
};

const testPages = baseTest.extend<Fixtures>({
  landing: async ({ page }, use) => {
    const landing = new SdetScholarshipLandingPage(page);
    await use(landing);
  },
  userRegister: async ({ page }, use) => {
    const userRegister = new UserRegisterPage(page);
    await use(userRegister);
  },
  getToKnowYou: async ({ page }, use) => {
    const getToKnowYou = new GetToKnowYouPage(page);
    await use(getToKnowYou);
  },
  curricularActivity: async ({ page }, use) => {
    const curricularActivity = new ExtracurricularActivitiesPage(page);
    await use(curricularActivity);
  },
  highSchoolInfo: async ({ page }, use) => {
    const highSchoolInfo = new HighSchoolInfoPage(page);
    await use(highSchoolInfo);
  },
  essay: async ({ page }, use) => {
    const essay = new EssayPage(page);
    await use(essay);
  },
  reviewApplication: async ({ page }, use) => {
    const reviewApplication = new ReviewYourApplicationPage(page);
    await use(reviewApplication);
  },
  submittedApplication: async ({ page }, use) => {
    const submittedApplication = new SubmittedApplicationPage(page);
    await use(submittedApplication);
  },
});

export const test = testPages;