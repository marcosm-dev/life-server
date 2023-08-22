import { IUser } from '../entities/user.entity.d.js';

export const RESET_PASSWORD_HTML = (link: string) => {
  return `
      <!DOCTYPE html>
        <html>
        <head>
          <style>
            .disclaimer {
              color: #455a64;
              text-decoration: underline;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              background-color: #fff;
              color: #455a64;
              text-decoration: none;
              border-radius: 26px;
              border: 1px solid rgba(0, 0, 0, 0.4);
            }
          </style>
        </head>
        <body>
          <p>Hola,</p>
          <p>Has solicitado recuperar tu contraseña. Puedes restablecerla haciendo clic en el siguiente enlace:</p>
          <div><a class="button" href="${link}">Cambiar mi contraseña ahora.</a></div>
          <p>${link}</p>
          <p class="disclaimer">
            <span>Éste enlace solo funcionara durante 1h, después tendrás que volver a realizar la petición.</span>
            No olvides revisar tu correo no deseado (spam) si no encuentras el email
          </p>.
        </body>
        </html>
        
      `;
};

export const ORDER_HTML = (newUser: IUser) => `
  <body>
    <ul>
      <li>Usuario: ${newUser.name} ${newUser.lastName}</li>
      <li>Teléfono: ${newUser.phone}</li>
      <li>Fecha de solicitud: ${new Date().toLocaleString()}</li>
      <li>Dirección: ${newUser.address}</li>
      <li>Ciudad: ${newUser.city}</li>
      <li>DNI: ${newUser.VATIN}</li>
      <li>Usuario con correo electrónico ${newUser.email}, solicita acceso.</li>
      <strong>Accede a tu panel de administrador desde el siguiente enlance: </strong>
      <a target="_blank" href="${
        process.env.SERVER_URI
      }" alt="Enlace al administrador">
        Haz click aqui para acceder.
      </a>
    </ul>
  </body>
`;
