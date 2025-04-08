import { Page, Locator, expect } from "@playwright/test";

export class EssayPage {
  page: Page;
  carsCheckbox: Locator;
  animalsCheckbox: Locator;
  schoolCheckbox: Locator;
  otherCheckbox: Locator;
  essayCarsInputBox: Locator;
  essayAnimalInputBox: Locator;
  essaySchoolInputBox: Locator;
  essayOtherInputBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.carsCheckbox = page.getByRole("checkbox", { name: "Cars" });
    this.animalsCheckbox = page.getByRole("checkbox", { name: "Animals" });
    this.schoolCheckbox = page.getByRole("checkbox", { name: "School" });
    this.otherCheckbox = page.getByRole("checkbox", { name: "Other" });
    this.essayCarsInputBox = page.getByRole("textbox", {
      name: "Essay about Cars",
    });
    // this.essayCarsInputBox = page.locator('//*[text()="Essay about Cars"]/following-sibling::div[contains(@class, "Textarea-wrapper")]');
    this.essayAnimalInputBox = page.getByRole("textbox", {
      name: "Essay about Animals",
    });
    this.essaySchoolInputBox = page.getByRole("textbox", {
      name: "Essay about School",
    });
    this.essayOtherInputBox = page.getByRole("textbox", {
      name: "Provide an essay about any topic",
    });
    // this.essayOtherInputBox = page.locator('//*[text()="Provide an essay about any topic"]/following-sibling::div[contains(@class, "Textarea-wrapper")]');
  }

  async validatePresenceOfEssayBoxes() {
    await this.validateCarsEssayBox();
    await this.validateAnimalsEssayBox();
    await this.validateSchoolEssayBox();
    await this.validateOthersEssayBox();
  }

  async fillupAnimalsAndSchoolsEssays(essay1: string, essay2: string) {
    await this.animalsCheckbox.check();
    await this.essayAnimalInputBox.fill(essay1);
    await this.schoolCheckbox.check();
    await this.essaySchoolInputBox.fill(essay2);
  }

  async validateCarsEssayBox() {
    await this.carsCheckbox.waitFor({ state: "visible" });
    await this.carsCheckbox.check();
    await expect(this.carsCheckbox).toBeChecked();
    await expect(this.essayCarsInputBox).toBeEditable();
    await expect(this.essayCarsInputBox).toBeVisible();
    await expect(this.essayCarsInputBox).toHaveCount(1);
    await this.carsCheckbox.uncheck();
    await expect(this.carsCheckbox).not.toBeChecked();
  }

  async validateAnimalsEssayBox() {
    await this.animalsCheckbox.check();
    await expect(this.animalsCheckbox).toBeChecked();
    await expect(this.essayAnimalInputBox).toBeEditable();
    await expect(this.essayAnimalInputBox).toBeVisible();
    await expect(this.essayAnimalInputBox).toHaveCount(1);
    await this.animalsCheckbox.uncheck();
    await expect(this.animalsCheckbox).not.toBeChecked();
  }

  async validateSchoolEssayBox() {
    await this.schoolCheckbox.check();
    await expect(this.schoolCheckbox).toBeChecked();
    await expect(this.essaySchoolInputBox).toBeEditable();
    await expect(this.essaySchoolInputBox).toBeVisible();
    await expect(this.essaySchoolInputBox).toHaveCount(1);
    await this.schoolCheckbox.uncheck();
    await expect(this.schoolCheckbox).not.toBeChecked();
  }

  async validateOthersEssayBox() {
    await this.otherCheckbox.check();
    await expect(this.otherCheckbox).toBeChecked();
    await expect(this.essayOtherInputBox).toBeEditable();
    await expect(this.essayOtherInputBox).toBeVisible();
    await expect(this.essayOtherInputBox).toHaveCount(1);
    await this.otherCheckbox.uncheck();
    await expect(this.otherCheckbox).not.toBeChecked();
  }
}
