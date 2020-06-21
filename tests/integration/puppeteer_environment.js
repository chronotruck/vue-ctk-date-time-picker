const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer-core')

class PuppeteerEnvironment extends NodeEnvironment {
  async setup () {
    // eslint-disable-next-line
    console.log('Set-up puppeteer environment')

    await super.setup()
    this.global.__BROWSER__ = await puppeteer.connect({ browserWSEndpoint: 'ws://chrome:3000' })
    this.global.__BROWSER__.on('disconnected', () => {
      // eslint-disable-next-line
      console.log('Browser disconnected.')
    })
  }

  async teardown () {
    // eslint-disable-next-line
    console.log('Teardown called.')
    this.global.__BROWSER__.close()
    await super.teardown()
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = PuppeteerEnvironment
