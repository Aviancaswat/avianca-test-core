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
            await page.waitForSelector("#journeysContainerId_1");
            const containerReturn = page.locator("#journeysContainerId_1");
            await expect(containerReturn).toBeVisible();
            await page.waitForTimeout(5000);
            let indiceVueloRegreso = parseInt(copyBooking.numero_vuelo_regreso);
            const flightOptions = containerReturn.locator('.journey_price_fare-select_label-text');
            const flightCount = await flightOptions.count();
 
            if (indiceVueloRegreso >= flightCount || indiceVueloRegreso < 0) {
                throw new Error(`La posición de vuelo '${indiceVueloRegreso}' no es válida. Solo hay ${flightCount} opciones.`);
            }
 
            await expect(flightOptions.nth(indiceVueloRegreso)).toBeVisible();
            await flightOptions.nth(indiceVueloRegreso).click({ delay: helper.getRandomDelay() });
            await page.waitForSelector(".journey_fares_list_item");
            await helper.takeScreenshot('13-seleccion-vuelo-regreso');
            await page.waitForSelector(".fare-classic");
            await page.locator('.fare-classic').first().click({ delay: helper.getRandomDelay() });
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
 
            await page.waitForSelector('#pageWrap');
            const flightPosition = parseInt(copyBooking['numero_vuelo_ida']);
            await page.waitForSelector('.journey_price_fare-select_label-text');
            const flightOptions = page.locator('.journey_price_fare-select_label-text');
            const flightCount = await flightOptions.count();
 
            if (flightPosition >= flightCount || flightPosition < 0) {
                throw new Error(`La posición de vuelo '${flightPosition}' no es válida. Solo hay ${flightCount} opciones.`);
            }
 
            await expect(flightOptions.nth(flightPosition)).toBeVisible();
            await flightOptions.nth(flightPosition).click({ delay: helper.getRandomDelay() });
            await page.waitForSelector(".journey_fares_list_item");
           
            await page.waitForSelector(".fare-classic");
            await page.locator('.fare-classic').first().click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('flight-seleccion-vuelo-ida');
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
 
export { BookingPage }