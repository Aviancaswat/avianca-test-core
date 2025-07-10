import { expect, type Page } from "@playwright/test";
import { GLOBAL_MESSAGES as m } from "../global.variables";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";
import { copySeat } from "../data/copys/seat/seat.copy";
 
type TPage = Page | undefined | any;
 
export type TSeatPage = {
    seleccionar_asientos_ida(): Promise<void>;
    seleccionar_asiento_tarifa_premium(numero_pasajeros): Promise<void>;
    seleccionar_asiento_tarifa_plus(numero_pasajeros): Promise<void>;
    seleccionar_asiento_tarifa_economy(numero_pasajeros): Promise<void>;
    seleccionar_asiento_tarifa_business(numero_pasajeros): Promise<void>;
    seleccionar_asiento_emergency(numero_pasajeros): Promise<void>;
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
             const {
                    seleccionar_asiento_tarifa_business,
                    seleccionar_asiento_tarifa_premium,
                    seleccionar_asiento_tarifa_plus,
                    seleccionar_asiento_tarifa_economy,
                    seleccionar_asiento_emergency,
                } = SeatPage;
                await page.waitForTimeout(12000);
                await helper.takeScreenshot("Pagina-de-seleccion-asientos");
                //const pasajeros = page.locator(".pax-selector_pax-avatar")
                const countPasajeros = await page.locator(".pax-selector_pax-avatar").count();
                const tarifaAsientos= copySeat.tarifaDeAsientos;
                switch (tarifaAsientos) {
                    case 'business':
                        await seleccionar_asiento_tarifa_business(countPasajeros);
                        break;
                    case 'premium':
                        await seleccionar_asiento_tarifa_premium(countPasajeros);
                        break;
                    case 'plus':
                        await seleccionar_asiento_tarifa_plus(countPasajeros);
                        break;
                    case 'economy':
                        await seleccionar_asiento_tarifa_economy(countPasajeros);
                        break;
                    case 'emergency':
                        await seleccionar_asiento_emergency(countPasajeros);
                        break;
                }
            }
        catch (error) {
            console.error("ASIENTOS IDA => Ocurrió un error al verificar los asientos de ida | Error: ", error);
            throw error;
        }
    },

    async seleccionar_asiento_tarifa_business(numero_pasajeros): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
            await page.evaluate((num_pasajeros) => {
                let nombreAsientoBusiness;
                let asientosBusiness = document.querySelector('.seatmap_group--flatbed')?.querySelectorAll('.seat-number');
                if(asientosBusiness!=null){
                    for(let i=0;i<asientosBusiness.length; i++){
                        if(i < num_pasajeros){
                            let elemNombreAsientoBusiness = asientosBusiness[i] as HTMLElement;
                            nombreAsientoBusiness = elemNombreAsientoBusiness.innerText;
                            nombreAsientoBusiness = nombreAsientoBusiness.replace('Asiento:\n','');
                            elemNombreAsientoBusiness.click();
                        }else{
                            break;
                        }
                    }
                }
            },numero_pasajeros);
        }
        catch (error) {
            console.error("SELECCION ASIENTO BUSINESS => Ocurrió un error al seleccionar un asiento business | Error: ", error);
            throw error;
        }
    },

    async seleccionar_asiento_tarifa_premium(numero_pasajeros): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                 await page.evaluate((num_pasajeros) => {
                    let nombreAsientoPremium;
                    let asientosPremium = document.querySelector('.seatmap_group--premium')?.querySelectorAll('.seat-number');
                    if(asientosPremium!=null){
                        for(let i=0;i<asientosPremium.length; i++){
                            if(i < num_pasajeros){
                                let elemNombreAsientoPremium = asientosPremium[i] as HTMLElement;
                                nombreAsientoPremium = elemNombreAsientoPremium.innerText;
                                nombreAsientoPremium = nombreAsientoPremium.replace('Asiento:\n','');
                                elemNombreAsientoPremium.click();
                            }else{
                                break;
                            }
                        }
                    }
                },numero_pasajeros);
            }
        catch (error) {
            console.error("SELECCION ASIENTO PREMIUM => Ocurrió un error al seleccionar un asiento premium | Error: ", error);
            throw error;
        }
    },

    async seleccionar_asiento_tarifa_plus(numero_pasajeros): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                 await page.evaluate((num_pasajeros) => {
                    console.log('num_pasajeros'+num_pasajeros);
                    let nombreAsientoPlus;
                    let asientosPlus = document.querySelector('.seatmap_group--plus')?.querySelectorAll('.seat-number');
                    if(asientosPlus!=null){
                        for(let i=0;i<asientosPlus.length; i++){
                            if(i < num_pasajeros){
                                console.log('entro a  for i '+i);
                                console.log(' asientosPlus[i]'+ asientosPlus[i]);
                                let elemNombreAsientoPlus = asientosPlus[i] as HTMLElement;
                                nombreAsientoPlus = elemNombreAsientoPlus.innerText;
                                nombreAsientoPlus = nombreAsientoPlus.replace('Asiento:\n','');
                                console.log('nombreAsientoPlus***********'+ nombreAsientoPlus);
                                elemNombreAsientoPlus.click();
                            }else{
                                break;
                            }
                               
                        }
                    }
                },numero_pasajeros);
            }
        catch (error) {
            console.error("SELECCION ASIENTO PLUS => Ocurrió un error al seleccionar un asiento plus | Error: ", error);
            throw error;
        }
    },

    async seleccionar_asiento_tarifa_economy(numero_pasajeros): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try {
                    await page.evaluate((num_pasajeros) => {
                        console.log('num_pasajeros'+num_pasajeros);
                    let nombreAsientoEconomy;
                    let asientosEconomy = document.querySelector('.seatmap_group--economy')?.querySelectorAll('.seat-number');
                    if(asientosEconomy!=null){
                        for(let i=0;i<asientosEconomy.length; i++){
                            if(i < num_pasajeros){
                                console.log('entro a  for i '+i);
                                console.log(' asientosEconomy[i]'+ asientosEconomy[i]);
                                let elemNombreAsientoEconomy = asientosEconomy[i] as HTMLElement;
                                nombreAsientoEconomy = elemNombreAsientoEconomy.innerText;
                                nombreAsientoEconomy = nombreAsientoEconomy.replace('Asiento:\n','');
                                console.log('nombreAsientoEconomy***********'+ nombreAsientoEconomy);
                                elemNombreAsientoEconomy.click();
                            }else{
                                break;
                            }
                               
                        }
                    }
                        
                    },numero_pasajeros);
            }
        catch (error) {
            console.error("SELECCION ASIENTO ECONOMY => Ocurrió un error al seleccionar un asiento economy | Error: ", error);
            throw error;
        }
    },

    async seleccionar_asiento_emergency(numero_pasajeros): Promise<void> {
        if (!page) {
            throw new Error(m.errors.initializated);
        }
        try 
        {
             await page.evaluate((num_pasajeros) => {
                let nombreAsientoEmrgency;
                let asientosEmergency = document.querySelector('.seatmap_group--emergency')?.querySelectorAll('.seat-number');
                if(asientosEmergency!=null){
                    for(let i=0;i<asientosEmergency.length; i++){
                        if(i < num_pasajeros){
                            let elemNombreAsientoEmergency = asientosEmergency[i] as HTMLElement;
                            nombreAsientoEmrgency = elemNombreAsientoEmergency.innerText;
                        
                        }else{
                            break;
                        }
                    }
                }
            },numero_pasajeros);
        }
        catch (error) {
            console.error("SELECCION ASIENTO EMERGENCY => Ocurrió un error al seleccionar un asiento emergency | Error: ", error);
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
            const {
                    seleccionar_asiento_tarifa_business,
                    seleccionar_asiento_tarifa_premium,
                    seleccionar_asiento_tarifa_plus,
                    seleccionar_asiento_tarifa_economy,
                    seleccionar_asiento_emergency,
                } = SeatPage;
                const countPasajeros = await page.locator(".pax-selector_pax-avatar").count();
                const tarifaAsientos= copySeat.tarifaDeAsientos;
                switch (tarifaAsientos) {
                    case 'business':
                        await seleccionar_asiento_tarifa_business(countPasajeros);
                        break;
                    case 'premium':
                        await seleccionar_asiento_tarifa_premium(countPasajeros);
                        break;
                    case 'plus':
                        await seleccionar_asiento_tarifa_plus(countPasajeros);
                        break;
                    case 'economy':
                        await seleccionar_asiento_tarifa_economy(countPasajeros);
                        break;
                    case 'emergency':
                        await seleccionar_asiento_emergency(countPasajeros);
                        break;
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
                await expect(page.getByRole('button', { name: copySeat[lang].pagar, exact: true })).toBeVisible()
                await page.getByRole('button', { name: copySeat[lang].pagar, exact: true }).click({ delay: helper.getRandomDelay()} );
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