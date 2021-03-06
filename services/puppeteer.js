const puppeteer = require('puppeteer');
class PuppeteerService {
  browser;
  page;

  async init() {
    this.browser = await puppeteer.launch({
                                              headless: false,
                                              slowMo: 80,
                                              args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=800,600']
                                              });
  }

  /**
   *
   * @param {string} url
   */
  async goToPage(url) {
    if (!this.browser) {
      await this.init();
    }
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US',
    });

    await this.page.goto(url, {
      waitUntil: `networkidle0`,
    });
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }

  /**
   *
   * @param {string} acc Account to crawl
   * @param {number} n Qty of image to fetch
   */
  async getLastThreePostsFromInstagramById(acc, n) {
    const page = `https://www.picuki.com/profile/${acc}`;
    await this.goToPage(page);

    let previousHeight;

    try {
      previousHeight = await this.page.evaluate(`document.body.scrollHeight`);
      await this.page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
      await this.page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await this.page.waitFor(1000);

      const nodes = await this.page.evaluate(() => {
        const images = document.querySelectorAll(`.post-image`);
        return [].map.call(images, img => img.src);
      });

      return nodes.slice(0, 3);
    } catch (error) {
      console.log('Error', error);
      process.exit();
    }
  }
}

const puppeteerService = new PuppeteerService();

module.exports = puppeteerService;