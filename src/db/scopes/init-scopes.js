
import { models } from "../../config/db/sequelize.config.js";
import usuarioScope from "./usuario.scope.js";
import productoScope from "./producto.scope.js";

export default function initScopes() {
  models.Usuario.addScope('defaultScope', usuarioScope.defaultScope, { override: true });
  models.Usuario.addScope('loginScope', usuarioScope.loginScope);
  models.Producto.addScope('defaultScope', productoScope.defaultScope, { override: true });
  models.Producto.addScope('detailScope', productoScope.detailScope);

}