"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CustomCategorySelector = function (props) {
    var property = props.property, record = props.record, onChange = props.onChange;
    var _a = (0, react_1.useState)([]), categories = _a[0], setCategories = _a[1];
    console.log(props);
    // Carga las categorías existentes desde la base de datos al montar el componente
    // useEffect(() => {
    //   const fetchCategories = async () => {
    //     const allCategories = await prisma.category.findMany()
    //     setCategories(allCategories)
    //   }
    //   fetchCategories()
    // }, [])
    var handleInputChange = function (event) {
        var _a = event.target, name = _a.name, value = _a.value;
        onChange(name, value);
    };
    return (<div>
      <select name={property.name} value={record.params[property.name] || ''} onChange={handleInputChange}>
        <option value="">Categoría</option>
        {categories.map(function (category) { return (<option key={category.id} value={category.id}>
            {category.nombre}
          </option>); })}
      </select>
    </div>);
};
exports.default = CustomCategorySelector;
