const router = require(`express`).Router()

const productsModel = require(`../models/products`)

const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const multer  = require('multer')
var upload = multer({dest: `${process.env.UPLOADED_PRODUCT_IMAGE_FOLDER}`})


const verifyUsersJWTPassword = (req, res, next) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err)
        {
            res.json({errorMessage:`User is not logged in`})
        }
        else
        {
            req.decodedToken = decodedToken
            next()
        }
    })
}
const checkAdministrator = (req,res,next) =>
{
    if(req.decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
    {
            next()
    }
    else
    {
        res.json({errorMessage:`User is not an administrator, so they cannot add new records`})
    }
}
const getProducts = (req,res) =>
{
    productsModel.find((error, data) =>
    {
        res.json(data)
    })
}
const getProductDocument = (req,res) =>
{
    productsModel.findById(req.params.id, (error, data) =>
    {
        res.json(data)
    })
}
const validation = (req,res,next) => {

    if (!/^[a-zA-Z- '0-9]+$/.test(req.body.productName)) {
        res.json({errorMessage: `Product Name must be a string`});
    } else if (!/^[a-zA-Z- 0-9]+$/.test(req.body.size)) {
        res.json({errorMessage: `Size must be a string`});
    } else if (!/^[a-zA-Z- ]+$/.test(req.body.color)) {
        res.json({errorMessage: `Colour must be a string`});
    } else if (!(req.body.stockLevel >= 0 && req.body.stockLevel <= 100)) {
        res.json({errorMessage: `Stock Level must be between 0 and 100`});
    } else if (!(req.body.price >= 0 && req.body.price <= 1000)) {
        res.json({errorMessage: `Price must be greater than zero or less than 1000`});
    } else // input is valid
    {
        next();
    }
}
const addProduct = (req,res) =>
{

    let productDetails = new Object()

    productDetails.productName = req.body.productName
    productDetails.size = req.body.size
    productDetails.color = req.body.color
    productDetails.stockLevel = req.body.stockLevel
    productDetails.price = req.body.price

    productDetails.productImages = []

    req.files.map((file, index) =>
    {productDetails.productImages[index] = {filename:`${file.filename}`}
    })
    productsModel.create(productDetails, (error, data) =>
    {
        res.json(data)
    })
}
const editProductDocument = (req,res) =>
{
    let productDetails = new Object()

    productDetails.productName = req.body.productName
    productDetails.size = req.body.size
    productDetails.color = req.body.color
    productDetails.stockLevel = req.body.stockLevel
    productDetails.price = req.body.price

    productDetails.productImages = []

    req.files.map((file, index) =>
    {productDetails.productImages[index] = {filename:`${file.filename}`}
    })


    productsModel.findByIdAndUpdate(req.params.id, {$set: productDetails}, (error, data) =>
    {
        res.json(data)
    })

}
const deleteProductDocument = (req,res) =>
{
    productsModel.findByIdAndRemove(req.params.id, (error, data) =>
    {
        res.json(data)
    })
}
const uploadImages = (req,res) =>
{
    upload.array("productPhotos", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED))
}
router.get(`/products`, getProducts)
router.get(`/products/:id`, verifyUsersJWTPassword, getProductDocument)
router.get(`/product/photo/:filename`, (req, res) =>
{
    fs.readFile(`${process.env.UPLOADED_PRODUCT_IMAGE_FOLDER}/${req.params.filename}`, 'base64', (err, fileData) =>
    {
        if(fileData)
        {
            res.json({image:fileData})
        }
        else
        {
            res.json({image:null})
        }
    })
})

router.post(`/products`, verifyUsersJWTPassword, checkAdministrator, upload.array("productImages", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), validation, addProduct)
router.put(`/products/:id`, verifyUsersJWTPassword, checkAdministrator, upload.array("productImages", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), validation, editProductDocument)
router.delete(`/products/:id`, verifyUsersJWTPassword, checkAdministrator, deleteProductDocument)
module.exports = router