import { Builder, By, until } from 'selenium-webdriver';

// Set up and run the browser
async function runTest() {

  //Set the path to ChromeDriver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to a website
    await driver.get('https://www.selenium.dev/');

    // Wait for the title to be the page's title (this is an 'explicit wait' and an assertion?)
    await driver.wait(until.titleIs("Selenium"), 5000);

    // Print the title to the console
    let title = await driver.getTitle();
    console.log(`Page title is ${title}`);

    // Fetch an element by tag name
    let heading = await driver.findElement(By.tagName('h2')).getText();
    console.log(`Heading: ${heading}`)

  } finally {
    await driver.quit();
  }
}

runTest();
