import type { Page } from "@playwright/test";
import { copys } from "../data/copys";
import type { Lang } from "../types/copy.type";

type Tpage = Page | undefined | any;

let page: Tpage;
let screenshotCounter: number = 0;

const PlaywrightHelper = {
    
    init(pageP: Tpage) {
        page = pageP;
    },

    getTimestamp(): string {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dd = pad(now.getDate());
        const mm = pad(now.getMonth() + 1);
        const yyyy = now.getFullYear();
        const hh = pad(now.getHours());
        const mi = pad(now.getMinutes());
        const ss = pad(now.getSeconds());
        return `fecha-${dd}-${mm}-${yyyy}_hora-${hh}-${mi}-${ss}`;
    },

    async takeScreenshot(label: string): Promise<void> {
        screenshotCounter++;
        if (!page) {
            throw new Error("El navegador no ha sido inicializado. Llama al método 'initializeBrowser'");
        }

        try {

            const timestamp = PlaywrightHelper.getTimestamp();
            const filename = `step${screenshotCounter++}-${label}-${timestamp}.png`;
            await page.screenshot({
                path: `test-results/${filename}-${Date.now()}.png`,
                fullPage: true
            });

        } catch (error) {
            console.error("Ocurrió un error al tomar el screenshot con nombre ", label);
            throw error;
        }
    },
    getLang(): Lang {
        return copys.getLang();
    },
    getRandomDelay(): number {
        return Math.random() * (200 - 50) + 50;
    }
}

export { PlaywrightHelper };