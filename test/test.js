import { Builder, By, Key, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { describe, it, afterEach, beforeEach } from 'mocha';


const browsers = ['chrome', 'firefox'];

// Declare the driver variable globally
let driver;

browsers.forEach(browser => {
  describe(`Google Search Test on ${browser}`, function () {
    this.timeout(30000); // Set timeout in case of slow connection

    // Set up the WebDriver before running the test
    beforeEach(async function () {
      driver = await new Builder().forBrowser(browser).build();
    });

    // Define the test case
    it('should search for Selenium WebDriver on Google', async function () {
      await driver.get('http://www.google.com');

      //Find the search box
      const searchBox = await driver.findElement(By.name('q'));

      //Search for Selenium WebDriver
      await searchBox.sendKeys('Selenium WebDriver', Key.RETURN);

      // Wait for the results page to load
      await driver.wait(until.elementLocated(By.id('search')), 10000);
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      expect(bodyText).to.include('Selenium WebDriver');
    });

    // Close the WebDriver after the test
    afterEach(async function () {
      await driver.quit();
    });
  });
});
