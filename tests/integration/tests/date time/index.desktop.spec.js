describe('Desktop: Date & time picker', () => {
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

  it('should have the datepicker field in the view', async () => {
    await page.waitForSelector('.date-time-picker', {
      visible: true,
      timeout: 0
    })

    expect(await page.$eval('.date-time-picker .field-label', node => node.innerText))
      .toEqual('Select date & time')
    expect(await page.$eval('.date-time-picker #DateTimePicker-input', node => node.value))
      .toEqual('Sat, Apr 7, 2018 8:26 PM')
    expect(await page.$eval('.date-time-picker .field-clear-button', node => node.innerText))
      .toEqual('✕')
  }, 30000)

  it('should open the datepicker on click', async () => {
    await page.$eval('.date-time-picker #DateTimePicker-input', node => node.click())
    await page.waitForSelector('.date-time-picker .datepicker', {
      visible: true,
      timeout: 0
    }, 30000)
    await page.waitForSelector('.date-time-picker .datepicker .header-picker', {
      visible: true,
      timeout: 0
    }, 30000)

    expect(await page.$eval('.date-time-picker .datepicker .header-picker .header-picker-year', node => node.innerText))
      .toEqual('2018')
    expect(await page.$eval('.date-time-picker .datepicker .header-picker .header-picker-date', node => node.innerText))
      .toEqual('Sat 7 Apr')
  })

  afterAll(async () => {
    await page.close()
  })
})
