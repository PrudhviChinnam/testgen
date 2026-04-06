const { chromium } = require('playwright')

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox']
  })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  })
  const page = await context.newPage()
  await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }) })
  page.setDefaultTimeout(15000)
  try {
    console.log('STEP_START:1:Navigate to Amazon India homepage')
    await page.goto('https://www.amazon.in/')
    await page.waitForLoadState('load')
    await page.screenshot({ path: 'screenshots/step_1.png' })
    console.log('STEP_END:1:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:2:Search for Samsung mobiles')
    const searchInput = page.locator('input[role="searchbox"]')
    await searchInput.waitFor({ state: 'visible', timeout: 10000 })
    await searchInput.fill('samsung mobiles')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')
    await page.screenshot({ path: 'screenshots/step_2.png' })
    console.log('STEP_END:2:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:3:Add first item to cart')
    const firstItem = page.locator('.s-main-slot .s-result-item').first()
    await firstItem.waitFor({ state: 'visible', timeout: 10000 })
    await firstItem.click()
    await page.waitForLoadState('load')
    const addToCartButton = page.getByRole('button', { name: /add to cart/i }).first()
    await addToCartButton.waitFor({ state: 'visible', timeout: 10000 })
    await addToCartButton.click()
    await page.waitForLoadState('load')
    await page.screenshot({ path: 'screenshots/step_3.png' })
    console.log('STEP_END:3:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:4:Verify item is added to cart')
    const cartCount = page.locator('#nav-cart-count')
    await cartCount.waitFor({ state: 'visible', timeout: 10000 })
    const itemCount = await cartCount.innerText()
    if (parseInt(itemCount) > 0) {
      console.log('Item successfully added to cart')
    } else {
      throw new Error('Item not added to cart')
    }
    await page.screenshot({ path: 'screenshots/step_4.png' })
    console.log('STEP_END:4:passed')
    await page.waitForTimeout(1000)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  } finally {
    await context.close()
    await browser.close()
  }
}
main()