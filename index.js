const { response, request } = require('express')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3001
const app = express()

app.use(express.json())
app.use(cors())

const orders = []

const checkOrderId = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({message: "Pedido não existe"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkRoute = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(method, url)

    next()
}

app.post('/order', checkRoute, (request, response) => {
    const {order, clientName, price} = request.body

    const  newOrder = {id: uuid.v4(), order, clientName, price, status: "Em preparação"}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get('/order', checkRoute, (request, response) => {
    return response.json(orders)
})

app.put('/order/:id', checkRoute, checkOrderId, (request, response) => {
    const {order, clientName, price} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status: "Em preparação"}

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/order/:id', checkRoute, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkRoute, checkOrderId, (request, response) => {
    const index = request.orderIndex

    return response.json(orders[index])
})

app.patch('/order/:id', checkRoute, checkOrderId, (request, response) => {
    const index = request.orderIndex

    const updatedOrderStatus = ("Pronto")

    orders[index].status = updatedOrderStatus

    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`🚀 Server Started on port ${port}`)
})