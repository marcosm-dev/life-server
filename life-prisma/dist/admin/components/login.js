import React from 'react';
import { useSelector } from 'react-redux';
import { Box, H5, H2, Label, Illustration, Input, FormGroup, Button, Text, MessageBox, MadeWithLove, themeGet, } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { useTranslation } from 'adminjs';
import { AuthUsers } from '../constants/authUsers.js';
const Wrapper = styled(Box) `
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;
const StyledLogo = styled.img `
  max-width: 200px;
  margin: ${themeGet('space', 'md')} 0;
`;
const IllustrationsWrapper = styled(Box) `
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  & svg [stroke='#3B3552'] {
    stroke: rgba(255, 255, 255, 0.5);
  }
  & svg [fill='#3040D6'] {
    fill: rgba(255, 255, 255, 1);
  }
`;
export const Login = (props) => {
    const { action, errorMessage } = props;
    const { translateComponent, translateMessage } = useTranslation();
    const [defaultUser] = AuthUsers;
    const branding = useSelector((state) => state.branding);
    const message = `Email: ${defaultUser.email}\nPassword: ${defaultUser.password}`;
    return (React.createElement(React.Fragment, null,
        React.createElement(Wrapper, { flex: true, variant: "grey" },
            React.createElement(Box, { bg: "white", height: "480px", flex: true, boxShadow: "login", width: [1, 2 / 3, 'auto'] },
                React.createElement(Box, { bg: "primary100", color: "white", p: "x3", width: "380px", flexGrow: 0, display: ['none', 'none', 'block'], position: "relative" },
                    React.createElement(H2, { fontWeight: "lighter" }, translateComponent('Login.welcomeHeader')),
                    React.createElement(Text, { fontWeight: "lighter", mt: "default" }, translateComponent('Login.welcomeMessage')),
                    React.createElement(IllustrationsWrapper, { p: "xxl" },
                        React.createElement(Box, { display: "inline", mr: "default" },
                            React.createElement(Illustration, { variant: "Planet", width: 82, height: 91 })),
                        React.createElement(Box, { display: "inline" },
                            React.createElement(Illustration, { variant: "Astronaut", width: 82, height: 91 })),
                        React.createElement(Box, { display: "inline", position: "relative", top: "-20px" },
                            React.createElement(Illustration, { variant: "FlagInCog", width: 82, height: 91 })))),
                React.createElement(Box, { as: "form", action: action, method: "POST", p: "x3", flexGrow: 1, width: ['100%', '100%', '480px'] },
                    React.createElement(H5, { marginBottom: "xxl" }, branding.logo ? React.createElement(StyledLogo, { src: branding.logo, alt: branding.companyName }) : branding.companyName),
                    React.createElement(MessageBox, { my: "lg", message: message, variant: "info", style: { whiteSpace: 'pre-wrap' } }),
                    errorMessage && (React.createElement(MessageBox, { my: "lg", message: errorMessage.split(' ').length > 1 ? errorMessage : translateMessage(errorMessage), variant: "danger" })),
                    React.createElement(FormGroup, null,
                        React.createElement(Label, { required: true }, translateComponent('Login.properties.email')),
                        React.createElement(Input, { name: "email", placeholder: translateComponent('Login.properties.email'), defaultValue: defaultUser.email })),
                    React.createElement(FormGroup, null,
                        React.createElement(Label, { required: true }, translateComponent('Login.properties.password')),
                        React.createElement(Input, { type: "password", name: "password", placeholder: translateComponent('Login.properties.password'), autoComplete: "new-password", defaultValue: defaultUser.password })),
                    React.createElement(Text, { mt: "xl", textAlign: "center" },
                        React.createElement(Button, { variant: "contained" }, translateComponent('Login.loginButton'))))),
            branding.withMadeWithLove ? (React.createElement(Box, { mt: "xxl" },
                React.createElement(MadeWithLove, null))) : null)));
};
export default Login;
