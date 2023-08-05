import ItemModel from '../../entities/cart-item.entity.js';
const Item = {
    resource: {
        model: ItemModel,
    },
    options: {
        properties: {
            productDeleted: {
                isVisible: {
                    edit: false,
                    show: false,
                    list: false,
                    filter: false
                }
            }
        }
    },
};
export default Item;
