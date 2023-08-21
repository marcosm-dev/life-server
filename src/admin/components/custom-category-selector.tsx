
import React, { useEffect, useState } from 'react'

const CustomCategorySelector = (props: any) => {
  const { property, record, onChange } = props
  const [categories, setCategories] = useState([])

  console.log(props)

  // Carga las categorías existentes desde la base de datos al montar el componente
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const allCategories = await prisma.category.findMany()
  //     setCategories(allCategories)
  //   }
  //   fetchCategories()
  // }, [])

  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <div>
      <select name={property.name} value={record.params[property.name] || ''} onChange={handleInputChange}>
        <option value="">Categoría</option>
        {categories.map((category: any) => (
          <option key={category.id} value={category.id}>
            {category.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CustomCategorySelector
