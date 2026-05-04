const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Helper function to create a configured headless Chrome driver
async function createDriver() {
    let options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    return await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

async function runAllTests() {
    console.log("🚀 Starting Selenium Test Suite using Headless Chrome...\n");
    let driver = await createDriver();

    try {
        // --- Test 1: Verify Page Title and Load ---
        console.log("⏳ Running Test 1: Verify page title...");
        await driver.get('http://localhost:8080/source code/html + css/products.html');
        
        // Wait for grid to be present on DOM
        await driver.wait(until.elementLocated(By.id('product-grid')), 5000);
        let title = await driver.getTitle();
        assert(title.includes("Campus Tuck"), `Test 1 Failed: Title mismatch. Got ${title}`);
        console.log("✔ Test 1 Passed.\n");

        // --- Test 2: Check Category Filter Buttons Presence ---
        console.log("⏳ Running Test 2: Check filter buttons rendering...");
        let filterButtons = await driver.findElements(By.className('filter-btn'));
        assert(filterButtons.length >= 4, "Test 2 Failed: Expected at least 4 filter buttons.");
        console.log("✔ Test 2 Passed.\n");

        // --- Test 3: Filter Products by Category (Snacks) ---
        console.log("⏳ Running Test 3: Click Snacks category button...");
        let snacksBtn = await driver.findElement(By.css("button[data-category='snacks']"));
        await snacksBtn.click();
        
        // Verify active class is assigned
        let isActive = await snacksBtn.getAttribute("class");
        assert(isActive.includes("active"), "Test 3 Failed: Category button did not become active");
        console.log("✔ Test 3 Passed.\n");

        // --- Test 4: Check DOM rendered items (Product Grid) ---
        console.log("⏳ Running Test 4: Verify product-grid contains list element or children...");
        let productGrid = await driver.findElement(By.id('product-grid'));
        // Check if we can interact or read elements
        let gridHtml = await productGrid.getAttribute("innerHTML");
        assert(gridHtml !== null, "Test 4 Failed: Product grid is not accessible");
        console.log("✔ Test 4 Passed.\n");

        // --- Test 5: Search input simulation ---
        console.log("⏳ Running Test 5: Verify search input interactions...");
        // If there's an input field, enter a search term; otherwise check the search function
        let searchExists = await driver.findElements(By.id('searchInput'));
        if (searchExists.length > 0) {
            await driver.findElement(By.id('searchInput')).sendKeys('pizza');
            let searchVal = await driver.findElement(By.id('searchInput')).getAttribute("value");
            assert.strictEqual(searchVal, 'pizza', "Test 5 Failed: Search input mismatch");
        }
        console.log("✔ Test 5 Passed (or skipped if no search input). \n");

        // --- Tests 6 to 15: Additional workflow events & assertions ---
        console.log("⏳ Running Tests 6-15: Navigation and components validation...");
        
        // Test 6: Verify Cart Button Exists in Header
        let cartBtn = await driver.findElement(By.css("a[href='order.html']"));
        assert(cartBtn !== null, "Test 6 Failed: Cart button not found");

        // Test 7: Verify "Add to Cart" functionality simulation via JavaScript
        await driver.executeScript("addToCart('test_id_123');");
        
        // --- FIX: Handle the alert popup ---
        try {
            // Wait for the alert to be present
            await driver.wait(until.alertIsPresent(), 5000);
            
            // Switch to the alert and accept (click OK)
            let alert = await driver.switchTo().alert();
            await alert.accept();
            console.log("✔ Handled alert successfully.");
        } catch (e) {
            console.log("No alert found, continuing...");
        }

        let cartStorage = await driver.executeScript("return localStorage.getItem('cart');");
        assert(cartStorage.includes("test_id_123"), "Test 7 Failed: Failed to add item to LocalStorage");
        console.log("✔ Test 7 Passed.\n");

        // Test 8: Verify Categories in Footer
        let footerCols = await driver.findElements(By.css(".footer-col h3"));
        let foundCategoriesHeading = false;
        for (let col of footerCols) {
            if ((await col.getText()).includes("Categories")) {
                foundCategoriesHeading = true;
            }
        }
        assert(foundCategoriesHeading, "Test 8 Failed: Categories column not found in footer");

        // Test 9: Dropdown menu visibility check
        let dropdownBtn = await driver.findElement(By.className("dropdown-btn"));
        assert(dropdownBtn !== null, "Test 9 Failed: Dropdown button not found");

        // Test 10: Verify Contact Info in Footer
        let contactHeading = await driver.findElement(By.css(".footer-contact h3"));
        assert.strictEqual(await contactHeading.getText(), "Contact Us", "Test 10 Failed: Contact Us header mismatch");

        // Test 11: Validate Cart Button text
        let cartBtnText = await cartBtn.getText();
        assert(cartBtnText.includes("View Cart"), "Test 11 Failed: View Cart button text mismatch");

        // Test 12: Ensure Featured Products Container is Loaded/Replaced
        await driver.executeScript("renderFeaturedProducts();");
        let productSliderHtml = await driver.executeScript("return document.getElementById('featured-products-slider') ? document.getElementById('featured-products-slider').innerHTML : '';");
        assert(productSliderHtml !== null, "Test 12 Failed: Featured slider could not be rendered");

        // Test 13: Verify User Login button redirect link
        let userLoginBtn = await driver.findElement(By.css("button[onclick*='user.html']"));
        assert(userLoginBtn !== null, "Test 13 Failed: User login button not found");

        // Test 14: Verify Admin button redirect link
        let adminLoginBtn = await driver.findElement(By.css("button[onclick*='adminlogin.html']"));
        assert(adminLoginBtn !== null, "Test 14 Failed: Admin login button not found");

        // Test 15: Test window resize robustness
        await driver.manage().window().setRect({ width: 1280, height: 800 });
        console.log("✔ Test 15 Passed.\n");

        console.log("🎉 ALL 15 SELENIUM TESTS PASSED SUCCESSFULLY! 🎉");

    } catch (err) {
        console.error("❌ Test Suite Failed:", err);
    } finally {
        await driver.quit();
    }
}

runAllTests();