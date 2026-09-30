(() => {
  'use strict';
const ROOT_ADMINS = Object.freeze(['1863', '1502', '1822', '2013', '1584', '1591']);
  const PROGRAM_RESET_ADMINS = Object.freeze(['1863', '2013', '1822', '1855']);
  const ROLE_KEY = 'simec_portal_roles_v1';
  const NAME_KEY = 'simec_portal_nome_v1';
  const ID_KEY = 'simec_portal_usuario_v1';

  function readRoles() {
    try {
      const value = JSON.parse(localStorage.getItem(ROLE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function currentId() {
    const stored = String(sessionStorage.getItem(ID_KEY) || '').replace(/\D/g, '');
    if (stored) return stored;
    const name = String(sessionStorage.getItem(NAME_KEY) || '').trim().toLocaleUpperCase('pt-BR');
    const matches = (window.SIMEC_PEOPLE || []).filter(person => String(person.name || '').trim().toLocaleUpperCase('pt-BR') === name);
    return matches.length === 1 ? String(matches[0].id) : '';
  }

  function roleFor(id = currentId()) {
    const key = String(id || '');
    if (ROOT_ADMINS.includes(key)) return 'admin';
    return readRoles()[key] === 'programador' ? 'programador' : 'leitor';
  }

  function saveRoles(roles) {
    if (roleFor() !== 'admin') throw new Error('Somente administradores podem salvar permissões.');
    const clean = {};
    for (const [id, role] of Object.entries(roles || {})) {
      if (!ROOT_ADMINS.includes(String(id)) && role === 'programador') clean[String(id)] = role;
    }
    localStorage.setItem(ROLE_KEY, JSON.stringify(clean));
    return clean;
  }

  window.SIMEC_ACCESS = Object.freeze({
    ROOT_ADMINS,
    PROGRAM_RESET_ADMINS,
    currentId,
    currentName: () => sessionStorage.getItem(NAME_KEY) || 'Funcionário',
    roleFor,
    isAdmin: () => roleFor() === 'admin',
    canResetPlanning: () => PROGRAM_RESET_ADMINS.includes(currentId()),
    canProgram: () => ['admin', 'programador'].includes(roleFor()),
    readRoles,
    saveRoles
  });
})();
