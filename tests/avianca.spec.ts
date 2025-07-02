import { test, type Page } from '@playwright/test';
import { AviancaCore } from '../core/avianca.core';
import type { THomePage } from '../pages/home.page';
import type { TBookingPage } from '../pages/booking.page';
import type { TPassengerPage } from "../pages/passenger.page";
import { TServicesPage } from '../pages/services.page';
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import {
  HomePage,
  BookingPage,
  PassengerPage,
  ServicesPage,
  SeatPage,
  PaymentPage,
  type TSeatPage,
  type TPaymentPage
} from "../pages/index";

test.describe("Test End to End Avianca", () => {

  let page: Page | undefined | any;
  let homePage: THomePage = HomePage;
  let bookingPage: TBookingPage = BookingPage;
  let passengerPage: TPassengerPage = PassengerPage;
  let servicesPage: TServicesPage = ServicesPage;
  let seatPage: TSeatPage = SeatPage;
  let paymentPage: TPaymentPage = PaymentPage;

  test.beforeEach(async ({ }, testInfo) => {

    await AviancaCore.initializeBrowser();
    page = AviancaCore.getPage();

    if (page) {
      helper.init(page, testInfo);
      homePage.initPage(page);
      bookingPage.initPage(page);
      passengerPage.initPage(page);
      servicesPage.initPage(page);
      seatPage.initPage(page);
      paymentPage.initPage(page);
    }
  });

  test.afterEach(async () => {
    await AviancaCore.closeBrowser();
    page = undefined;
  });

  test.skip('Home => Payment', async ({ }) => { //esta test esta configurada para saltarla en github actions (test.skip)
    await AviancaCore.initTests();
    await homePage.run();
    await bookingPage.run();
    // await passengerPage.run();
    // await servicesPage.run();
    // await seatPage.run();
    // await paymentPage.run();
  });

  test.skip("Funcionalidad de seleccion de tipo de vuelo (ida y vuelta)", async () => {
    await AviancaCore.initTests();
    await homePage.verifyCookies();
    await homePage.selectOptionTypeFlight();
  });

  test.skip("Funcionalidad de selección de pasajeros adultos", async () => {
    await AviancaCore.initTests();
    await homePage.verifyCookies();
    await homePage.selectPassengerAdult(5);
    await homePage.confirmPassengerSelecteds();
  });

  test.skip("Funcionalidad de selección de pasajero jóvenes", async () => {
    await AviancaCore.initTests();
    await homePage.verifyCookies();
    await homePage.selectPassengerYouths(5);
    await homePage.confirmPassengerSelecteds();
  });

  test.skip("Funcionalidad de selección de niños", async () => {
    await AviancaCore.initTests();
    await homePage.verifyCookies();
    await homePage.selectPassengerChildren(4);
    await homePage.confirmPassengerSelecteds();
  });

  test("Funcionalidad de selección de infantes o bebés", async () => {
    await AviancaCore.initTests();
    await homePage.verifyCookies();
    await homePage.selectPassengerAdult(3);
    await homePage.selectPassengerYouths(1);
    await homePage.selectPassengerChildren(1);
    await homePage.selectPassengerInfant(3);
    await homePage.confirmPassengerSelecteds();
  });
});