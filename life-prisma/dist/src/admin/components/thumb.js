import { Icon } from '@adminjs/design-system';
import React from 'react';
const Thumb = (props) => {
    const { record, property } = props;
    const value = record.params[property.name];
    return React.createElement(Icon, { icon: value ? 'ThumbsUp' : 'ThumbsDown' });
};
export default Thumb;
