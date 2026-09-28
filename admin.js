'use strict';

const ACCESS=window.SIMEC_ACCESS;
const PEOPLE=[...(window.SIMEC_PEOPLE||[])].filter(p=>p&&p.id).sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial=ACCESS.readRoles();
let draft={...initial},dirty=false,search='';

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),4000);}
function allPeople(){const map=new Map(PEOPLE.map(p=>[String(p.id),p]));for(const id of ACCESS.ROOT_ADMINS)if(!map.has(id))map.set(id,{id,name:'Administrador cadastrado',area:'Não localizado na planilha de treinamentos'});return [...map.values()];}
function roleRows(){const q=search.toLocaleLowerCase('pt-BR');return allPeople().filter(p=>!q||`${p.id} ${p.name} ${p.area}`.toLocaleLowerCase('pt-BR').includes(q));}
function render(){const rows=roleRows();$('#role-pending').textContent=dirty?'Existem permissões não salvas':'Permissões salvas neste navegador';$('#save-roles').disabled=!dirty;$('#role-body').innerHTML=rows.map(p=>{const id=String(p.id),root=ACCESS.ROOT_ADMINS.includes(id),role=root?'admin':(draft[id]||'leitor');return `<tr><td><strong>${esc(id)}</strong></td><td>${esc(p.name)}</td><td>${esc(p.area||'—')}</td><td>${root?'<span class="admin-badge">Administrador</span>':`<select data-role-id="${esc(id)}"><option value="leitor" ${role==='leitor'?'selected':''}>Leitor</option><option value="programador" ${role==='programador'?'selected':''}>Programador</option></select>`}</td><td>${root?'Administrador fixo':role==='programador'?'Pode programar ordens':'Somente consulta e salvamento de tags'}</td></tr>`;}).join('');}
function permissionExport(){return allPeople().map(p=>{const id=String(p.id),role=ACCESS.ROOT_ADMINS.includes(id)?'Administrador':(draft[id]==='programador'?'Programador':'Leitor');return{matricula:id,nome:p.name,area:p.area||'',funcao:role,alteradoPor:ACCESS.currentName(),alteradoPorMatricula:ACCESS.currentId(),alteradoEm:new Date().toLocaleString('pt-BR')};});}

document.addEventListener('DOMContentLoaded',()=>{
 $('#admin-user').textContent=`${ACCESS.currentName()} · ${ACCESS.currentId()||'matrícula não identificada'}`;
 if(!ACCESS.isAdmin()){$('#admin-content').hidden=true;$('#admin-blocked').hidden=false;return;}
 $('#admin-content').hidden=false;
 $('#role-body').onchange=e=>{const id=e.target.dataset.roleId;if(!id)return;if(e.target.value==='programador')draft[id]='programador';else delete draft[id];dirty=true;render();};
 $('#role-search').oninput=e=>{search=e.target.value;render();};
 $('#save-roles').onclick=()=>{draft=ACCESS.saveRoles(draft);dirty=false;render();window.exportTableXlsx(permissionExport(),[['matricula','Matrícula'],['nome','Funcionário'],['area','Área'],['funcao','Função no Portal'],['alteradoPor','Salvo por'],['alteradoPorMatricula','Matrícula de quem salvou'],['alteradoEm','Salvo em']].map(([value,label])=>({value,label})),'Permissoes','SIMEC-Permissoes-Portal-'+new Date().toISOString().slice(0,10)+'.xlsx');toast('Permissões salvas e Excel gerado.');};
 render();
});
