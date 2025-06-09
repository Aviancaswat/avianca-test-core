import { expect, type Page } from "@playwright/test";
import { GLOBAL_MESSAGES as m } from "../global.variables";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";

type TPage = Page | undefined | any;

export type TBookingPage = {
    initPage(page: TPage): void;
    selectFlightOutbound(): Promise<void>;
    selectFlightReturn(): Promise<void>;
    validateModalFlight(): Promise<void>;
    continueToPassenger(): Promise<void>;
    run(): Promise<void>;
}

let page: TPage;

const BookingPage: TBookingPage = {
    initPage(pageP: TPage): void {
        page = pageP;
    },
    
    async selectFlightOutbound(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await page.waitForSelector('#pageWrap');
            await page.waitForSelector('.journey_price_fare-select_label-text');
            await expect(page.locator(".journey_price_fare-select_label-text").first()).toBeVisible();
            await page.locator('.journey_price_fare-select_label-text').first().click({ delay: helper.getRandomDelay() });
            await page.waitForSelector(".journey_fares");
            await page.locator('.journey_fares').first().locator('.light-basic.cro-new-basic-button').click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('flight-seleccion-vuelo-ida');
        }
        catch (error) {
            console.error("BOOKINGPAGE => Ha ocurrido un error en la selección de vuelo de ida | Error: ", error);
            throw error;
        }
    },
    async selectFlightReturn(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await page.waitForSelector("#journeysContainerId_1", { timeout: 15000 });
            const containerReturn = page.locator("#journeysContainerId_1");
            await expect(containerReturn).toBeVisible();
            await containerReturn.locator(".journey_price_fare-select_label-text").first().click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('13-seleccion-vuelo-regreso');
            await containerReturn.locator('.journey_fares').first().locator('.light-basic.cro-new-basic-button').click({ delay: helper.getRandomDelay() });
            await page.waitForTimeout(1500);
        }
        catch (error) {
            console.error("BOOKINGPAGE => Ha ocurrido un error en la selección de vuelo de regreso | Error: ", error);
            throw error;
        }
    },

    async validateModalFlight(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await page.waitForTimeout(1500);
            const isVisibleModal = await page.locator("#FB310").first().isVisible();
            if (isVisibleModal) {
                await expect(page.locator(".cro-button.cro-no-accept-upsell-button")).toBeVisible();
                await page.locator(".cro-button.cro-no-accept-upsell-button").first().click({ delay: helper.getRandomDelay() });
            }
        }
        catch (error) {
            console.error("BOOKINGPAGE => Ocurrió un error al validar el modal intermedio (seleccion de vuelos)");
            throw error;
        }
    },

    async continueToPassenger(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await page.waitForSelector(".trip-summary");
            const buttonConfirmResumen = page.locator(".button.page_button.btn-action");
            await expect(buttonConfirmResumen).toBeVisible();
            buttonConfirmResumen.scrollIntoViewIfNeeded();
            await buttonConfirmResumen.click({ delay: helper.getRandomDelay() });
            await page.waitForSelector(".passenger_data_group");
        }
        catch (error) {
            console.error("FLIGHTS => Ocurrió un error en click a continuar a flujo de pasajeros. Error: ", error);
            throw error;
        }
    },

    async run(): Promise<void> {
        await this.selectFlightOutbound();
        await this.validateModalFlight();
        await this.selectFlightReturn();
        await this.validateModalFlight();
        await helper.takeScreenshot("resumen-seleccion-vuelos");
        await this.continueToPassenger();
    }
}

export { BookingPage };