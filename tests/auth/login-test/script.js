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
    console.log('STEP_START:1:Navigate to login page')
    await page.goto('https://the-internet.herokuapp.com/login')
    await page.waitForLoadState('load')
    await page.screenshot({ path: 'screenshots/step_1.png' })
    console.log('STEP_END:1:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:2:Enter username wronguser')
    const usernameInput = page.getByLabel('Username')
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 })
    await usernameInput.fill('wronguser')
    await page.screenshot({ path: 'screenshots/step_2.png' })
    console.log('STEP_END:2:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:3:Enter password wrongpassword')
    const passwordInput = page.getByLabel('Password')
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 })
    await passwordInput.fill('wrongpassword')
    await page.screenshot({ path: 'screenshots/step_3.png' })
    console.log('STEP_END:3:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:4:Click login')
    const loginButton = page.getByRole('button', { name: /login/i })
    await loginButton.waitFor({ state: 'visible', timeout: 10000 })
    await loginButton.click()
    await page.waitForLoadState('load')
    await page.screenshot({ path: 'screenshots/step_4.png' })
    console.log('STEP_END:4:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:5:Verify Failure login message appears')
    const errorMessage = page.getByText(/your username is invalid/i)
    await errorMessage.waitFor({ state: 'visible', timeout: 10000 })
    await page.screenshot({ path: 'screenshots/step_5.png' })
    console.log('STEP_END:5:passed')
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