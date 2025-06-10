import { test, type Page } from '@playwright/test';
import { AviancaCore } from '../core/avianca.core';
import type { THomePage } from '../pages/home.page';
import type { TBookingPage } from '../pages/booking.page';
import type { TPassengerPage } from "../pages/passenger.page";
import { TServicesPage } from '../pages/services.page';
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { HomePage, BookingPage, PassengerPage, ServicesPage, SeatPage, TSeatPage } from "../pages/index";

test.describe("Test End to End Avianca", () => {

  let page: Page | undefined | any;
  let homePage: THomePage = HomePage;
  let bookingPage: TBookingPage = BookingPage;
  let passengerPage: TPassengerPage = PassengerPage;
  let servicesPage: TServicesPage = ServicesPage;
  let seatPage: TSeatPage = SeatPage;

  test.beforeEach(async () => {
    await AviancaCore.initializeBrowser();
    page = AviancaCore.getPage();
    if (page) {
      helper.init(page);
      homePage.initPage(page);
      bookingPage.initPage(page);
      passengerPage.initPage(page);
      servicesPage.initPage(page);
      seatPage.initPage(page);
    }
  });

  test.afterEach(async () => {
    await AviancaCore.closeBrowser();
    page = undefined;
  });

  test('Home => Payment', async ({ }) => {
    await AviancaCore.initTests();
    await homePage.run();
    await bookingPage.run();
    await passengerPage.run();
    await servicesPage.run();
    await seatPage.run();
  });
});