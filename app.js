import express from 'express'
import connectToDb from './db'
import orderRouter from './routes/order'
import productRouter from './routes/product'
import addressRouter from './routes/address'
import authRouter from './routes/auth'
import notFoundMiddleware from './middleware/notFound'
import compression from 'compression'

// security packages
import helmet from 'helmet'
import cors from 'cors'
import xss from 'xss-clean'

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()

app.use(helmet())
app.use(cors())
app.use(xss())

app.use(compression())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      '<h1>Welcome to upGrad Eshop App!!!</h1><a href="/api-docs">API Documentation</a>'
    )
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// routes
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/addresses', addressRouter)
app.use('/api/v1', authRouter)

app.use(notFoundMiddleware)

Promise.all([connectToDb()])
  .then(() =>
    app.listen(port, () => console.log(`Eshop App is working on port ${port}`))
  )
  .catch((error) => {
    console.error(`MongoDB Atlas Error: ${error}`)
    process.exit()
  })
