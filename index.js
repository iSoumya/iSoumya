require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
//const puppeteerService = require('./services/puppeteer');
const cheerioService = require('./services/cheerio.service');

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  last_update: new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Asia/Kolkata',
  }),
};

async function setInstagramPosts() {
  const instagramImages = await cheerioService.getLastThreePostsFromInstagramById('isoumyamahata', 3);
  DATA.img1 = instagramImages[0];
  DATA.img2 = instagramImages[1];
  DATA.img3 = instagramImages[2];
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Get pictures
   */
  await setInstagramPosts();

  /**
   * Generate README
   */
  await generateReadMe();

  /**
   * Close puppeteerService
   */
 // await puppeteerService.close();
}

action();