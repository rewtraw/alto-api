var utils = require('../utils')

module.exports = (function () {
  'use strict'

  var api = require('express').Router()

  const portfolio = require('./controller')

  api.get('/portfolios', utils.errorHandler(async(req, res, next) => {
    const obj = await portfolio.list(req.params)
    res.json(obj)
  }))
  api.post('/portfolios', utils.errorHandler(async(req, res, next) => {
    const obj = await portfolio.create(req.params, req.body)
    res.json(obj)
  }))
  api.get('/portfolios/:key', utils.errorHandler(async(req, res, next) => {
    const obj = await portfolio.read(req.params)
    res.json(obj)
  }))
  api.put('/portfolios/:key', utils.errorHandler(async(req, res, next) => {
    const obj = await portfolio.update(req.params, req.body)
    res.json(obj)
  }))
  api.get('/portfolios/:key/value', utils.errorHandler(async(req, res, next) => {
    const obj = await portfolio.value24(req.params)
    res.json(obj)
  }))

  return api
})()
