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
      var holdings = []
      var tokens = []
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
          holdings.push({
            'symbol': token.symbol,
            'price': prices[token.symbol]['USD'].PRICE,
            'amount': token.amount,
            'change24': prices[token.symbol]['USD'].CHANGE24HOUR,
            'change24Pct': prices[token.symbol]['USD'].CHANGEPCT24HOUR,
            'value': (token.amount * prices[token.symbol]['USD'].PRICE)
          })
        } else {
          holdings.push({
            'symbol': token.symbol,
            'price': 0,
            'amount': token.amount,
            'change24': 0,
            'change24Pct': 0,
            'value': 0
          })
        }
      }
      portfolio.holdings = holdings
      return {
        portfolio: portfolio,
        coins: holdings,
        total: {
          current: totalValue,
          yesterday: totalValue24,
          change: (totalValue - totalValue24)
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

}
