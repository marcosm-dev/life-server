import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import User from '../models/user.model.js'

// Función para agregar productos a una orden
async function addProductsToOrder(orderId, productIds) {
  try {
    // Buscar la orden en la base de datos
    const order = await Order.findByPk(orderId)

    // Si no se encuentra la orden, devuelve un error
    if (!order) {
      throw new Error('No se encontró la orden')
    }

    // Buscar los productos en la base de datos utilizando los IDs recibidos
    const products = await Product.findAll({
      where: { id: productIds },
    })

    // Asociar los productos a la orden utilizando el método addProducts
    await order.addProducts(products)

    // Devolver la orden con los productos asociados
    return order
  } catch (error) {
    console.error('Error al agregar productos a la orden:', error)
    throw error
  }
}

async function createOrder(req, res) {
  try {
    // Obtener los datos de la orden y los productos enviados desde el frontend
    // Crear la orden en la base de datos

    const createdOrder = await Order.create({
      amount: parseInt(req.body.amount),
      owner: parseInt(req.body.owner),
    })

    const products = req.body.products.map(el => el.id)

    addProductsToOrder(createdOrder.id, products)

    const populatedOrder = await Order.findOne({
      where: { id: createdOrder.id },
    })

    res.status(201).json(populatedOrder)
  } catch (error) {
    console.error('Error al crear la orden:', error)
    res.status(500).json({ error: 'Ocurrió un error al crear la orden' })
  }
}

async function getOrderWithProductsById(req, res) {
  try {
    // Buscar la orden por su ID y cargar ansiosamente (eager loading) los productos asociados
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price'],
        },
        {
          model: User,
          attributes: ['name', 'phone']
        }
      ], // Carga ansiosa de los productos asociados a la orden
    })

    // Si no se encuentra la orden, devuelve un error
    if (!order) {
      throw new Error('No se encontró la orden')
    }

    // Devolver la orden con los productos asociados
    return res.status(200).json(order)
  } catch (error) {
    console.error('Error al obtener la orden:', error)
    throw error
  }
}

export {
  getOrderWithProductsById,
  createOrder
}