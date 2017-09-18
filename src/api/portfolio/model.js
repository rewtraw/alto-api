import mongoose, {
  Schema
} from 'mongoose'

const coinsSchema = new Schema({
  _id: false,
  symbol: String,
  amount: Number
})

const portfolioSchema = new Schema({
  name: String,
  coins: [coinsSchema]
}, {
  timestamps: true
})

module.exports = mongoose.model('Portfolio', portfolioSchema)
