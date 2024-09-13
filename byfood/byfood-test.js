import "dotenv/config.js"
import { Builder, By, until } from 'selenium-webdriver';

async function testAutomation() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const cardNumber = process.env.CARD_NUMBER;
  const cardExpiry = process.env.CARD_EXPIRY;
  const cardCvc = process.env.CARD_CVC;
  const cardZip = process.env.CARD_ZIP;

  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the page
    await driver.get('https://test.byfood.com/restaurant/tugce-test-restaurant-1531');

    let pageTitle = await driver.getTitle();
    console.log(`Page title: ${pageTitle}`);

    await driver.sleep(5000);

    // XPaths for the two divs that trigger the modal
    let xPathRelative01 = '//*[@id="centerArea"]/div[5]/div[1]/div[5]/div/div[2]/div[2]/div[3]/div[2]/div/div';
    let xPathRelative02 = '//*[@id="centerArea"]/div[5]/div[1]/div[5]/div/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/div[2]/div/div';

    // Locate both divs based on xpath
    let div1a = await driver.findElement(By.xpath(xPathRelative01));
    let div2a = await driver.findElement(By.xpath(xPathRelative02));

    // Set up async actions for hovering and clicking
    const actions = driver.actions({async: true});

    // Check which div is visible
    if (await div1a.isDisplayed()) {
      await driver.wait(until.elementIsEnabled(div1a), 2000);

      console.log("Div 1a is visible, performing a click using Actions API...");

      // Scroll div1a into the center of the view
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", div1a);

      // Hover over div and click
      await actions.move({origin: div1a}).perform();
      await actions.move({origin: div1a}).click().perform();

    } else if (await div2a.isDisplayed()) {
      await driver.wait(until.elementIsEnabled(div2a), 2000);

      console.log("Div 2a is visible, performing a click using Actions API...");

      // Scroll div2a into the center of the view
      await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", div2a);

      // Hover over div and click
      await actions.move({origin: div2a}).perform();
      await actions.move({origin: div2a}).click().perform();

    } else {
      console.log("Neither div is visible");
    }

    // Wait for the modal to open by waiting for the "course menu" element
    let modalElement = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="centerArea"]/div[6]/div/div/div/div/div[2]/div[3]')),
      9000
    );

    // Check if the modal element is visible
    if (await modalElement.isDisplayed()) {
      console.log("Modal opened successfully with 'course menu' visible.");
      await driver.sleep(2000)
    } else {
      console.log("Modal did not open correctly.");
    }

    let plusButtonPath = '//*[@id="centerArea"]/div[6]/div/div/div/div/div[2]/div[3]/div[4]'
    // Push the + button twice
    let plusButton = await driver.wait(until.elementLocated(By.xpath(plusButtonPath)), 5000);
    await plusButton.click();
    await plusButton.click();

    // Wait until the calendar becomes interactable
    await driver.sleep(2000);

    // XPath for the table containing calendar days
    let calendarTableXPath = '//*[@id="centerArea"]/div[6]/div/div/div/div/div[2]/div[8]/div/table/tbody';
    let calendarDays = await driver.findElements(By.xpath(`${calendarTableXPath}//td//div`));

    console.log(`Total days found: ${calendarDays.length}`);

    // Iterate through each day to check if it has 'cursor: pointer', then click
    for (let day of calendarDays) {
      let cursorStyle = await day.getCssValue('cursor');

      if (cursorStyle === 'pointer') {
        console.log("Clickable day found!");
        // Scroll the clickable day slot into view, centered
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", day);
        // Wait a little after scrolling to allow the UI to update
        await driver.sleep(1000);
         // Click the first clickable day, then stop
        await day.click();
        break;
      // } else {
      //   console.log("Unclickable day found.");
      }
    }

    // Wait for the "Select the desired time" text to appear
    let timeSection = await driver.wait(
      until.elementLocated(By.xpath("//*[text()='Select the desired time']")),
      5000
    );

    // Ensure the time section is displayed
    if (await timeSection.isDisplayed()) {
      console.log("Time section is now visible.");
    }

    // Find time slots
    let timeSlots = await driver.findElements(By.xpath("//*[contains(text(), ':')]"));

    console.log(`Total time slots found: ${timeSlots.length}`);

    // Iterate through each time slot to find the first clickable one
    for (let timeSlot of timeSlots) {
      let cursorStyle = await timeSlot.getCssValue('cursor');

      if (cursorStyle === 'pointer') {
        console.log("Clickable time slot found!");

        // Scroll the clickable time slot into view, centered
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", timeSlot);

        // Wait a little after scrolling to allow the UI to update
        await driver.sleep(1000); // Short delay to ensure smooth scrolling

        // Click the time slot
        await timeSlot.click();
        break;
      // } else {
      //   console.log("Unclickable time slot.");
      }
    }

    // Wait for the selection to process
    await driver.sleep(2000);

    // Find the reservation button
    let reservationButton = await driver.findElement(By.xpath("//*[contains(text(), 'Request Reservation')]"));

    await reservationButton.click();

    // Wait for the "Sign in to byFood" text to appear
    let signInSection = await driver.wait(
      until.elementLocated(By.xpath("//*[text()='Select the desired time']")),
      5000
    );

    // Ensure the time section is displayed
    if (await signInSection.isDisplayed()) {
      console.log("The sign in section is now visible.");
    }

    // Wait for the "Email Address" input to be present
    let emailInput = await driver.wait(
      until.elementLocated(By.xpath(
        "//label[text()='Email Address']/preceding-sibling::input"
      )),
      5000
    );

    // Input email address
    await emailInput.sendKeys(email);
    console.log("Email successfully entered.");

    // Wait for the "Password" input to be present
    let passwordInput = await driver.wait(
      until.elementLocated(By.xpath(
        "//label[text()='Password']/preceding-sibling::input"
      )),
      5000
    );

    // Input password
    await passwordInput.sendKeys(password);
    console.log("Password successfully entered.");

    // Wait for the "Sign In" button to be present
    let signInButton = await driver.wait(
      until.elementLocated(By.xpath(
        "//*[text()='Sign In']"
      )),
      5000
    );

    await actions.move({origin: signInButton}).perform();
    await actions.move({origin: signInButton}).click().perform();
    console.log("Sign in clicked")

    // Implement polling to check if the URL contains 'checkout'
    let maxWaitTime = 60000;
    let pollingInterval = 500;

    await driver.wait(async function () {
      let currentUrl = await driver.getCurrentUrl();
      return currentUrl.includes('checkout');
    }, maxWaitTime, `URL did not contain 'checkout' after ${maxWaitTime / 1000} seconds.`, pollingInterval);

    console.log("Page URL contains 'checkout'");

    let personalInfo = await driver.wait(
    until.elementLocated(By.xpath(
      "//*[text()='Personal Info']"
      )),
      10000
    );

    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", personalInfo);

    // Wait for the "Fullname" input to be present
    let fullNameInput = await driver.wait(
      until.elementLocated(By.xpath(
        "//label[text()='Fullname (Name Surname)']/preceding-sibling::input"
      )),
      10000
    );

    // Input full name
    await fullNameInput.sendKeys('Test Master')
    console.log("Full name successfully entered.")

    // Find country input
    let countryInput = await driver.findElement(By.xpath(
      "//label[text()='Country']/preceding-sibling::input"
    ));

    // Input country
    await countryInput.click();
    await countryInput.sendKeys('Japan');
    let dropdownOption = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Japan')]")),
      5000
    );
    await dropdownOption.click();
    console.log("Country successfully entered.")

    // Find country code
    let countryCode = await driver.findElement(By.xpath(
      "//label[text()='Country code']/preceding-sibling::input"
    ));

    // Input country code
    await countryCode.click();
    await countryCode.sendKeys('Japan');
    dropdownOption = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Japan (81)')]")),
      5000
    );
    await dropdownOption.click();
    console.log("Country code successfully entered.")

    // Find phone number
    let phoneNumber = await driver.findElement(By.xpath(
      "//label[text()='Phone number']/preceding-sibling::input"
    ));

    // Input phone number
    await phoneNumber.sendKeys('08055555555');
    console.log("Phone number successfully entered.");

    // Locate the Stripe iframe and switch context
    let stripeIframe = await driver.wait(until.elementLocated(By.css('iframe[name^="__privateStripeFrame"]')), 10000);
    await driver.switchTo().frame(stripeIframe);

    // Locate the credit card input field within the iframe
    let cardNumberInput = await driver.findElement(By.css('input[name="cardnumber"]'));

    // Input the full credit card number, including the card number, MM/YY, CVC, and ZIP
    await cardNumberInput.sendKeys(`${cardNumber}${cardExpiry}${cardCvc}${cardZip}`);

    // Optionally wait for a brief moment to ensure the input processing completes
    await driver.sleep(2000);

    // Switch back to the main page context
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

    await driver.wait(async function () {
      let finalUrl = await driver.getCurrentUrl();
      return finalUrl.includes('reservation-checkout');
    }, maxWaitTime, `URL did not contain 'reservation-checkout' after ${maxWaitTime / 1000} seconds.`, pollingInterval);

    console.log("Reservation successful (but not confirmed).");

    await driver.sleep(5000);

  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    await driver.quit();
  }
}

testAutomation();
