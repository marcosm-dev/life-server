"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var design_system_1 = require("@adminjs/design-system");
var styled_components_1 = require("@adminjs/design-system/styled-components");
var adminjs_1 = require("adminjs");
var Wrapper = (0, styled_components_1.styled)(design_system_1.Box)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  height: 100%;\n"], ["\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  height: 100%;\n"])));
var StyledLogo = styled_components_1.styled.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  max-width: 200px;\n  margin: ", " 0;\n"], ["\n  max-width: 200px;\n  margin: ", " 0;\n"])), (0, design_system_1.themeGet)('space', 'md'));
var IllustrationsWrapper = (0, styled_components_1.styled)(design_system_1.Box)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  & svg [stroke='#3B3552'] {\n    stroke: rgba(255, 255, 255, 0.5);\n  }\n  & svg [fill='#3040D6'] {\n    fill: rgba(255, 255, 255, 1);\n  }\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  & svg [stroke='#3B3552'] {\n    stroke: rgba(255, 255, 255, 0.5);\n  }\n  & svg [fill='#3040D6'] {\n    fill: rgba(255, 255, 255, 1);\n  }\n"])));
var Login = function (props) {
    var action = props.action, errorMessage = props.errorMessage;
    var _a = (0, adminjs_1.useTranslation)(), translateComponent = _a.translateComponent, translateMessage = _a.translateMessage;
    var branding = (0, react_redux_1.useSelector)(function (state) { return state.branding; });
    var DEV = process.env.DEV || null;
    return (<react_1.default.Fragment>
      <Wrapper flex variant="grey">
        <design_system_1.Box bg="white" height="480px" flex boxShadow="login" width={[1, 2 / 3, 'auto']}>
          <design_system_1.Box bg="primary100" color="white" p="x3" width="380px" flexGrow={0} display={['none', 'none', 'block']} position="relative">
            <design_system_1.H2 fontWeight="lighter">{translateComponent('Login.welcomeHeader')}</design_system_1.H2>
            <design_system_1.Text fontWeight="lighter" mt="default">
              {translateComponent('Login.welcomeMessage')}
            </design_system_1.Text>
            <IllustrationsWrapper p="xxl">
              <design_system_1.Box display="inline" mr="default">
                <design_system_1.Illustration variant="Planet" width={82} height={91}/>
              </design_system_1.Box>
              <design_system_1.Box display="inline">
                <design_system_1.Illustration variant="Astronaut" width={82} height={91}/>
              </design_system_1.Box>
              <design_system_1.Box display="inline" position="relative" top="-20px">
                <design_system_1.Illustration variant="FlagInCog" width={82} height={91}/>
              </design_system_1.Box>
            </IllustrationsWrapper>
          </design_system_1.Box>
          <design_system_1.Box as="form" action={action} method="POST" p="x3" flexGrow={1} width={['100%', '100%', '480px']}>
            <design_system_1.H5 marginBottom="xxl">
              {branding.logo ? <StyledLogo src={branding.logo} alt={branding.companyName}/> : branding.companyName}
            </design_system_1.H5>
            <design_system_1.MessageBox my="lg" message={'ADMIN LOGIN'} variant="info" style={{ whiteSpace: 'pre-wrap' }}/>
            {errorMessage && (<design_system_1.MessageBox my="lg" message={errorMessage.split(' ').length > 1 ? errorMessage : errorMessage} variant="danger"/>)}
            <design_system_1.FormGroup>
              <design_system_1.Label required>{translateComponent('Login.properties.email')}</design_system_1.Label>
              <design_system_1.Input name="email" placeholder={translateComponent('Login.properties.email')} defaultValue={DEV && 'marcosa.mm@icloud.com'}/>
            </design_system_1.FormGroup>
            <design_system_1.FormGroup>
              <design_system_1.Label required>{translateComponent('Login.properties.password')}</design_system_1.Label>
              <design_system_1.Input type="password" name="password" placeholder={translateComponent('Login.properties.password')} autoComplete="new-password" defaultValue={DEV && '1234'}/>
            </design_system_1.FormGroup>
            <design_system_1.Text mt="xl" textAlign="center">
              <design_system_1.Button variant="contained">{translateComponent('Login.loginButton')}</design_system_1.Button>
            </design_system_1.Text>
          </design_system_1.Box>
        </design_system_1.Box>
        {branding.withMadeWithLove ? (<design_system_1.Box mt="xxl">
            <design_system_1.MadeWithLove />
          </design_system_1.Box>) : null}
      </Wrapper>
    </react_1.default.Fragment>);
};
exports.Login = Login;
exports.default = exports.Login;
var templateObject_1, templateObject_2, templateObject_3;
