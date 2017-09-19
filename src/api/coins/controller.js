const cc = require('cryptocompare')
const request = require('request-promise')
import fetch from 'isomorphic-fetch'
const MARKET = 'USD'
var Coin = require('./model')

module.exports = {
  list: async(params) => {
    try {
      var coins = await Coin.find()
      return coins
    } catch (error) {
      throw new Error(error)
    }
  },
  read: async(params) => {
    try {
      var coin = await Coin.findById(params.key)
      return coin
    } catch (error) {
      throw new Error(error)
    }
  },
  create: async(params, body) => {
    try {
      var coin = new Coin(body)
      var saved = await coin.save()
      return saved
    } catch (error) {
      throw new Error(error)
    }
  },
  update: async(params, body) => {
    try {
      var saved = await Coin.findByIdAndUpdate({
        '_id': params.key
      }, body)
      return saved
    } catch (error) {
      throw new Error(error)
    }
  },
  price: async(symbol, query) => {
    try {
      var market = MARKET
      if (query) {
        market = query.market || MARKET
      }
      var price = await cc.price(symbol.toUpperCase(), market).catch(function () {
        return 0.00
      })
      return price[market]
    } catch (error) {
      throw new Error(error)
    }
  },
  priceDay: async(symbol, query) => {
    try {
      var market = MARKET
      if (query) {
        market = query.market || MARKET
      }
      var price = await cc.histoDay(symbol.toUpperCase(), market).catch(function () {
        return 0.00
      })
      console.log('price: ', price)
      return price[market]
    } catch (error) {
      throw new Error(error)
    }
  },
  priceHour: async(symbol, query) => {
    try {
      var market = MARKET
      if (query) {
        market = query.market || MARKET
      }
      var price = await cc.histoHour(symbol.toUpperCase(), market).catch(function () {
        return 0.00
      })
      console.log('price: ', price)
      return price[market]
    } catch (error) {
      throw new Error(error)
    }
  },
  priceFull: async(symbols, query) => {
    try {
      var market = MARKET
      if (query) {
        market = query.market || MARKET
      }
      var prices = await cc.priceFull(symbols, market).catch(function () {
        return 0.00
      })
      return prices
    } catch (error) {
      throw new Error(error)
    }
  },
  marketCap: async() => {
    try {
      var options = {
        timeout: 10000,
        noDelay: true,
        keepAliveDelay: 1000,
        url: 'https://api.coinmarketcap.com/v1/global/',
        headers: {
          'cache-control': 'no-cache',
          'Accept': 'application/json'
        }
      }
      var response = await request(options)
      var data = JSON.parse(response)

      return data
    } catch (error) {
      throw new Error(error)
    }
  }
}
