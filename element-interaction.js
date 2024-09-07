import { Builder, By, until } from 'selenium-webdriver';

async function locateElements() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to a website
    await driver.get('https://www.mommienglish.com/');

    // Locate a heading via tag
    let heading = await driver.findElement(By.tagName('h2')).getText();
    console.log(`Heading text: ${heading}`);

    // Locate an element via CSS selector
    let button = await driver.findElement(By.className('red-button')).getText();
    console.log(`Button text: ${button}`)

    // Locate an element by XPath (not ideal)
    let xpath = await driver.findElement(By.xpath('//li')).getText();
    console.log(`Xpath text: ${xpath}`);

  } finally {
    // Quit the browser
    await driver.quit();
  }
}

locateElements();
