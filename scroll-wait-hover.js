import { Builder, By, until } from 'selenium-webdriver';

async function hoverOnScrollElement() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://matthewgedminer.studio.site');

    // Wait until the element is located
    let element = await driver.wait(until.elementLocated(By.id('my-projects')), 5000);
    await driver.wait(until.elementIsVisible(element), 5000);

    console.log('Element found and visible');

    // Locate the MommiEnglish element but don't interact yet
    const mommiEnglish = await driver.findElement(By.xpath("//p[text()='MommiEnglish']"));

    console.log('2nd element found')

    // Perform hover action
    const actions = driver.actions({ async: true });
    await actions.move({ origin: mommiEnglish }).perform();

    console.log('Hovered over 2nd element');

    // Wait for the 2nd element text to be populated
    await driver.wait(async function () {
      let text = await mommiEnglish.getText();
      return text.trim().length > 0;  // Wait until text is not empty
    }, 5000);  // Wait up to 5 seconds

    // Retrieve the text
    let hoverText = await mommiEnglish.getText();
    console.log(`Text in hovered element: ${hoverText}`);

  } finally {
    await driver.quit();
  }
}

hoverOnScrollElement();
