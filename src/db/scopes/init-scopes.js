
import { models } from "../../config/db/sequelize.config.js";
import usuarioScope from "./usuario.scope.js";

export default function initScopes() {
  models.Usuario.addScope('defaultScope', usuarioScope.defaultScope, { override: true });
  models.Usuario.addScope('loginScope', usuarioScope.loginScope);
  models.Usuario.addScope('configScope', usuarioScope.configScope);
}