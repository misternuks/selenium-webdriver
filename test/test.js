import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import { describe, it, after, before } from 'mocha';

// Declare the driver variable globally
let driver;

describe('Google Search Test', function () {
  // Set up the WebDriver before running the test
  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  // Define the test case
  it('should load Google and check the title', async function () {
    await driver.get('http://www.google.com');
    const title = await driver.getTitle();
    expect(title).to.equal('Google');
  });

  // Close the WebDriver after the test
  after(async function () {
    await driver.quit();
  });
});
