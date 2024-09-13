import 'dotenv/config.js';
import { Builder, By, until } from 'selenium-webdriver';
import { assert, expect, should } from 'chai';
import "dotenv/config.js"

describe('Restaurant course menu checkout test', function() {
  // Set a timeout in case of slow-loading elements
  this.timeout(60000);

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  it('should load course menu page and confirm title', async function() {
    await driver.get('https://test.byfood.com/restaurant/tugce-test-restaurant-1531');

    let pageTitle = await driver.getTitle();
    console.log(`Page title: ${pageTitle}`);

    expect(pageTitle).to.include('Nishiazabu Yakiniku Ten');
  });

  it('should open course menu modal', async function() {
    // Two possible xpaths for target divs depending on responsive view size
    const xPathRelative01 = '//*[@id="centerArea"]/div[5]/div[1]/div[5]/div/div[2]/div[2]/div[3]/div[2]/div/div';
    const xPathRelative02 = '//*[@id="centerArea"]/div[5]/div[1]/div[5]/div/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/div[2]/div/div';

    // Find both
    const div1a = await driver.findElement(By.xpath(xPathRelative01));
    const div2a = await driver.findElement(By.xpath(xPathRelative02));

    // Set up async actions for hovering and clicking
    const actions = driver.actions({ async: true });

    // Check which div is visible then click on it
    if (await div1a.isDisplayed()) {
      await driver.wait(until.elementIsEnabled(div1a), 2000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", div1a);
      await actions.move({origin: div1a}).perform();
      await actions.move({origin: div1a}).click().perform();
    } else if (await div2a.isDisplayed()) {
      await driver.wait(until.elementIsEnabled(div2a), 2000);
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", div2a);
      await actions.move({origin: div2a}).perform();
      await actions.move({origin: div2a}).click().perform();
    } else {
      throw new Error('Neither div is visible');
    }

    // Find an element from the modal
    const modalElement = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="centerArea"]/div[6]/div/div/div/div/div[2]/div[3]')),
      9000
    );

    // Confirm it is displayed
    const isModalVisible = await modalElement.isDisplayed();
    expect(isModalVisible).to.be.true;
  });

  it('should select a day and time for the reservation', async function() {

    // Find the + button to add a person to the reservation then push twice
    const plusButtonPath = '//*[@id="centerArea"]/div[6]/div/div/div/div/div[2]/div[3]/div[4]';
    const plusButton = await driver.wait(until.elementLocated(By.xpath(plusButtonPath)), 5000);
    await plusButton.click();
    await plusButton.click();

    // Find a clickable day on the calendar
    const calendarTableXPath = '//*[@id="centerArea"]/div[6]/div/div/div/div/div[2]/div[8]/div/table/tbody';
    const calendarDays = await driver.findElements(By.xpath(`${calendarTableXPath}//td//div`));

    let dayFound = false;

    for (let day of calendarDays) {
      const cursorStyle = await day.getCssValue('cursor');
      if (cursorStyle === 'pointer') {
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", day);
        await driver.sleep(1000);
        await day.click();
        dayFound = true;
        break;
      }
    }
    expect(dayFound).to.be.true;

    //Find a clickable time after a day was chosen
    const timeSection = await driver.wait(
      until.elementLocated(By.xpath("//*[text()='Select the desired time']")),
      5000
    );

    const isTimeSectionVisible = await timeSection.isDisplayed();
    expect(isTimeSectionVisible).to.be.true;

    const timeSlots = await driver.findElements(By.xpath("//*[contains(text(), ':')]"));
    let timeSlotFound = false;

    for (let timeSlot of timeSlots) {
      const cursorStyle = await timeSlot.getCssValue('cursor');
      if (cursorStyle === 'pointer') {
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", timeSlot);
        await driver.sleep(1000);
        await timeSlot.click();
        timeSlotFound = true;
        break;
      }
    }
    expect(timeSlotFound).to.be.true;

    //Once everything has been selected, click 'Request Reservation.'
    const reservationButton = await driver.findElement(By.xpath("//*[contains(text(), 'Request Reservation')]"));
    await reservationButton.click();
  });

  it('should sign in and proceed to checkout', async function() {
    // Wait for the "Sign in to byFood" text to appear
    let signInSection = await driver.wait(
      until.elementLocated(By.xpath("//*[text()='Sign in to byFood']")),
      5000
    );

    // Ensure the time section is displayed
    if (await signInSection.isDisplayed()) {
      console.log("The sign in section is now visible.");
    }

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    // Find the email and password input fields and log in
    const emailInput = await driver.wait(
      until.elementLocated(By.xpath("//label[text()='Email Address']/preceding-sibling::input")),
      5000
    );
    await emailInput.sendKeys(email);
    expect(await emailInput.getAttribute('value')).to.equal(email);

    const passwordInput = await driver.wait(
      until.elementLocated(By.xpath("//label[text()='Password']/preceding-sibling::input")),
      5000
    );
    await passwordInput.sendKeys(password);
    expect(await passwordInput.getAttribute('value')).to.equal(password);

    const signInButton = await driver.wait(
      until.elementLocated(By.xpath("//*[text()='Sign In']")),
      5000
    );
    await signInButton.click();

    const maxWaitTime = 60000;
    await driver.wait(async function() {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl.includes('checkout');
    }, maxWaitTime);

    const detailsUrl = await driver.getCurrentUrl();
    expect(detailsUrl).to.include('checkout');
  });

  it('should complete the checkout with personal details and valid credit card', async function() {
    // Wait for the "Fullname" input to be present
    let fullNameInput = await driver.wait(
      until.elementLocated(By.xpath("//label[text()='Fullname (Name Surname)']/preceding-sibling::input")),
      10000
    );
    await fullNameInput.sendKeys('Test Master');
    expect(await fullNameInput.getAttribute('value')).to.equal('Test Master');  // Validate full name entry
    console.log("Full name successfully entered.");

    // Find and input the country
    let countryInput = await driver.findElement(By.xpath("//label[text()='Country']/preceding-sibling::input"));
    await countryInput.click();
    await countryInput.sendKeys('Japan');

    // Wait for dropdown option and select "Japan"
    let dropdownOption = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Japan')]")),
      5000
    );
    await dropdownOption.click();
    expect(await countryInput.getAttribute('value')).to.equal('Japan');  // Validate country selection
    console.log("Country successfully entered.");

    // Find and input the country code
    let countryCode = await driver.findElement(By.xpath("//label[text()='Country code']/preceding-sibling::input"));
    await countryCode.click();
    await countryCode.sendKeys('Japan');

    dropdownOption = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Japan (81)')]")),
      5000
    );
    await dropdownOption.click();
    expect(await countryCode.getAttribute('value')).to.equal('Japan (81)');  // Validate country code
    console.log("Country code successfully entered.");

    // Find and input the phone number
    let phoneNumber = await driver.findElement(By.xpath("//label[text()='Phone number']/preceding-sibling::input"));
    await phoneNumber.sendKeys('8055555555');
    expect(await phoneNumber.getAttribute('value')).to.equal('8055555555');  // Validate phone number
    console.log("Phone number successfully entered.");

    const cardNumber = process.env.CARD_NUMBER;
    const cardExpiry = process.env.CARD_EXPIRY;
    const cardCvc = process.env.CARD_CVC;
    const cardZip = process.env.CARD_ZIP;

    const stripeIframe = await driver.wait(until.elementLocated(By.css('iframe[name^="__privateStripeFrame"]')), 10000);
    await driver.switchTo().frame(stripeIframe);

    const cardNumberInput = await driver.findElement(By.css('input[name="cardnumber"]'));
    await cardNumberInput.sendKeys(`${cardNumber}${cardExpiry}${cardCvc}${cardZip}`);

    await driver.sleep(2000);  // Ensure card details are processed
    await driver.switchTo().defaultContent();
    console.log("Credit card number successfully entered.");

    let checkBox01 = await driver.wait(
      until.elementLocated(By.xpath(
        "//*[contains(text(), 'Message from Venue above')]"
        )),
        10000
      );

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", checkBox01);
    await checkBox01.click();
    console.log("1st checkbox clicked.")

    let checkBox02 = await driver.findElement(
      By.xpath("//*[contains(text(), 'cancelation fees above')]")
    )
    await checkBox02.click();
    console.log("2nd checkbox clicked.")

    let checkBox03 = await driver.findElement(
      By.xpath("//*[contains(text(), 'I have read and agree')]")
    )
    await checkBox03.click();
    console.log("3rd checkbox clicked.")

    let requestReservation = await driver.findElement(By.xpath("//*[text()='Request Reservation']"))
    await requestReservation.click();

    console.log("Reservation submitted.")

    const maxWaitTime = 60000;
    const pollingInterval = 500;
    await driver.wait(async function () {
      let finalUrl = await driver.getCurrentUrl();
      return finalUrl.includes('reservation-checkout');
    }, maxWaitTime, `URL did not contain 'reservation-checkout' after ${maxWaitTime / 1000} seconds.`, pollingInterval);

    let finalUrl = await driver.getCurrentUrl();
    console.log("Reservation successful (but not confirmed).");
    expect(finalUrl).to.include('reservation-checkout');
    driver.sleep(5000);

  });
});
