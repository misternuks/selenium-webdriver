import { Builder, By, until } from 'selenium-webdriver';

// Set up and run the browser
async function example() {
  //Set the path to ChromeDriver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to a website
    await driver.get('https://www.google.com');

    // Wait for the title to be the page's title (this is an 'explicit wait' and an assertion?)
    await driver.wait(until.titleIs('Google'), 5000);

    // Out the title to the console
    let title = await driver.getTitle();
    console.log(`Page title is ${title}`);

  } finally {
    await driver.quit();
  }
}

example();
