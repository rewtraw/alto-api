import mongoose, {
  Schema
} from 'mongoose'

const coinsSchema = new Schema({
  _id: false,
  symbol: String,
  amount: {
    type: Number,
    default: 0
  },
  total_cost_usd: {
    type: Number,
    default: 0
  },
  cost_usd: {
    type: Number,
    default: 0
  },
  cost_eth: {
    type: Number,
    default: 0
  },
  cost_btc: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  change24: {
    type: Number,
    default: 0
  },
  change24Pct: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  profit_usd: {
    type: Number,
    default: 0
  }
})

const portfolioSchema = new Schema({
  name: String,
  coins: [coinsSchema],
  total: {},
  plot: []
}, {
  timestamps: true
})

module.exports = mongoose.model('Portfolio', portfolioSchema)
