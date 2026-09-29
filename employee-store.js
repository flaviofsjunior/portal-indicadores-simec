'use strict';
// Cadastros locais só passam a autorizar login depois da publicação pelo CMD.
window.SIMEC_EMPLOYEES=(()=>{
 const key='simec-employee-drafts-v1';
 const valid=p=>p&&/^\d+$/.test(String(p.id))&&typeof p.name==='string'&&p.name.trim()&&typeof p.area==='string'&&p.area.trim()&&['Manutenção','Produção'].includes(p.type);
 function read(){try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows.filter(valid):[]}catch{return[]}}
 function list(){const map=new Map((window.SIMEC_PEOPLE||[]).map(p=>[String(p.id),p]));for(const p of read())map.set(String(p.id),p);return [...map.values()]}
 function save(person){if(!window.SIMEC_ACCESS?.isAdmin())throw Error('Somente administradores podem cadastrar funcionários.');if(!valid(person))throw Error('Informe matrícula numérica, nome, área e equipe.');const map=new Map(read().map(p=>[String(p.id),p]));map.set(String(person.id),person);localStorage.setItem(key,JSON.stringify([...map.values()]));}
 return {list,save,drafts:read};
})();
