import { expect, type Page } from "@playwright/test";
import { GLOBAL_MESSAGES as m } from "../global.variables";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { newCopy as copys } from "../data/copys/home/home.copy";

type TPage = Page | undefined | any;

export type THomePage = {
    verifyCookies(): Promise<void>;
    selectOriginOption(ciudad: string): Promise<void>;
    selectReturnOption(ciudad: string): Promise<void>;
    selectDepartureDate(): Promise<void>;
    selectReturnDate(): Promise<void>;
    selectPassengers(): Promise<void>;
    searchFlights(): Promise<void>;
    initPage(page: TPage): void;
    run(): Promise<void>;
}

let page: TPage;

const HomePage: THomePage = {

    initPage(pageP: TPage): void {
        page = pageP;
    },

    async verifyCookies(): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            const consentBtn = page.locator('#onetrust-pc-btn-handler', { delay: helper.getRandomDelay() });
            if (await consentBtn.isVisible()) {
                await page.waitForSelector("#onetrust-pc-btn-handler");
                await consentBtn.click();
                await page.locator('.save-preference-btn-handler.onetrust-close-btn-handler').click({ delay: helper.getRandomDelay() });
            }
        } catch (error) {
            console.error("COOKIES => Ocurrió un error al verificar las cookies | Error: ", error);
            throw error;
        }
    },

    async selectOriginOption(ciudad: string): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            console.log("selectOriginOption ejecutado");
            const lang = helper.getLang();
            await expect(page.locator('.content-wrap')).toBeVisible();
            await page.waitForSelector("#originBtn");
            await expect(page.locator('#originBtn')).toBeVisible();
            const origen = page.getByPlaceholder((copys[lang])?.origen);
            await page.locator('#originBtn').click({ delay: helper.getRandomDelay() });
            await origen.fill(ciudad, { delay: helper.getRandomDelay() });
            await origen.press('Enter');
            await page.waitForTimeout(1500);
            await page.locator(`id=${ciudad}`).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('ciudad-origen');
            await page.waitForTimeout(2000);
        } catch (error) {
            console.error("HOME => Ocurrió un error al seleccionar la ciudad de origen ", error);
            throw error;
        }
    },

    async selectReturnOption(ciudad: string): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            console.log("selectReturnOption ejecutado");
            const lang = helper.getLang();
            const destino = page.getByPlaceholder(copys[lang]?.destino);
            await expect(destino).toBeVisible();
            await destino.click({ delay: helper.getRandomDelay() });
            await destino.fill(ciudad, { delay: helper.getRandomDelay() });
            await destino.press('Enter');
            await page.locator(`id=${ciudad}`).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('ciudad-destino');
        } catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la ciudad de destino ", error);
            throw error;
        }
    },

    async selectDepartureDate(): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            console.log("selectDepartureDate ejecutado");
            await page.waitForSelector("#departureInputDatePickerId");
            const fechaIda = await page.locator('id=departureInputDatePickerId');
            fechaIda.click({ delay: helper.getRandomDelay() });
            await page.locator('span').filter({ hasText: copys['fecha_salida'] }).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('seleccion-fecha-ida');
        } catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la fecha de ida, Error: ", error);
            throw error;
        }
    },

    async selectReturnDate(): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            console.log("selectReturnDate ejecutado");
            await page.waitForTimeout(3000);
            await page.locator('span').filter({ hasText: copys['fecha_llegada'] }).click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('seleccion-fecha-vuelta');
        } catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la fecha de regreso, Error: ", error);
            throw error;
        }
    },

    async selectPassengers(): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            console.log("selectPassengers ejecutado");
            await page.getByRole('button', { name: '' }).nth(1).click();
            await page.getByRole('button', { name: '' }).nth(2).click();
            await page.getByRole('button', { name: '' }).nth(3).click();
            const confirmar = await page.locator('div#paxControlSearchId > div > div:nth-of-type(2) > div > div > button');
            confirmar.click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('seleccion-pasajeros');
        } catch (error) {
            console.error("Home => Ocurrió un error al seleccionar los pasajeros, Error: ", error);
            throw error;
        }
    },

    async searchFlights(): Promise<void> {
        if (!page) throw new Error(m.errors.initializated);

        try {
            console.log("searchFlights ejecutado");
            const lang = helper.getLang();
            const searchBtn = page.getByRole('button', { name: copys[lang]?.buscar, exact: true });
            await expect(searchBtn).toBeVisible();
            await searchBtn.click({ delay: helper.getRandomDelay() });
            await helper.takeScreenshot('busqueda-vuelos');
            await page.waitForSelector('#pageWrap');
        } catch (error) {
            console.error("Home => Ocurrió un error al buscar los vuelos, Error: ", error);
            throw error;
        }
    },

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

        console.log("Run ejecutado");

        await verifyCookies();
        await selectOriginOption(copys['ciudad_origen'] || 'CLO');
        await selectReturnOption(copys['ciudad_destino'] || 'BOG');
        await selectDepartureDate();
        await selectReturnDate();
        await selectPassengers();
        await searchFlights();

        console.log("Run FIN ejecutado");
    }
};

export { HomePage };
