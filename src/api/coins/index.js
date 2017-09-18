var utils = require('../utils')

module.exports = (function () {
  'use strict'

  var api = require('express').Router()

  const coin = require('./controller')

  api.get('/coins/:symbol/price', utils.errorHandler(async(req, res, next) => {
    const obj = await coin.price(req.params.symbol, req.query)
    res.json(obj)
  }))
  api.get('/coins/:symbol/history', utils.errorHandler(async(req, res, next) => {
    const obj = await coin.priceHour(req.params.symbol, req.query)
    res.json(obj)
  }))

  return api
})()
