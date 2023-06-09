const puppeteer = require("puppeteer");
const fs = require("fs");
const prompt = require('prompt-sync')();
const bookId = prompt('請輸入小說ID：');

console.log('小說載入中請稍候...');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`https://www.sto.cx/book-${bookId}-1.html`);
  const bookName = await page.evaluate(() => {
    return document.querySelector("h1").innerText;
  });
  const lastPage = await page.evaluate(() => {
    const select = document.querySelector("#Page_select");
    const option = select.options[select.options.length - 1];
    return option.innerText;
  });
  console.log(`開始下載，共 ${lastPage} 頁`);
  for (let i = 1; i <= parseInt(lastPage); i++) {
    await page.goto(`https://www.sto.cx/book-${bookId}-${i}.html`, { waitUntil: 'networkidle0' });
    console.log(`第 ${i} 頁載入中...`);
    const text = await page.evaluate(() => {
      const content = document.querySelector("#BookContent").innerText;
      return content;
    });
    fs.appendFileSync(`${bookName}.txt`, `${text}`);
  }

  await browser.close();
  console.log("下載完成.");
})();