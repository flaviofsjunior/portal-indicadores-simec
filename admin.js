'use strict';

const ACCESS=window.SIMEC_ACCESS;
const PEOPLE=[...(window.SIMEC_PEOPLE||[])].filter(p=>p&&p.id).sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial=ACCESS.readRoles();
let draft={...initial},dirty=false,search='';

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),4000);}
function allPeople(){const map=new Map(window.SIMEC_EMPLOYEES.list().map(p=>[String(p.id),p]));for(const id of ACCESS.ROOT_ADMINS)if(!map.has(id))map.set(id,{id,name:'Administrador cadastrado',area:'Não localizado na planilha de treinamentos'});return [...map.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR'));}
function roleRows(){const q=search.toLocaleLowerCase('pt-BR');return allPeople().filter(p=>!q||`${p.id} ${p.name} ${p.area}`.toLocaleLowerCase('pt-BR').includes(q));}
function render(){const rows=roleRows();$('#role-pending').textContent=dirty?'Existem permissões não salvas':'Permissões salvas neste navegador';$('#save-roles').disabled=!dirty;$('#role-body').innerHTML=rows.map(p=>{const id=String(p.id),root=ACCESS.ROOT_ADMINS.includes(id),role=root?'admin':(draft[id]||'leitor');return `<tr><td><strong>${esc(id)}</strong></td><td>${esc(p.name)}</td><td>${esc(p.area||'—')}</td><td>${root?'<span class="admin-badge">Administrador</span>':`<select data-role-id="${esc(id)}"><option value="leitor" ${role==='leitor'?'selected':''}>Leitor</option><option value="programador" ${role==='programador'?'selected':''}>Programador</option></select>`}</td><td>${root?'Administrador fixo':role==='programador'?'Pode programar ordens':'Somente consulta e salvamento de tags'}</td></tr>`;}).join('');}
function permissionExport(){return allPeople().map(p=>{const id=String(p.id),role=ACCESS.ROOT_ADMINS.includes(id)?'Administrador':(draft[id]==='programador'?'Programador':'Leitor');return{matricula:id,nome:p.name,area:p.area||'',funcao:role,alteradoPor:ACCESS.currentName(),alteradoPorMatricula:ACCESS.currentId(),alteradoEm:new Date().toLocaleString('pt-BR')};});}

document.addEventListener('DOMContentLoaded',()=>{
 $('#admin-user').textContent=`${ACCESS.currentName()} · ${ACCESS.currentId()||'matrícula não identificada'}`;
 const resetPanel=$('#reset-programming'),resetInput=$('#reset-confirmation'),resetButton=$('#reset-programming-button');
 if(ACCESS.canResetPlanning()){
  resetPanel.hidden=false;
  resetInput.oninput=()=>{resetButton.disabled=resetInput.value.trim().toLocaleUpperCase('pt-BR')!=='LIMPAR';};
  resetButton.onclick=()=>{if(resetInput.value.trim().toLocaleUpperCase('pt-BR')!=='LIMPAR')return;const data=window.SIMEC_DATA||{},pendingIds=new Set([...(data.periodic||[]),...(data.nonperiodic||[])].filter(order=>String(order.status||'').trim()==='Pendente').map(order=>String(order.id))),pendingList=[...pendingIds];let removed=0;for(const key of Object.keys(localStorage)){if(!key.startsWith('simec-backlog-'))continue;const match=key.match(/-(\d+)$/);if(match&&pendingIds.has(match[1])){localStorage.removeItem(key);removed++;}}localStorage.setItem('simec_programacao_ultimo_reset_v1',JSON.stringify({por:ACCESS.currentName(),matricula:ACCESS.currentId(),em:new Date().toISOString(),itensRemovidos:removed,ordensPendentes:pendingList}));resetInput.value='';resetButton.disabled=true;$('#reset-result').textContent=`Programação resetada por ${ACCESS.currentName()}. ${pendingList.length} ordem(ns) pendente(s) foram limpas; ordens concluídas, encerradas e canceladas foram preservadas.`;toast('Programação das ordens pendentes limpa.');};
 }
 if(!ACCESS.isAdmin()){$('#admin-content').hidden=true;$('#admin-blocked').hidden=false;return;}
 $('#admin-content').hidden=false;
 $('#employee-form').onsubmit=e=>{e.preventDefault();try{const person={id:$('#employee-id').value.trim(),name:$('#employee-name').value.trim(),area:$('#employee-area').value.trim(),type:$('#employee-type').value,supervisor:$('#employee-supervisor').value.trim()};window.SIMEC_EMPLOYEES.save(person);render();$('#employee-result').textContent='Cadastro salvo neste navegador. Exporte o CSV para publicar pelo CMD.';toast('Cadastro salvo neste navegador.');}catch(error){$('#employee-result').textContent=error.message;}};
 $('#employee-id').onchange=()=>{const p=allPeople().find(p=>String(p.id)===$('#employee-id').value.trim());for(const field of ['name','area','type','supervisor'])$('#employee-'+field).value=p?.[field]|| (field==='type'?'Manutenção':'');};
 $('#export-employees').onclick=()=>{const rows=window.SIMEC_EMPLOYEES.drafts();if(!rows.length){toast('Nenhum cadastro novo ou alterado para exportar.');return;}const cell=value=>'"'+String(value??'').replace(/"/g,'""')+'"';const content='\ufeff'+[['Matricula','Nome','Area','Tipo','Supervisor'],...rows.map(p=>[p.id,p.name,p.area,p.type,p.supervisor])].map(row=>row.map(cell).join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='CADASTRO_FUNCIONARIOS.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('CSV gerado. Salve ao lado de ATUALIZAR_DASHBOARD.cmd.');};
 $('#role-body').onchange=e=>{const id=e.target.dataset.roleId;if(!id)return;if(e.target.value==='programador')draft[id]='programador';else delete draft[id];dirty=true;render();};
 $('#role-search').oninput=e=>{search=e.target.value;render();};
 $('#save-roles').onclick=()=>{draft=ACCESS.saveRoles(draft);dirty=false;render();window.exportTableXlsx(permissionExport(),[['matricula','Matrícula'],['nome','Funcionário'],['area','Área'],['funcao','Função no Portal'],['alteradoPor','Salvo por'],['alteradoPorMatricula','Matrícula de quem salvou'],['alteradoEm','Salvo em']].map(([value,label])=>({value,label})),'Permissoes','SIMEC-Permissoes-Portal-'+new Date().toISOString().slice(0,10)+'.xlsx');toast('Permissões salvas e Excel gerado.');};
 render();
});
