const router = require(`express`).Router()

const salesModel = require(`../models/sales`)
const productsModel = require(`../models/products`)


const createNewSaleDocument = (req, res, next) =>
{
    let saleDetails = new Object()

    saleDetails.paypalPaymentID = req.params.paymentID
    saleDetails.productID = req.params.productID
    saleDetails.price = req.params.price
    saleDetails.customerName = req.params.customerName
    saleDetails.customerEmail = req.params.customerEmail


    productsModel.findById({_id:req.params.productID}, (err, data) =>
    {
        if(err)
        {
            return next(err)
        }
        else
        {
            if(req.params.stockLevel <= 1)
            {
                productsModel.findByIdAndUpdate({_id:req.params.productID}, {sold: true}, (err, data) =>
                {
                    if(err)
                    {
                        return next(err)
                    }
                })
            }
            else
            {
                console.log(data)
                productsModel.findByIdAndUpdate({_id:req.params.productID}, {stockLevel: (data.stockLevel - 1)  }, (err, data) =>
                {
                    if(err)
                    {
                        console.log(err)
                        return next(err)
                    }
                })
            }

        }
    })

    salesModel.create(saleDetails, (err, data) =>
    {
        if(err)
        {
            return next(err)
        }
    })

    return res.json({success:true})
}

const getSalesDocuments = (req, res) => {

    salesModel.find({customerEmail:req.params.customerEmail}, (err, data) =>
    {
        res.json(data)
    })

}

router.post('/sales/:paymentID/:productID/:price/:customerName/:customerEmail', createNewSaleDocument)

router.get(`/sales/:customerEmail`, getSalesDocuments)

module.exports = router