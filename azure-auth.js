(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .entra-session{position:fixed;right:16px;bottom:14px;z-index:9999;display:flex;align-items:center;gap:12px;padding:9px 10px 9px 14px;background:#fff;border:1px solid #cbd8e6;border-radius:10px;box-shadow:0 8px 28px rgba(20,45,80,.18);font:600 12px/1.25 Arial,sans-serif;color:#27415d}
    .entra-session a{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:7px;background:#151e75;color:#fff;text-decoration:none}
    .entra-session a:hover{background:#26319a}
    @media(max-width:720px){.entra-session{left:10px;right:10px;bottom:8px;justify-content:space-between}.entra-session span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
  `;
  document.head.appendChild(style);

  async function loadSession() {
    const response = await fetch("/.auth/me", {
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error(`Falha ao consultar sessão (${response.status})`);
    const payload = await response.json();
    const principal = payload && payload.clientPrincipal;
    if (!principal) {
      const target = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`/.auth/login/aad?post_login_redirect_uri=${target}`);
      return;
    }

    window.SIMEC_AUTH = Object.freeze({
      authenticated: true,
      name: principal.userDetails || "Funcionário",
      userId: principal.userId || "",
      roles: Array.isArray(principal.userRoles) ? [...principal.userRoles] : []
    });

    const bar = document.createElement("aside");
    bar.className = "entra-session";
    bar.setAttribute("aria-label", "Sessão do portal");
    const welcome = document.createElement("span");
    welcome.textContent = `Bem-vindo, ${window.SIMEC_AUTH.name}`;
    const logout = document.createElement("a");
    logout.href = "/.auth/logout?post_logout_redirect_uri=/";
    logout.textContent = "Sair do portal";
    bar.append(welcome, logout);
    document.body.appendChild(bar);
  }

  loadSession().catch((error) => {
    console.error("Autenticação do portal:", error);
  });
})();
