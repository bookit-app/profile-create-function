'use strict';

const { Logging } = require('@google-cloud/logging');
const logger = new Logging();

function getEntry(log, message) {
  return log.entry({ resource: { type: 'cloud_run_revision' } }, message);
}

module.exports.info = (logName, message) => {
  const log = logger.log(logName);
  return log.info(getEntry(log, message));
};

module.exports.error = (logName, message) => {
  const log = logger.log(logName);
  return log.error(getEntry(log, message));
};
