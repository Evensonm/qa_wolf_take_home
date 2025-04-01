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
      let pageCount = 0;
      let loopCount = rowCount - 1;
    
    //Initiate array for all titles containing date/ time
      var allTitles = [];
    //   Getting first title in array
      allTitles[0] = await rows.nth(0).getAttribute("title");
      console.log(allTitles[0]);
    
      //Set the number of articles to validate
      let validateArticlesNum = 100;
      var articlesValidated = 1;
    
      while (articlesValidated <= validateArticlesNum) {
        
        while (loopCount > 0) {
            //Loop through array containing time stamps and compare date/time
        //if the article count reaches the number to validate, loop stops
          if (articlesValidated >= 1 && pageCount ==0) {
            for (let i=1; i < rowCount; i++){
                 if((i + (pageCount*rowCount)) > validateArticlesNum) {
                    return;
                }
            allTitles[i] = await rows.nth(i).getAttribute("title");
    
            // console.log((i +(pageCount*rowCount)), allTitles[i +(pageCount*rowCount)]);
            expect(allTitles[i - 1].slice(0, 19) >= allTitles[i].slice(0, 19))
              .toBeTruthy; 
                  
            console.log(i, allTitles[i], allTitles[i + (pageCount*rowCount) - 1].slice(0, 19) >= allTitles[i +(pageCount*rowCount)].slice(0, 19));
    
            articlesValidated++;
               
                loopCount--;
          }
        
        //   console.log(articlesValidated);
        //   console.log(validateArticlesNum);
        
        }
        //Slightly different logic needed for pages after the first
          if (articlesValidated >= 1 && pageCount >=1) {
            for (let i=0; i < rowCount;  i++){
                if((i + (pageCount*rowCount)) > validateArticlesNum) {
                    return;
                }
            allTitles[i +(pageCount*rowCount)] = await rows.nth(i).getAttribute("title");
    
            // console.log((i +(pageCount*rowCount)), allTitles[i +(pageCount*rowCount)]);
            expect(allTitles[i + (pageCount*rowCount) - 1].slice(0, 19) >= allTitles[i +(pageCount*rowCount)].slice(0, 19))
              .toBeTruthy;
    
              
    
            console.log((i+(pageCount*rowCount)), allTitles[i], allTitles[i + (pageCount*rowCount) - 1].slice(0, 19) >= allTitles[i +(pageCount*rowCount)].slice(0, 19));
    
            articlesValidated++;
            loopCount--;
          }
        
        //   console.log(articlesValidated);
        //   console.log(validateArticlesNum);
        
        }
          if (loopCount == 0) {
            //Logic to click "More" button to load more articles after going through each page
            const moreLink = page.locator('[class="morelink"]');
            await moreLink.click();
    
            await page.waitForLoadState("load");
    
            rows = page.locator('[class="age"]');

            //Reload rowCount and loopCounter; increase page count
            rowCount = await rows.count();
            pageCount = pageCount +1;
            loopCount = rowCount;
          } }}};

        (async () => {
            await sortHackerNewsArticles();
          })();
