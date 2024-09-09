import { Builder, By, until } from 'selenium-webdriver';

async function fillForm() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    let website = 'https://www.tutorialspoint.com/selenium/practice/register.php'
    await driver.get(website);

    let firstNameInput = await driver.findElement(By.id('firstname'));
    await firstNameInput.sendKeys('Super');

    let lastNameInput = await driver.findElement(By.id('lastname'));
    await lastNameInput.sendKeys('Dude');

    let userNameInput = await driver.findElement(By.id('username'));
    await userNameInput.sendKeys('Dudemaster 5000');

    let passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('secretpassword');

    let regsiterButton = await driver.wait(
      until.elementLocated(By.css('input[type="submit"][value="Register"]')),
      10000
    );
    await driver.wait(until.elementIsEnabled(regsiterButton), 10000);

    await regsiterButton.click();

  } finally {
    await driver.quit();
  }
}

fillForm();
