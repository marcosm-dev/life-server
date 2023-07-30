export const isPOSTMethod = ({ method }) => method.toLowerCase() === 'post';
export const isGETMethod = ({ method }) => method.toLowerCase() === 'get';
export const isNewAction = ({ params: { action } }) => action === 'new';
export const isEditAction = ({ params: { action } }) => action === 'edit';
