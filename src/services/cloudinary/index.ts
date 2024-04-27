import * as cloudinary from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
export async function uploadFilesToCloudinary(
  folderPath: string
): Promise<void> {
  try {
    const files = await fs.promises.readdir(folderPath)
    files.shift()

    for (const file of files) {
      const filePath = path.join(folderPath, file)

      // Sube el archivo a Cloudinary
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'catetorias',
        public_id: file,
        timestamp: Date.now(),
      })

      console.log(`Archivo subido: ${result.url}`)
    }

    console.log('Todos los archivos han sido subidos.')
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function getImagesFromCloudinaryFolder(
  folder: string
): Promise<unknown> {
  try {
    const images = await cloudinary.v2.search
      .expression(`folder: ${folder}/*`)
      .execute()
    console.log(images)
    return images
  } catch (error) {
    return new Error(
      `No se han encontrado imagenes: ${(error as Error).message}`
    )
  }
}
