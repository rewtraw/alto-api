import mongoose, {
  Schema
} from 'mongoose'

const coinsSchema = new Schema({
  symbol: String,
  value_usd: Number
}, {
  timestamps: true
})

module.exports = mongoose.model('Coins', coinsSchema)
