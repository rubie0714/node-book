const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://kol.test/login');
    await page.waitForNavigation();

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    await page.type('#tel', '0923258468');
    await page.type('#password', '0923258468');

    const frame = await page.frames().find(f => f.name().startsWith("a-"));
    await frame.waitForSelector('div.recaptcha-checkbox-border');
    console.log("Captcha exists!");


    // 如果找到 reCAPTCHA 元素
    if (false) {
        // 執行一些 JavaScript 代碼來解決 reCAPTCHA
        await page.evaluate(() => {
            // 找到 reCAPTCHA iframe
            const iframe = document.querySelector("#recaptcha iframe");

            // 如果找到 iframe
            if (iframe) {
                // 在 iframe 中找到 reCAPTCHA checkbox
                const checkbox = iframe.contentWindow.document.querySelector(
                    'span[role="checkbox"]'
                );

                // 如果找到 checkbox
                if (checkbox) {
                    console.log('is check')
                    // 模擬點擊 checkbox
                    checkbox.click();
                }
            }
        });
    }
    // // 等待 reCAPTCHA 成功解決
    // await page.waitForFunction(
    //     () => {
    //         const successMessage = document.querySelector(".recaptcha-success");

    //         return successMessage && successMessage.style.display !== "none";
    //     },
    //     { timeout: 1000 } // 設置等待時間為 60 秒
    // );



    // // Wait and click on first result
    // const recaptcha = '.recaptcha-checkbox-borderAnimation';
    // await page.click(recaptcha);

    // const submit = '.btn .btn-primary .btn-block';
    // await page.click(submit);

    // // Locate the full title with a unique string

    //await page.click('.btn-primary');

    // Print the full title
    console.log('is login success');

    //await browser.close();
})();