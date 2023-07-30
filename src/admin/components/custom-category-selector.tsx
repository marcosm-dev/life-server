// admin/property-types/custom-category-selector.js

import React, { useEffect, useState } from 'react'
import { prisma } from 'src/prisma/config.js' // Asegúrate de que la instancia de Prisma esté importada adecuadamente

const CustomCategorySelector = (props) => {
  const { property, record, onChange } = props
  const [categories, setCategories] = useState([])

  // Carga las categorías existentes desde la base de datos al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await prisma.category.findMany()
      setCategories(allCategories)
    }
    fetchCategories()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <div>
      <select name={property.name} value={record.params[property.name] || ''} onChange={handleInputChange}>
        <option value="">Selecciona una categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CustomCategorySelector
