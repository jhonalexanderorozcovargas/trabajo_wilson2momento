/**
 * server express
 * forma siete
 * gestionar rutas de los verbos
 * GET, POST, PUT, PATCH, DELETE con Router
 */

let express = require('express')
let bodyParser = require('body-parser')  //cuando hagamos peticiones (http rest), poder parsear el cuerpo de la peticion, con el fin de poderlos tratar en node.js
const mongoose = require('mongoose')  //api acceda a la DB con el metodo de conexion

/**
* product
* import the shema
*/
const Product = require('./models/product')

/**
 * inicialiar express
 */
let app = express()
const port = process.env.PORT || 3000

/**
 * middlewares
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


/**
 * API
 */
//post
app.post('/api/product', (req, res) => {
    
    /**use shema and register product in the data base*/
    console.log('POST /api/product')
    console.log(req.body)

    let product = new Product()    
    product.dias = req.body.dias    
    product.destino = req.body.destino
    product.precio = req.body.precio
    product.ofertas= req.body.ofertas

    product.save( (err, productStored) => {
        if (err) res.status(500).send({message: `save error: ${err}`})

        res.status(200).send({product: productStored})
    } )
})


//get users
app.get('/api/products', (req, res) => {
    //res.send(200, {products: []})

    Product.find({}, (err, products) => {
        if (err) return res.status(500).send({
            message: `Error when requesting: ${err}`
        })

        if (!products) return res.status(404).send({
            message: 'There are no product'
        })

        res.status(200).send({ products })

    })

})

//get one 
app.get('/api/product/:productId', (req, res) => {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({
            message: `Error when requesting: ${err}`
        })
        
        if (!product) return res.status(404).send({
            message: 'Product does not exist'
        })

        res.status(200).send({ product })
    })
})

//put
app.put('/api/product/:productId', (req, res) => {
    let productId = req.params.productId
    let updateData = req.body

    Product.findByIdAndUpdate(productId, updateData, (err, productUpdated) => {
        if (err) return res.status(500).send({
            message: `Failed to update data: ${err}`
        })

        res.status(200).send({ product: productUpdated })
    })

})

//delete
app.delete('/api/product/:productId', (req, res) => {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({
            message: `Error deleting: ${err}`
        })
        
        if (!product) return res.status(404).send({
            message: 'Product does not exist'
        })

        product.remove(err => {
            if (err) return res.status(500).send({
                message: `Error deleting: ${err}`
            })

            res.status(200).send({
                message: 'Product removed'
            })
        })
    })

})


/**
 * Conexion desde la api hacia mongodb
 */
mongoose.connect('mongodb://localhost:27017/shopwcg', (err, res) => {    

    if (err) throw err    
    console.log('Database connection ok')

    const server = app.listen( port, () => {

        console.log( `Listening http://localhost:${ server.address().port }` )
    
    } )
})