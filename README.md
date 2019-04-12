# lighthouse-jest-example
> Using lighthouse and puppeteer with jest to run tests on your project/site.

Basic example that gathers performance metrics via [Lighthouse](https://github.com/GoogleChrome/lighthouse) and tests results with [Jest](https://jestjs.io/). Uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) to start up come with Chrome with [network emulation settings defined by WebPageTest](https://github.com/WPO-Foundation/webpagetest/blob/master/www/settings/connectivity.ini.sample).

![image](https://user-images.githubusercontent.com/643503/56050862-d451ec80-5d01-11e9-94df-04af4aaedf9e.png)

## The basics

```bash
$ git clone git@github.com:justinribeiro/lighthouse-jest-example.git
$ cd lighthouse-jest-example
$ yarn
```

## If you want to test a local site

Within `utilities/jestStartup.js`, I start a local web server to test a local site. If you're testing on remotes or in more realistic envs, you can remove this startup.

If you want to test locally with that server however, you'll need to install the basic cert to get around invalid cert errors. There are two yarn commands for this purpose:

```javascript
// package.json / scripts
"ws:trustcert:linux": "certutil -d sql:$HOME/.pki/nssdb -A -t \"P,,\" -n ./node_modules/lws/ssl/lws-cert.pem -i ./node_modules/lws/ssl/lws-cert.pem",
"ws:removecert:linux": "certutil -D -d sql:$HOME/.pki/nssdb -n -devcert"
```

As you see, you'll need certutil for you OS. I have not tested this on Windows or OS X, but if you have a command that works, PR's welcome.

## Just let me test a site

Each test within `test/performance` folder has it's own url you define. Yes, you could make this global to all tests if you like, but for this example, I was testing site variations so it's a little separated out.

From there, you just run the tests:

```bash
$ yarn test:lighthouse
# jest output here
```

## What if I don't want to use Puppeteer and those network settings?

You can use [chrome-launcher](https://github.com/GoogleChrome/chrome-launcher) within that method instead.

## Is that going to give me a perfect result with that network emulation?

No. You should always measure on actual devices and connections if possible. I prefer the [comcast go package](https://github.com/tylertreat/comcast) personally.

Please see the [Advanced Throttling guide](https://github.com/GoogleChrome/lighthouse/blob/master/docs/throttling.md) in the Lighthouse repo.