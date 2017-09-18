var Portfolio = require('./model')
const coin = require('../coins/controller')

module.exports = {
  list: async(params) => {
    try {
      var portfolios = await Portfolio.find()
      return portfolios
    } catch (error) {
      throw new Error(error)
    }
  },
  read: async(params) => {
    try {
      var portfolio = await Portfolio.findById(params.key)
      portfolio.plot = portfolio.plot.slice(-58)
      return portfolio
    } catch (error) {
      throw new Error(error)
    }
  },
  create: async(params, body) => {
    try {
      var portfolio = new Portfolio(body)
      var saved = await portfolio.save()
      return saved
    } catch (error) {
      throw new Error(error)
    }
  },
  update: async(params, body) => {
    try {
      var saved = await Portfolio.findByIdAndUpdate({
        '_id': params.key
      }, body)
      return saved
    } catch (error) {
      throw new Error(error)
    }
  },
  value: async(params) => {
    try {
      var holdings = []
      var totalValue = 0
      var portfolio = await Portfolio.findById(params.key)
      for (var i = 0; i < portfolio.coins.length; i++) {
        var token = portfolio.coins[i]
        var price = await coin.price(token.symbol)
        if (!price) {
          price = 0
        }
        holdings.push({
          'symbol': token.symbol,
          'price': price,
          'amount': token.amount,
          'value': price * token.amount
        })
        totalValue += price * token.amount
      }
      portfolio.holdings = holdings
      return {
        coins: holdings,
        total: totalValue
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  value24: async(params) => {
    try {
      var tokens = []
      var totalCostUsd = 0
      var totalValue = 0
      var totalValue24 = 0
      var portfolio = await Portfolio.findById(params.key)
      for (let i = 0; i < portfolio.coins.length; i++) {
        let token = portfolio.coins[i]
        tokens.push(token.symbol)
      }
      var prices = await coin.priceFull(tokens)
      for (let i = 0; i < portfolio.coins.length; i++) {
        let token = portfolio.coins[i]
        if (prices[token.symbol]) {
          totalValue24 += (token.amount * prices[token.symbol]['USD'].OPEN24HOUR)
          totalValue += (token.amount * prices[token.symbol]['USD'].PRICE)
          totalCostUsd += (token.amount * token.cost_usd)
          token.price = prices[token.symbol]['USD'].PRICE
          token.change24 = prices[token.symbol]['USD'].CHANGE24HOUR
          token.change24Pct = prices[token.symbol]['USD'].CHANGEPCT24HOUR
          token.total_cost_usd = (token.amount * token.cost_usd)
          token.value = (token.amount * prices[token.symbol]['USD'].PRICE)
          token.profit_usd = (token.amount * prices[token.symbol]['USD'].PRICE) - (token.amount * token.cost_usd)
        }
      }
      console.log('totalCostUsd: ', totalCostUsd)
      portfolio.total = {
        cost_usd: totalCostUsd,
        current: totalValue,
        yesterday: totalValue24,
        change: (totalValue - totalValue24)
      }
      if (totalValue > 0) {
        portfolio.plot.push(totalValue)
      }

      var saved = await portfolio.save()
      saved.plot = saved.plot.slice(-58)
      return saved
    } catch (error) {
      throw new Error(error)
    }
  }

}
