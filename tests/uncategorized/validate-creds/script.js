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
    console.log('STEP_START:1:Navigate to Demoblaze homepage')
    await page.goto('https://www.demoblaze.com/')
    await page.waitForLoadState('load')
    await page.screenshot({ path: 'screenshots/step_1.png' })
    console.log('STEP_END:1:passed')
    await page.waitForTimeout(1000)

    console.log('STEP_START:2:Open login modal')
    const loginButton = page.locator('a[data-target="#logInModal"]')
    await loginButton.waitFor({ state: 'visible', timeout: 10000 })
    await loginButton.click()
    await page.waitForSelector('#logInModal', { state: 'visible', timeout: 10000 })
    await page.screenshot({ path: 'screenshots/step_2.png' })
    console.log('STEP_END:2:passed')
    await page.waitForTimeout(1000)

    const testCases = [
      { username: '', password: '', description: 'Test empty username and password' },
      { username: 'invalidUser', password: 'invalidPass', description: 'Test invalid username and password' },
      { username: 'validUser', password: '', description: 'Test valid username and empty password' },
      { username: '', password: 'validPass', description: 'Test empty username and valid password' },
      { username: 'validUser', password: 'validPass', description: 'Test valid username and password' }
    ]

    for (let i = 0; i < testCases.length; i++) {
      const { username, password, description } = testCases[i]
      console.log(`STEP_START:${i + 3}:${description}`)
      
      const usernameInput = page.locator('#loginusername')
      await usernameInput.fill(username)
      
      const passwordInput = page.locator('#loginpassword')
      await passwordInput.fill(password)
      
      await page.screenshot({ path: `screenshots/step_${i + 3}.png` })
      
      const loginSubmitButton = page.getByRole('button', { name: /log in/i })
      await loginSubmitButton.waitFor({ state: 'visible', timeout: 10000 })
      await loginSubmitButton.click()
      
      await page.waitForTimeout(1000) // Wait for any potential error message to appear
      
      await page.screenshot({ path: `screenshots/step_${i + 3}_result.png` })
      console.log(`STEP_END:${i + 3}:passed`)
      await page.waitForTimeout(1000)
    }
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  } finally {
    await context.close()
    await browser.close()
  }
}
main()