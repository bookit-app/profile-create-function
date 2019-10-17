'use strict';

const { isEmpty } = require('../../../../node_modules/lodash');

module.exports = (req, res, next) => {
  if (!(isEmpty(req.query) || isEmpty(req.query))) {
    req.profileQueryOptions = {
      select: req.query.select.toLowerCase()
    };
  }

  next();
};
