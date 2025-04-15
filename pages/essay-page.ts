import { Page, Locator, expect } from "@playwright/test";

export class EssayPage {
  page: Page;
  heading: Locator;
  carsCheckbox: Locator;
  animalsCheckbox: Locator;
  schoolCheckbox: Locator;
  otherCheckbox: Locator;
  essayCarsInputBox: Locator;
  essayAnimalInputBox: Locator;
  essaySchoolInputBox: Locator;
  essayOtherInputBox: Locator;
  essayTextboxHeader : Locator
  nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId("page-title");
    this.carsCheckbox = page.getByRole("checkbox", { name: "Cars" });
    this.animalsCheckbox = page.getByRole("checkbox", { name: "Animals" });
    this.schoolCheckbox = page.getByRole("checkbox", { name: "School" });
    this.otherCheckbox = page.getByRole("checkbox", { name: "Other" });
    this.essayCarsInputBox = page.getByRole("textbox", { name: "Essay about Cars" });
    this.essayAnimalInputBox = page.getByRole("textbox", { name: "Essay about Animals" });
    this.essaySchoolInputBox = page.getByRole("textbox", { name: "Essay about School" });
    this.essayOtherInputBox = page.getByRole("textbox", { name: "Provide an essay about any topic" });
    this.essayTextboxHeader = page.getByText("Essay about")
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
  }

  async validateEssayPage(heading: string) {
    if(await this.heading.textContent()!=heading){
      await this.nextPageButton.click()
    }
    await this.otherCheckbox.waitFor({ state: "visible" });
    await expect(this.heading).toHaveText(heading);
  }

  async validateEssayBox(checkbox: Locator, inputBox: Locator, text: string) {
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect(inputBox).toBeEditable();
    await expect(this.essayTextboxHeader).toContainText(text)
    await expect(inputBox).toBeVisible();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await inputBox.waitFor({ state: "hidden" })
  }

  async answerAnimalsAndSchoolsEssays(essay1: string, essay2: string) {
    await this.animalsCheckbox.check();
    await this.essayAnimalInputBox.fill(essay1);
    await this.schoolCheckbox.check();
    await this.essaySchoolInputBox.fill(essay2);
  }

  async navigateToNextPage() {
    await this.nextPageButton.click();
    if (await this.nextPageButton.isVisible()){
      await this.nextPageButton.click()
    }
  }
}
