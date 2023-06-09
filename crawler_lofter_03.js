const puppeteer = require('puppeteer');
const fs = require('fs');

const prompt = require('prompt-sync')();
const userID = prompt('请输入作者ID：');

console.log('小說載入中，請稍後...');
(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    let next = `https://${userID}.lofter.com/?page=1`;
    const links = [];
    while (next) {
        await page.goto(next, { waitUntil: 'networkidle0' });

        let links1 = await page.$$eval('.day a', elements => elements.map(el => el.href))

        let links2 = await page.$$eval('.hot', elements => elements.map(el => el.href));

        if (links1.length !== 0) {
            links.push(...links1);
        }
        if (links2.length !== 0) {
            links.push(...links2);
        }

        next = await page.evaluate(() => {
            const nextPage = document.querySelector('.next a');
            return nextPage ? nextPage.href : null;
        });
    }

    const stream = fs.createWriteStream(`${userID}.txt`);
    console.log(links)


    for (const [index, item] of links.reverse().entries()) {
        console.log(`載入進度：${index + 1} / ${links.length}`);
        try {
            await page.goto(item, { waitUntil: 'networkidle0' });

            console.log(item)
            const txtcont1 = await page.evaluate(() => {
                const txtcontElements = document.querySelectorAll('.text')
                const secondTxtcontElement = txtcontElements[1].innerText;
                return secondTxtcontElement ? secondTxtcontElement : null;
            });

            // const txtcont2 = await page.evaluate(() => {
            //     const txtcontElement = document.querySelector('.txtcont');
            //     return txtcontElement ? txtcontElement.innerText : null;
            // });
            // console.log('txtcont1', txtcont1)
            // console.log('txtcont2', txtcont2)


            if (txtcont1) {
                stream.write(`CHAPTER ${index}:\n\n${txtcont1}\n\n`);
            }
            // if (txtcont2) {
            //     stream.write(`CHAPTER ${index}:\n\n${txtcont2}\n\n`);
            // }

        } catch (error) {
            console.error(`導航到 ${item} 出錯：`, error);
        }
    }


    stream.end();
    await browser.close();
    console.log('小說下載完成！');
})();
