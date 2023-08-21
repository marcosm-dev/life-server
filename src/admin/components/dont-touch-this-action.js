"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var design_system_1 = require("@adminjs/design-system");
var react_1 = require("react");
var DontTouchThis = function (props) {
    var record = props.record;
    return (<design_system_1.Box flex flexDirection={['column', 'column', 'column', 'row']} style={{ gap: 16 }}>
      <design_system_1.Box variant="container" boxShadow="card">
        <design_system_1.H3>Example of a simple page</design_system_1.H3>
        <design_system_1.Text>Where you can put almost everything like this:</design_system_1.Text>
        <design_system_1.Box as="div">
          <img src="https://i.redd.it/rd39yuiy9ns21.jpg" alt="stupid cat" width={300}/>
        </design_system_1.Box>
      </design_system_1.Box>
      <design_system_1.Box variant="container" boxShadow="card">
        <design_system_1.Text>Or (more likely), operate on a returned record:</design_system_1.Text>
        <design_system_1.Box maxHeight={500} overflowY="scroll">
          <pre style={{ fontFamily: 'monospace' }}>{JSON.stringify(record, null, 2)}</pre>
        </design_system_1.Box>
      </design_system_1.Box>
    </design_system_1.Box>);
};
exports.default = DontTouchThis;
