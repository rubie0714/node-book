const puppeteer = require('puppeteer');
const fs = require("fs");

const prompt = require('prompt-sync')();
const userID = prompt('請輸入作者ID：');

console.log('小說載入中請稍候...');
(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(`https://${userID}.lofter.com/?page=1`);
    const lastPageOption = await page.$('.num');
    const lastPage = await lastPageOption.evaluate(option => option.innerText.split('/')[1]);
    const urls = []
    for (let i = 1; i <= parseInt(lastPage); i++) {
        await page.goto(`https://${userID}.lofter.com/?page=${i}`, { waitUntil: 'networkidle0' });
        const linkURLs = await page.evaluate(() => {
            const URLs = [];
            const hotElements = document.querySelectorAll('.hot'); // 获取具有 'hot' 类的元素集合
            hotElements.forEach((hotElement) => {
                const href = hotElement ? hotElement.href : null; // 获取链接的网址，如果不存在则为 null
                URLs.unshift(href);
            });
            return URLs;
        });

        urls.unshift(...linkURLs)

    }




    for (const [index, item] of urls.entries()) {
        console.log(`載入進度：${index + 1} / ${urls.length}`);
        await page.goto(item, { waitUntil: 'networkidle0' });

        const title = await page.evaluate(() => {
            const titleElement = document.querySelector(".ttl");
            return titleElement ? titleElement.innerText : null;
        });

        const txtcont = await page.evaluate(() => {
            const txtcontElement = document.querySelector(".txtcont");
            return txtcontElement ? txtcontElement.innerText : null;
        });

        if (title && txtcont) {
            fs.appendFileSync(`${userID}.txt`, `CHAPTER ${title}:\n\n${txtcont}\n\n`);
        }
    }
    console.log('下載完成');
    await browser.close();

})();


