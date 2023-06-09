const puppeteer = require('puppeteer');
const fs = require('fs');

const prompt = require('prompt-sync')();
const userID = prompt('请输入作者ID：');

console.log('小說載入中，請稍後...');
(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(`https://${userID}.lofter.com/?page=1`);
    const lastPageOption = await page.$('.num');
    const lastPage = await lastPageOption.evaluate(option => option.innerText.split('/')[1]);

    const urls = [];
    for (let i = 1; i <= parseInt(lastPage); i++) {
        await page.goto(`https://${userID}.lofter.com/?page=${i}`, { waitUntil: 'networkidle0' });

        const linkURLs = await page.$$eval('.hot', elements => elements.map(el => el.href));
        urls.push(...linkURLs);
    }

    const stream = fs.createWriteStream(`${userID}.txt`);

    const promises = [];

    for (const [index, item] of urls.entries()) {
        console.log(`載入進度：${index + 1} / ${urls.length}`);
        try {
            await page.goto(item, { waitUntil: 'networkidle0' });

            const title = await page.evaluate(() => {
                const titleElement = document.querySelector('.ttl');
                return titleElement ? titleElement.innerText : null;
            });

            const txtcont = await page.evaluate(() => {
                const txtcontElement = document.querySelector('.txtcont');
                return txtcontElement ? txtcontElement.innerText : null;
            });

            if (title && txtcont) {
                stream.write(`CHAPTER ${title}:\n\n${txtcont}\n\n`);
            }
        } catch (error) {
            console.error(`導航到 ${item} 出錯：`, error);
        }
    }

    await Promise.all(promises);


    stream.end();
    await browser.close();
})();
