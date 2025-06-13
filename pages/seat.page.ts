import { expect, type Page } from "@playwright/test";
import { GLOBAL_MESSAGES as m } from "../global.variables";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { copys } from "../data/copys";
 
type TPage = Page | undefined | any;
 
export type TSeatPage = {
    seleccionar_asientos_ida(): Promise<void>;
    confirmar_asientos_ida(): Promise<void>;
    seleccionar_asientos_regreso(): Promise<void>;
    ir_a_pagar(): Promise<void>;
    initPage(page: TPage): void;
    run(): Promise<void>;
}
 
let page: TPage;
 
const SeatPage: TSeatPage = {
 
    initPage(pageP: TPage): void {
        page = pageP;
    },
 
     async seleccionar_asientos_ida(): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                await page.waitForTimeout(12000);
                await helper.takeScreenshot("Pagina-de-seleccion-asientos");
                const pasajeros = page.locator(".pax-selector_pax-avatar")
                for (const e of await pasajeros.all()) {
                    await helper.takeScreenshot("seleccion-asiento");
                    await expect(page.locator(".seat-number").first()).toBeVisible();
                    await page.locator('.seat-number').first().click({ delay: helper.getRandomDelay()} );
                    await page.waitForTimeout(8000);
                }
            }
        catch (error) {
            console.error("ASIENTOS IDA => Ocurrió un error al verificar los asientos de ida | Error: ", error);
            throw error;
        }
    },
 
    async confirmar_asientos_ida(): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                await page.waitForSelector(".next-flight-code");
                await expect(page.locator(".next-flight-code")).toBeVisible();
                await helper.takeScreenshot("seleccion-asiento-vuelta");
                await page.locator('.next-flight-code').click({ delay: helper.getRandomDelay()} );
            }
        catch (error) {
            console.error("CONFIRMAR ASIENTOS IDA => Ocurrió un error al confirmar los asientos de ida | Error: ", error);
            throw error;
        }
    },
 
    async seleccionar_asientos_regreso(): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                const pasajerosVuelta = page.locator(".pax-selector_pax-avatar")
   
                for (const j of await pasajerosVuelta.all()) {
                    await helper.takeScreenshot("seleccion-asiento");
                    await expect(page.locator(".seat-number").first()).toBeVisible();
                    await page.locator('.seat-number').first().click({ delay: helper.getRandomDelay()} );
                    await page.waitForTimeout(8000);
                }
            }
        catch (error) {
            console.error("ASIENTOS REGRESO => Ocurrió un error al verificar los asientos de regreso | Error: ", error);
            throw error;
        }
    },
 
    async ir_a_pagar(): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                const lang = helper.getLang();
                await expect(page.getByRole('button', { name: copys[lang].pagar, exact: true })).toBeVisible()
                await page.getByRole('button', { name: copys[lang].pagar, exact: true }).click({ delay: helper.getRandomDelay()} );
                await page.waitForTimeout(5000);
            }
        catch (error) {
            console.error("IR A PAGAR => Ocurrió un error al ir a pagar | Error: ", error);
            throw error;
        }
    },
 
    async run(): Promise<void> {
 
        const {
            seleccionar_asientos_ida,
            confirmar_asientos_ida,
            seleccionar_asientos_regreso,
            ir_a_pagar,
        } = SeatPage;
 
        console.log("Seats page started...");
        await seleccionar_asientos_ida();
        await confirmar_asientos_ida();
        await seleccionar_asientos_regreso();
        await ir_a_pagar();
        console.log("Seats page ended...");
    }
};
 
export { SeatPage };