import { ProductModel } from '../../products/models/Product.js'

export async function productsVerify(): Promise<void> {
  try {
    const updatedProducts = await ProductModel.find()
    // // Guardar solo si hay cambios en las tiendas
    // if (shops.length > 0) {
    //   await Shop.bulkWrite(
    //     shops.map(shop => ({
    //       updateOne: {
    //         filter: { _id: shop._id },
    //         update: { id_invoice: id },
    //       },
    //     }))
    //   )
    // }

    const updated = await ProductModel.bulkWrite(updatedProducts.map(product => ({
      updateOne: {
        filter: { _id: product._id },
        update: { enable: true },
      },
    })))

    console.log('updated: ', updated)
  } catch (error) {
    throw new Error(`No se han podido actualizar los productos: ${error}`)
  }
}
