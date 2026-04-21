const { join } = require('path');

/**
 * Keep Puppeteer's downloaded browser inside the project so Render's
 * install step and runtime resolve the same cache directory.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer')
};
