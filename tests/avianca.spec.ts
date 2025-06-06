import { test, type Page } from '@playwright/test';
import { AviancaCore } from '../core/avianca.core';
import { THomePage } from '../pages/home.page';
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { HomePage } from "../pages/home.page";

test.describe("Test End to End Avianca", () => {

  let page: Page | undefined | any;
  let homePage: THomePage = HomePage;

  test.beforeEach(async () => {
    await AviancaCore.initializeBrowser();
    page = AviancaCore.getPage();
    helper.init(page);
    homePage.initPage(page);
  });

  test.afterEach(async () => {
    await AviancaCore.closeBrowser();
    page = undefined;
  });

  test('Home => Payment', async ({ }) => {
    await AviancaCore.initTests();
    await homePage.run();
  });
});