const mongoose = require(`mongoose`)

let productPhotosSchema = new mongoose.Schema(
    {
        filename:{type:String}
    })

let productsSchema = new mongoose.Schema(
   {
        productName: {type: String, required: true},
        size: {type: String},
        color: {type: String},
        stockLevel: {type: Number, required: true},
        price: {type: Number, required: true},
        productImages: [productPhotosSchema],
       sold: {type: Boolean, default:false}
   },
   {
       collection: `products`
   })

module.exports = mongoose.model(`products`, productsSchema)