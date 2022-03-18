const router = require(`express`).Router()

const usersModel = require(`../models/users`)
const productsModel = require(`../models/products`)

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer  = require('multer')
const upload = multer({dest: `${process.env.UPLOADED_PROFILE_IMAGE_FOLDER}`})
const emptyFolder = require('empty-folder')

// IMPORTANT
// Obviously, in a production release, you should never have the code below, as it allows a user to delete a database collection
// The code below is for development testing purposes only
router.post(`/users/reset_user_collection`, (req,res) =>
{
    usersModel.deleteMany({}, (error, data) =>
    {
        if(data)
        {
            const adminPassword = `123!"£`
            bcrypt.hash(adminPassword, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>
            {
                usersModel.create({name:"Administrator",email:"admin@admin.com",password:hash,accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)}, (createError, createData) =>
                {
                    if(createData)
                    {
                        emptyFolder(process.env.UPLOADED_PROFILE_IMAGE_FOLDER, false, (result) =>
                        {
                            // the folder was successfully emptied

                            res.json(createData)
                        })
                        emptyFolder(process.env.UPLOADED_PRODUCT_IMAGE_FOLDER, false, (result) =>
                        {
                            // the folder was successfully emptied
                        })

                    }
                    else
                    {
                        res.json({errorMessage:`Failed to create Admin user for testing purposes`})
                    }
                })
            })
        }
        else
        {
            res.json({errorMessage:`User is not logged in`})
        }
    })
})

router.get(`/users`, (req, res) =>
{
    usersModel.find((error, data) =>
    {
        res.json(data)
    })
})
router.get(`/users/:id`,(req,res) =>
{
    usersModel.findById(req.params.id,(error, data) =>
    {
        res.json(data)
    })
})
router.post(`/users/register/:name/:email/:password`, upload.single("profilePhoto"),(req,res) => {
    if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg") {
        fs.unlink(`${process.env.UPLOADED_PROFILE_IMAGE_FOLDER}/${req.file.filename}`, (error) => {
            res.json({errorMessage: `Only .png, .jpg and .jpeg format accepted`})
        })
    }
    else if (req.file.size >= 1000000)
    {
        fs.unlink(`${process.env.UPLOADED_PROFILE_IMAGE_FOLDER}/${req.file.filename}`, (error) => {
            res.json({errorMessage: `File Size must be less than 1000000`})
        })
    }
    else // uploaded file is valid
    {

        // If a user with this email does not already exist, then create new user
        usersModel.findOne({email: req.params.email}, (uniqueError, uniqueData) => {
            if(uniqueData)
            {
                res.json({errorMessage:`User already exists`})
            }
            else
            {
                bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>
                {

                    usersModel.create({name:req.params.name, email:req.params.email, password:hash, profilePhotoFilename:req.file.filename}, (error, data) =>
                    {
                        if(data)
                        {
                            const token = jwt.sign({id: data.id, email: data.email, accessLevel:data.accessLevel}, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn:process.env.JWT_EXPIRY})

                            fs.readFile(`${process.env.UPLOADED_PROFILE_IMAGE_FOLDER}/${req.file.filename}`, 'base64', (err, fileData) =>
                            {

                                    res.json({
                                        name: data.name,
                                        accessLevel: data.accessLevel,
                                        profilePhoto: fileData,
                                        token: token


                            })})
                        }
                        else
                        {
                            res.json({errorMessage:`User was not registered`})
                        }
                    })
                })
            }


        })
    }
})

router.post(`/users/login/:email/:password`, (req,res) =>
{
    usersModel.findOne({email:req.params.email}, (error, data) =>
    {
        if(data)
        {
            bcrypt.compare(req.params.password, data.password, (err, result) =>
            {
                if(result)
                {
                    const token = jwt.sign({id: data.id,email:data.email, accessLevel:data.accessLevel}, JWT_PRIVATE_KEY, {algorithm:'HS256', expiresIn:process.env.JWT_EXPIRY})

                    res.json({name: data.name, email: data.email, accessLevel:data.accessLevel, token:token})
                }
                else
                {
                    res.json({errorMessage:`User is not logged in`})
                }
            })
        }
        else
        {
            console.log("not found in db")
            res.json({errorMessage:`User is not logged in`})
        }
    })
})

router.post(`/users/:id/cart/:_id`,(req,res) =>
    productsModel.findById(req.params._id, (error, data) =>
    {
            usersModel.findByIdAndUpdate(req.params.id, {$push: {cart: data} }, (error, data) => {
                if (data) {
                    res.json({
                        cart: data
                    })
                } else {
                    console.log("Error")
                }
            })
    })
)
router.delete(`/users/:id/cart/:_id`,(req,res) =>
           usersModel.findById(req.params.id, (error, data) => {
            if (data) {
                for(let i = 0; i < data.cart.length; i++)
                {
                    if(data.cart[i]._id.equals(req.params._id))
                    {
                        data.cart.splice(i,1 );
                        usersModel.findByIdAndUpdate(req.params.id,  {cart: data.cart}, (error, data) => {
                            res.json({cart:data})
                        })
                    }
                }
            } else {
                console.log("Error")
            }
    })
)
router.delete(`/users/:id`, (req, res) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err)
        {
            res.json({errorMessage:`User is non existent`})
        }
        else
        {
            if(decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
            {
                usersModel.findByIdAndRemove(req.params.id, (error, data) =>
                {
                    res.json(data)
                })
            }
            else
            {
                res.json({errorMessage:`User is not an administrator, so they cannot delete users`})
            }
        }
    })
})


const logout = (req, res) =>
{
    res.json({})
}

router.post(`/users/logout`, logout)


module.exports = router