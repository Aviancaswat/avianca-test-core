import { expect, type Page } from "@playwright/test";
import { GLOBAL_MESSAGES as m } from "../global.variables";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { copyBooking } from "../data/copys/booking/booking.copy";

type TPage = Page | undefined | any;

export type TBookingPage = {
    initPage(page: TPage): void;
    selectFlightOutbound(): Promise<void>;
    selectFlightReturn(): Promise<void>;
    validateModalFlight(): Promise<void>;
    continueToPassenger(): Promise<void>;
    editFlightSelected(): Promise<void>;
    run(): Promise<void>;
}

let page: TPage;

const BookingPage: TBookingPage = {
    initPage(pageP: TPage): void {
        page = pageP;
    },

    async selectFlightReturn(): Promise<void> {
 
        if (!page) {
            throw new Error(m.errors.initializated);
        }
 
        try {
 
            await page.waitForSelector("#journeysContainerId_1", { timeout: 15000 });
            const containerReturn = page.locator("#journeysContainerId_1");
            await expect(containerReturn).toBeVisible();
            await page.waitForTimeout(3000);
            let indiceVueloRegreso = parseInt(copyBooking.numero_vuelo_regreso);
            const posicionVueloRegreso = await page.evaluate((indiceRegreso) => {
                let reference = 'c12-';
                let clase=document.querySelector('#journeysContainerId_1')?.querySelector('.journey')?.className as string;
                let posicionInicial = clase?.lastIndexOf(reference)+reference.length as number;
                let posicionInicialVuelo = clase?.substring(posicionInicial,posicionInicial+3).trim()
                let indice = parseInt(posicionInicialVuelo) + indiceRegreso - 1;
                return indice;
            },indiceVueloRegreso);
            await containerReturn.locator('.journey_price_button.ng-tns-c12-'+posicionVueloRegreso).first().click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('13-seleccion-vuelo-regreso');
            await page.waitForSelector(".page-journey-selection");
            await page.locator('.page-journey-selection').first().locator('.light-basic.cro-new-basic-button').click({ delay: helper.getRandomDelay() });
            await page.waitForTimeout(1500);
        }
        catch (error) {
            console.error("BOOKINGPAGE => Ha ocurrido un error en la selección de vuelo de regreso | Error: ", error);
            throw error;
        }
    },

    async selectFlightOutbound(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {
            const fareMap: Record<string, number> = {
                basic: 0,
                light: 0,
                classic: 1,
                flex: 2,
                business: 3,
                insignia: 3,
            };

            await page.waitForSelector('#pageWrap');
            let posicion = parseInt(copyBooking.numero_vuelo_ida) + 1;
            await page.waitForSelector('.journey_price_button.ng-tns-c12-' + posicion);
            await expect(page.locator('.journey_price_button.ng-tns-c12-' + posicion).first()).toBeVisible();
            await page.locator('.journey_price_button.ng-tns-c12-' + posicion).first().click({ delay: helper.getRandomDelay() });
            await page.waitForSelector(".journey_fares_list_item");
            const flightFare = fareMap[copyBooking.departure_flight_fare] ?? 0;

            if (copyBooking.departure_flight_fare === "flex") {
                await page.locator('.journey_fares_list_item').nth(flightFare).locator(`.fare-control`).last().click({ delay: helper.getRandomDelay() });
            } else if (copyBooking.departure_flight_fare === "light" || copyBooking.departure_flight_fare === "basic" || copyBooking.departure_flight_fare === "classic") {
                await page.locator('.journey_fares_list_item').nth(flightFare).locator(`.fare-${copyBooking.departure_flight_fare}.cro-new-${copyBooking.departure_flight_fare}-button`).click({ delay: helper.getRandomDelay() });
            } else {
                await expect(page.locator('.journey_fares_list_item').nth(flightFare).locator('.fare-control.only-business')).toBeVisible();
                await page.locator('.journey_fares_list_item').nth(flightFare).locator('.fare-control.only-business').click({ delay: helper.getRandomDelay() });
            }
        }
        catch (error) {
            console.error("BOOKINGPAGE => Ha ocurrido un error en la selección de vuelo de ida | Error: ", error);
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

    async editFlightSelected(): Promise<void> {

        try {

            if (copyBooking.editFlightSelected) {
                console.log("entró a editar la selección del vuelo");
                const titleSummary = page.locator(".trip-summary-heading-created");
                await expect(titleSummary).toBeVisible({ timeout: 10_000 });
                const buttonEdit = page.locator(".journey-select_modifier-edit_button>.button_label");
                await expect(buttonEdit).toBeVisible({ timeout: 10_000 });
                await buttonEdit.click();
            }
            else {
                console.log("NO entró al editar la selección del vuelo");
            }
        }
        catch (error) {
            console.error("BOOKING PAGE => Ha ocurrido un error al editar la selección de vuelo");
        }
    },

    async continueToPassenger(): Promise<void> {
 
        if (!page) {
            throw new Error(m.errors.initializated);
        }
 
        try {
            const lang = helper.getLang();
            await page.waitForSelector(".trip-summary");
            if(copyBooking.consulta_condiciones_tarifa){
                const newTabPromise = page.waitForEvent("popup");
                await page.getByRole('link', { name: copyBooking[lang].informacion_tarifas }).click({ delay: helper.getRandomDelay() });
                await page.waitForTimeout(3500);
                const newTab = await newTabPromise;
                await newTab.waitForLoadState();
                await expect(newTab).toHaveURL("https://www.avianca.com/es/informacion-y-ayuda/tarifas-avianca/");
                newTab.close();
            }
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
        console.log("Booking page start...");
        await this.selectFlightOutbound();
        await this.validateModalFlight();
        await this.selectFlightReturn();
        await this.validateModalFlight();
        await helper.takeScreenshot("resumen-seleccion-vuelos");
        await this.continueToPassenger();
        console.log("Booking page end...");
    }
}

export { BookingPage };