const cc = require('cryptocompare')
import fetch from 'isomorphic-fetch'
const MARKET = 'USD'

module.exports = {
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
  }
}
