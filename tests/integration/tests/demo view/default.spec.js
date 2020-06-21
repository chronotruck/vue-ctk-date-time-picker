describe('Demo view', () => {
  let page

  beforeAll(async () => {
    page = await __BROWSER__.newPage()
    await page.setViewport({
      width: 1280,
      height: 720
    })
    await page.goto(
      'http://app:8080/'
    )
    await page.waitForSelector('.ctk-date-time-picker', {
      visible: true,
      timeout: 0
    })
  }, 30000)

  it('should have a demo page', async () => {
    expect(await page.$eval('.ctk-date-time-picker h1', node => node.innerText))
      .toEqual('CtkDatetimePicker')
    expect(await page.$eval('.ctk-date-time-picker h3', node => node.innerText))
      .toEqual('A VueJs component for select date & time')
  }, 30000)

  afterAll(async () => {
    await page.close()
  })
})
