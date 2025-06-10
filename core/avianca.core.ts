import { GLOBAL_VARIABLES as g, GLOBAL_MESSAGES as m } from "../global.variables";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { PlaywrightHelper as helper } from "../helpers/avianca.helper";

let page: Page | undefined | any;
let browser: Browser | undefined | any;
let context: BrowserContext | undefined | any;

const AviancaCore = {
    async initializeBrowser(): Promise<void> {
        try {
            const { chromium } = require("playwright-extra");
            browser = await chromium.launch({
                headless: g.headless,
                screenshot: 'on',
                video: 'on',
                ignoreHTTPSErrors: true,
                args: [
                    '--disable-http2',
                    '--enable-webgl',
                    '--use-gl=swiftshader',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1280,720',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-ipc-flooding-protection',
                    '--disable-renderer-backgrounding',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-field-trial-config',
                    '--disable-back-forward-cache',
                    '--enable-features=NetworkService,NetworkServiceLogging',
                    '--disable-extensions',
                    '--force-color-profile=srgb',
                    '--metrics-recording-only',
                    '--no-first-run',
                    '--enable-automation=false',
                    '--password-store=basic',
                    '--use-mock-keychain'
                ]
            });

            context = await browser?.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                viewport: { width: 1280, height: 720 },
                locale: 'en-US',
                timezoneId: 'America/New_York',
                deviceScaleFactor: 1,
                hasTouch: false,
                isMobile: false,
                javaScriptEnabled: true,
                permissions: [],
                recordVideo: {
                    dir: 'test-results/videos/', // Carpeta donde se guardarán los videos
                    size: { width: 1280, height: 720 }
                },
                extraHTTPHeaders: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Cache-Control': 'max-age=0'
                }
            });

            page = await context?.newPage();

            await page?.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });

                delete (window as any).chrome.runtime.onConnect;

                (window as any).chrome = {
                    runtime: {},
                    loadTimes: function () {
                        return {
                            commitLoadTime: Date.now() - Math.random() * 1000,
                            finishDocumentLoadTime: Date.now() - Math.random() * 1000,
                            finishLoadTime: Date.now() - Math.random() * 1000,
                            firstPaintAfterLoadTime: Date.now() - Math.random() * 1000,
                            firstPaintTime: Date.now() - Math.random() * 1000,
                            navigationType: 'navigate',
                            wasFetchedViaSpdy: false,
                            wasNpnNegotiated: false
                        };
                    },
                    csi: function () {
                        return {
                            startE: Date.now() - Math.random() * 1000,
                            onloadT: Date.now() - Math.random() * 1000,
                            pageT: Date.now() - Math.random() * 1000
                        };
                    }
                };

                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5],
                });

                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en'],
                });
            });

            return page;
        }
        catch (error) {
            console.error("Error al inicializar el navegador!", error);
            throw error;
        }
    },

    async initTests(): Promise<void> {

        if (!page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await page.goto('https://www.avianca.com/', {
                waitUntil: "domcontentloaded",
                timeout: 400_000
            });
            await page.waitForSelector("#searchComponentDiv");
            await helper.takeScreenshot("Avianca-home");
        } catch (error) {
            console.log("Ocurrió un error durante la navegación, Error: ", error);
            throw error;
        }
    },

    async closeBrowser(): Promise<void> {
        try {
            if (page) {
                await page.close();
                page = undefined;
            }
            if (context) {
                await context.close();
                context = undefined;
            }
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        } catch (error) {
            console.error('CLOSEBROWSER => Ocurrió un error cerrando el navegador | Error: ', error);
            throw error;
        }
    },

    getPage() {
        if (!page) {
            throw new Error("El navegador no ha sido inicializado. Llama al método 'initializeBrowser'");
        }
        return page;
    }
}

export { AviancaCore };