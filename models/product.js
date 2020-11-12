  
/**
 * imports
 */
const mongoose = require('mongoose')
const Shema  = mongoose.Schema

/**
 * model shema
 */
const ProductShema = Shema({
    dias: { type: Number, default: 0 },
    destino: String,
    precio: { type: Number, default: 0 },
    ofertas: String
})

/**
 * export the model
 */
module.exports = mongoose.model('Product', ProductShema)