"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var design_system_1 = require("@adminjs/design-system");
var react_1 = require("react");
var ModalExample = function () {
    var _a = (0, react_1.useState)(false), showModal = _a[0], setShowModal = _a[1];
    var handleButtonClick = (0, react_1.useCallback)(function () { return setShowModal(true); }, []);
    var modalProps = {
        variant: 'primary',
        label: 'Modal header',
        icon: 'Bookmark',
        title: 'Modal title',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        buttons: [{ label: 'Cancel' }, { label: 'Delete', color: 'danger' }],
        onClose: function () { return setShowModal(false); },
        onOverlayClick: function () { return setShowModal(false); },
    };
    return (<design_system_1.Box>
      <design_system_1.Button onClick={handleButtonClick}>Show modal</design_system_1.Button>
      {showModal && <design_system_1.Modal {...modalProps}></design_system_1.Modal>}
    </design_system_1.Box>);
};
exports.default = ModalExample;
