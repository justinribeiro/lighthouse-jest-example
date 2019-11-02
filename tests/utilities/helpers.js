'use strict';

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const homedir = require('os').homedir();

// via WebPageTest settings
// WPO-Foundation/webpagetest/blob/master/www/settings/connectivity.ini.sample
//
// These are divided by 8 because we need bytes/s for Chrome
//
const NETWORK = {
  edge: {
    offline: false,
    latency: 840,
    downloadThroughput: Math.floor(240000 / 8),
    uploadThroughput: Math.floor(240000 / 8),
  },
  twog: {
    offline: false,
    latency: 800,
    downloadThroughput: Math.floor(280000 / 8),
    uploadThroughput: Math.floor(256000 / 8),
  },
  threegslow: {
    offline: false,
    latency: 400,
    downloadThroughput: Math.floor(400000 / 8),
    uploadThroughput: Math.floor(400000 / 8),
  },
  threeg: {
    offline: false,
    latency: 300,
    downloadThroughput: Math.floor(1600000 / 8),
    uploadThroughput: Math.floor(768000 / 8),
  },
  threegfast: {
    offline: false,
    latency: 170,
    downloadThroughput: Math.floor(1600000 / 8),
    uploadThroughput: Math.floor(768000 / 8),
  },
  fourg: {
    offline: false,
    latency: 170,
    downloadThroughput: Math.floor(9000000 / 8),
    uploadThroughput: Math.floor(9000000 / 8),
  },
  lte: {
    offline: false,
    latency: 70,
    downloadThroughput: Math.floor(12000000 / 8),
    uploadThroughput: Math.floor(12000000 / 8),
  },
};

/**
 * launch Chrome via Puppeteer, use puppeteer to throttle connection, run
 * lighthouse. Not ideal; would prefer adv throttle via comcast os level util
 * @param {string} url
 * @param {object} opts
 * @param {object} config
 * @return {promise}
 */
async function launchChromeAndRunLighthouse(url, opts, config) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-gpu'],
  });

  browser.on('targetchanged', async (target) => {
    const page = await target.page();

    if (page && page.target().url() === url) {
      await page.target().createCDPSession()
        .then(client => {
          return client.send('Network.emulateNetworkConditions',
            NETWORK[opts.connection]);
        })
        .catch(err => console.error(err));

      console.log(`CDP: network conditions set to WPT ${opts.connection} profile`);
    }
  });

  opts.port = (new URL(browser.wsEndpoint())).port;
  return lighthouse(url, opts, config).then(results => {
    return browser.close().then(() => results);
  }).catch(err => {
    return browser.close().then(() => {
      throw err;
    }, console.error);
  });
}

module.exports = {
  launchChromeAndRunLighthouse: launchChromeAndRunLighthouse,
  homedir: homedir,
};

