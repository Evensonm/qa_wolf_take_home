// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { expect } = require("playwright/test");

const { chromium } = require("playwright");

const userAgentStrings = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
];

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    args: ["--disable-blink-features=AutomationControlled"],

    userAgent:
      userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)],
  });
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  //All date and time stamps are located within a span that has class of age
  let rows = page.locator('[class="age"]');

  //Counting listings per page to use in for loop
  let rowCount = await rows.count();
  let loopCount = rowCount;

  //Initiate array for all titles containing date/ time
  let allTitles = [];

  //Initiate array for titles on current page containing date/ time
  let titles = [];

  //Set the number of articles/ listings to validate they are in chronological order
  let validateArticlesNum = 100;

  // The loops should run while there are less time stamps than articles to validate
  while (allTitles.length < validateArticlesNum) {
    while (loopCount > 0) {
      for (let i = 0; i < rowCount; ++i) {
        //Put the titles of each row found with class of age into an array
        titles[i] = await rows.nth(i).getAttribute("title");

        loopCount--;
      }
      // Put the array containing those titles into an arry containing all titles
      allTitles = allTitles.concat(titles);
    }
    // console.log(allTitles.length);

    // Loop has taken all titles when rowCount/loopCount is 0, then click "More"

    if (loopCount == 0) {
      //Randomizing time to prevent bot detection
      await page.waitForTimeout(
        Math.floor(Math.random() * (8000 - 2500 + 1)) + 2500
      );

      // Find link to more articles and click
      const moreLink = page.locator('[class="morelink"]');
      await moreLink.click();

      //Wait for page to load before resetting row/ rowCount/ loopCount
      await page.waitForLoadState("load");

      rows = page.locator('[class="age"]');
      rowCount = await rows.count();
      loopCount = rowCount;
    }
  }

  console.log(allTitles);
  //Set arrays to test chronological order
  let newerListing = [];
  let olderListing = [];

  for (let i = 0; i < validateArticlesNum; ++i) {
    //Titles contained more than just the time stamp. Slice only the part needed
    newerListing = allTitles[i].slice(0, 19);
    olderListing = allTitles[i + 1].slice(0, 19);

    //Compare Time of the first listing to the next lising in the array
    const isNewer = newerListing >= olderListing;

    console.log(i + 1, newerListing, olderListing, isNewer);

    //Expect all newer listings to be greater than or equal to later listings
    expect(isNewer).toBeTruthy;
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
