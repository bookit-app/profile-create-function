'use strict';

module.exports.extractTraceIdFromHeader = req => {
  const traceHeader = req.header('X-Cloud-Trace-Context');
  const [trace] = traceHeader.split('/');
  return trace;
};
