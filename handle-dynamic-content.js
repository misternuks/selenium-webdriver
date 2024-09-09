import { Builder, By, until } from 'selenium-webdriver';

async function waitForElement() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {

    await driver.get('https://matthewgedminer.studio.site');

    let element = await driver.wait(
      until.elementLocated(By.linkText('Matthew Ged Miner')),
      10000 // Wait up to 10 seconds
    );

    // Interact with the element
    let retrievedText = await element.getText();
    console.log(`Retrieved text: ${retrievedText}`);

  } finally {
    await driver.quit();
  }
}

waitForElement();
