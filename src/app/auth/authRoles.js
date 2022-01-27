/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  gestor: ['admin', 'gestor'],
  financeiro: ['admin', 'gestor', 'financeiro'],
  onlyGuest: [],
};

export default authRoles;
