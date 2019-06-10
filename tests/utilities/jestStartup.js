const ws = require('local-web-server');

module.exports = () => {
  // define the local-web-server
  const localWebServer = new ws();

  // @ts-ignore
  process.server = localWebServer.listen({
    port: 11111,
    // @ts-ignore
    http2: true,
    directory: './',
    compress: true,
  });
};
