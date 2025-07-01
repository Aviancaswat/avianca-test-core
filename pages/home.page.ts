import { expect, type Page } from "@playwright/test";
import { GLOBAL_MESSAGES as m } from "../global.variables";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { HomeCopy as copys } from "../data/copys/home/home.copy";

type TPage = Page | undefined | any;

export type THomePage = {
    verifyCookies(): Promise<void>;
    selectOptionTypeFlight(): Promise<void>;
    selectOriginOption(): Promise<void>;
    selectReturnOption(): Promise<void>;
    selectDepartureDate(): Promise<void>;
    selectReturnDate(): Promise<void>;
    selectPassengers(): Promise<void>;
    searchFlights(): Promise<void>;
    initPage(page: TPage): void;
    run(): Promise<void>;
}

let page: TPage;

const HomePage: THomePage = {
    /**
     * Función que sirve para inicializar el objeto page de playwright
     * @param { TPage } pageP - Objeto genérico de playwright
     * @returns { void } No retorna ningún valor
     */
    initPage(pageP: TPage): void {
        page = pageP;
    },

    /** 
     * Función que sirve para seleccionar el tipo de vuelo (vuelta y Ida y solo ida) 
     * @returns { Promise<void> } - Una promesa que se resuelve sin valor
     */
    async selectOptionTypeFlight(): Promise<void> {

        await page.waitForSelector("#journeytypeId_0");

        if (copys.isActiveOptionOutbound) { //si esta seleccionado el vuelo de ida
            const checkIda = page.locator("#journeytypeId_1");
            await checkIda.click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot("check-vuelo-ida")
        }
        else {
            const checkIdaVuelta = page.locator("#journeytypeId_0");
            await checkIdaVuelta.click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot("check-vuelo-ida-vuelta");
        }
    },

    /**
     * Función que sirve para aceptar el modal o popup de cookies
     * @returns { Promise<void> } Una promesa que se resuelve sin valor
    */
    async verifyCookies(): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const consentBtn = page.locator('#onetrust-pc-btn-handler', { delay: helper.getRandomDelay() });
            if (await consentBtn.isVisible()) {
                await page.waitForSelector("#onetrust-pc-btn-handler");
                await consentBtn.click();
                await page.locator('.save-preference-btn-handler.onetrust-close-btn-handler').click({ delay: helper.getRandomDelay() });
            }
        }
        catch (error) {
            console.error("COOKIES => Ocurrió un error al verificar las cookies | Error: ", error);
            throw error;
        }
    },

    /**
     * Función que sirve para seleccionar la ciudad de origen.
     * @returns { Promise<void> } Una promesa que se resuelve sin valor
    */
    async selectOriginOption(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const lang = helper.getLang();
            console.log("selectOriginOption ejecutado");
            const wrapperOrigin = page.locator('#originBtn');
            await expect(wrapperOrigin).toBeVisible({ timeout: 20_000 });
            await wrapperOrigin.click();
            const origen = page.getByPlaceholder((copys[lang])?.origen);
            await origen.fill(copys['ciudad_origen'], { delay: helper.getRandomDelay() });
            await origen.press('Enter');
            await page.waitForTimeout(1500);
            await (page.locator('id=' + copys['ciudad_origen'])).click({ delay: helper.getRandomDelay() })
            await helper.takeScreenshot('ciudad-origen');
            await page.waitForTimeout(2000);
        }
        catch (error) {
            console.error("HOME => Ocurrió un error al seleccionar la ciudad de origen ", error);
            throw error;
        }
    },

    /**
     * Función que sirve para seleccionar la ciudad de destino
     * @returns { Promise<void> } Una promesa que se resuelve sin valor
     */
    async selectReturnOption(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {
            console.log("selectReturnOption ejecutado");
            const lang = helper.getLang();
            await expect(page.getByPlaceholder(copys[lang]?.destino)).toBeVisible();
            const destino = page.getByPlaceholder(copys[lang]?.destino);
            await destino.click({ delay: helper.getRandomDelay() });
            await destino.fill(copys['ciudad_destino'], { delay: helper.getRandomDelay() });
            await destino.press('Enter');
            await (page.locator('id=' + copys['ciudad_destino'])).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('04-ciudad-destino');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al selecionar la ciudad de destino ", error);
            throw error;
        }
    },

    /**
     * Función que sirve para seleccionar la fecha del inicio del vuelo
     * @returns { Promise<void> } Una promesa que se resuelve sin valor
     */
    async selectDepartureDate(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {
            console.log("selectDepartureDate ejecutado");
            await page.waitForSelector("#departureInputDatePickerId");
            const fechaIda = await page.locator('id=departureInputDatePickerId');
            fechaIda.click({ delay: helper.getRandomDelay() });
            await page.locator('span').filter({ hasText: copys['fecha_salida'] }).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('seleccion-fecha-ida');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la fecha de ida, Error: ", error)
            throw error;
        }
    },

    /**
     * Función que sirve para seleccionar la fecha de regreso del vuelo
     * @returns { Promise<void> } Una promesa que se resuelve sin valor
     */
    async selectReturnDate(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            console.log("selectReturnDate ejecutado");
            await page.waitForTimeout(3000);
            await page.locator('span').filter({ hasText: copys['fecha_llegada'] }).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('seleccion-fecha-vuelta');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la fecha de regreso, Error: ", error);
            throw error;
        }
    },

    /**
     * Función que sirve para seleccionar los tipos de pasajeros (adultor, niños e infantes) 
     * que van en el vuelo
     * @returns { Promise<void> } Una promesa resuelta si valor
     */
    async selectPassengers(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            console.log("selectPassengers ejecutado");
            await page.getByRole('button', { name: '' }).nth(1).click();
            await page.getByRole('button', { name: '' }).nth(2).click();
            await page.getByRole('button', { name: '' }).nth(3).click();
            const confirmar = await page.locator('div#paxControlSearchId > div > div:nth-of-type(2) > div > div > button')
            confirmar.click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('seleccion-pasajeros');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al seleccionar los pasajeros, Error: ", error);
            throw error;
        }
    },

    /**
     * Función que ejecuta la busqueda de los vuelos conforme a los parámetros de ciudades y fechas
     * @returns { Promise<void> } Una promesa resuelta sin valor
     */
    async searchFlights(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            console.log("searchFlights ejecutado");
            const lang = helper.getLang();
            await expect(page.getByRole('button', { name: copys[lang]?.buscar, exact: true })).toBeVisible();
            await page.getByRole('button', { name: copys[lang]?.buscar, exact: true }).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('busqueda-vuelos');
            await page.waitForSelector('#pageWrap');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al buscar los vuelos, Error: ", error);
            throw error;
        }
    },

    /**
     * Función que ejecuta un conjunto de métodos
     * @returns { Promise<void> } Una promesa resuelta sin valor
    */
    async run(): Promise<void> {

        const {
            verifyCookies,
            selectOriginOption,
            selectReturnOption,
            selectDepartureDate,
            selectReturnDate,
            selectPassengers,
            searchFlights
        } = HomePage;

        console.log("Run Home ejecutado");

        await verifyCookies();
        await selectOriginOption();
        await selectReturnOption();
        await selectDepartureDate();
        await selectReturnDate();
        await selectPassengers();
        await searchFlights();

        console.log("Run END ejecutado");
    }
};

export { HomePage };