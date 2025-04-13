import { Page, Locator, expect } from "@playwright/test";

export class SubmittedApplicationPage {
  page: Page;
  editButtons: Locator;
  editButtonGetToKnow: Locator;
  editButtonCurricularActivities: Locator;
  editButtonHighSchoolInfo: Locator;
  editButtonEssay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editButtons = page.getByText("Edit");
    this.editButtonGetToKnow = this.editButtons.nth(0);
    this.editButtonCurricularActivities = this.editButtons.nth(1);
    this.editButtonHighSchoolInfo = this.editButtons.nth(2);
    this.editButtonEssay = this.editButtons.nth(3);
  }

  async validateNoEditing() {
    await this.editButtonEssay.waitFor({ state: "detached" });
    await expect(this.editButtons).toHaveCount(0);
    await expect(this.editButtonGetToKnow).not.toBeAttached();
    await expect(this.editButtonCurricularActivities).not.toBeAttached();
    await expect(this.editButtonHighSchoolInfo).not.toBeAttached();
    await expect(this.editButtonEssay).not.toBeAttached();
  }
}
