import { Box, Button, Modal } from '@adminjs/design-system';
import React, { useCallback, useState } from 'react';
const ModalExample = () => {
    const [showModal, setShowModal] = useState(false);
    const handleButtonClick = useCallback(() => setShowModal(true), []);
    const modalProps = {
        variant: 'primary',
        label: 'Modal header',
        icon: 'Bookmark',
        title: 'Modal title',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        buttons: [{ label: 'Cancel' }, { label: 'Delete', color: 'danger' }],
        onClose: () => setShowModal(false),
        onOverlayClick: () => setShowModal(false),
    };
    return (React.createElement(Box, null,
        React.createElement(Button, { onClick: handleButtonClick }, "Show modal"),
        showModal && React.createElement(Modal, { ...modalProps })));
};
export default ModalExample;
