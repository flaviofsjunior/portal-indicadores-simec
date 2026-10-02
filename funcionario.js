'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const nf = value => Number(value || 0).toLocaleString('pt-BR');
  const WEEKDAYS = ['Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado','Domingo'];
  const data = window.SIMEC_DATA || {periodic:[],nonperiodic:[],planning:[]};
  const people = (window.SIMEC_EMPLOYEES?.list?.() || window.SIMEC_PEOPLE || []).map(person => ({...person,id:String(person.id)}));
  const personMap = new Map(people.map(person => [person.id, person]));
  const planningMap = new Map((data.planning || []).map(item => [String(item.id), item]));
  const state = {view:'training',training:[],trainingSearch:'',trainingStatus:'',week:currentWeek(),teamWeek:currentWeek(),teamArea:'',teamMode:'week'};
  let currentId = '';
  let currentPerson = null;
  let scheduleRows = [];
  let programmedRows = [];

  function currentWeek(){
    const now = new Date(), date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())), day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const year = date.getUTCFullYear(), start = new Date(Date.UTC(year,0,1)), week = Math.ceil((((date-start)/86400000)+1)/7);
    return `${year}-W${String(week).padStart(2,'0')}`;
  }
  function weekLabel(value){const match=String(value||'').match(/^(\d{4})-W(\d{2})$/);return match?`Semana ${match[2]} / ${match[1]}`:'Sem semana';}
  function parseWeek(value){const text=String(value||''),iso=text.match(/^(\d{4})-W(\d{2})$/),named=text.match(/Semana\s+(\d+)\s*\/\s*(\d{4})/i);return iso?text:named?`${named[2]}-W${String(named[1]).padStart(2,'0')}`:'';}
  function dateText(value){if(!value)return'—';const d=new Date(String(value).slice(0,10)+'T12:00:00');return Number.isNaN(d.valueOf())?String(value):d.toLocaleDateString('pt-BR');}
  function local(prefix,id){try{return localStorage.getItem(`simec-backlog-${prefix}-${id}`)}catch{return null}}
  function jsonLocal(prefix,id){try{const value=local(prefix,id);return value===null?null:JSON.parse(value||'[]')}catch{return null}}
  function planningAllowed(item){
    try{const info=JSON.parse(localStorage.getItem('simec_programacao_ultimo_reset_v1')||'null');if(!info)return true;const ids=Array.isArray(info.ordensPendentes)?info.ordensPendentes.map(String):null;if(ids)return !ids.includes(String(item?.id||''));const reset=Date.parse(info.em||'')||0;return !reset||(Date.parse(item?.modifiedAt||'')||0)>reset;}catch{return true}
  }
  function seed(orderId){const item=planningMap.get(String(orderId))||{};return planningAllowed(item)?item:{};}
  function stage(orderId){const item=seed(orderId);return local('stage',orderId)||local('tag',orderId)||item.stage||'';}
  function week(orderId){const item=seed(orderId);return local('week',orderId)||parseWeek(item.scheduledWeek);}
  function day(orderId){return local('day',orderId)||seed(orderId).scheduledDay||'';}
  function resource(orderId){return local('resource',orderId)||seed(orderId).resources||'';}
  function assignments(orderId){
    const saved=jsonLocal('assignments',orderId);
    if(Array.isArray(saved)&&saved.length)return saved.map(item=>({...item,id:String(item.id),hours:Number(item.hours)||0}));
    const item=seed(orderId), hoursById=new Map(), ids=[];
    const combined=`${item.laborIds||''} | ${item.laborHours||''}`;
    for(const match of combined.matchAll(/\((\d+)\)\s*:\s*([\d,.]+)h/gi)){if(!ids.includes(match[1]))ids.push(match[1]);hoursById.set(match[1],Number(match[2].replace(',','.'))||0);}
    String(item.laborIds||'').split(/\s*\|\s*|\s*,\s*/).map(value=>value.trim()).filter(value=>/^\d+$/.test(value)).forEach(id=>{if(!ids.includes(id))ids.push(id);});
    const fallback=Number(item.plannedHours||0)/(ids.length||1);
    return ids.map(id=>({id,hours:hoursById.get(id)||fallback||0}));
  }
  function audit(orderId){
    try{const saved=JSON.parse(localStorage.getItem(`simec-backlog-audit-${orderId}`)||'null');if(saved)return{by:saved.by||saved.name||'',userId:String(saved.userId||saved.id||''),at:saved.at||''};}catch{}
    const item=seed(orderId);return{by:item.modifiedBy||'',userId:String(item.modifiedUser||''),at:item.modifiedAt||''};
  }
  function buildOrders(){
    const build=(row,type)=>({id:String(row.id),type,area:row.area||'Não informada',asset:row.asset||'—',assetName:row.assetName||'',description:row.description||row.service||'Atividade não informada',service:row.service||'',specialty:row.specialty||'',status:row.status||'',system:row.system||''});
    return [...(data.periodic||[]).map(row=>build(row,'Periódica')),...(data.nonperiodic||[]).map(row=>build(row,'Não periódica'))];
  }
  function buildSchedule(){
    scheduleRows=[];programmedRows=[];
    for(const order of buildOrders()){
      if(stage(order.id)!=='04SC')continue;
      const orderWeek=week(order.id),orderDay=day(order.id),allocations=assignments(order.id);
      if(!orderWeek||!orderDay)continue;
      const full={...order,week:orderWeek,day:orderDay,stage:'04SC',allocations,resources:resource(order.id),audit:audit(order.id)};
      programmedRows.push(full);
      const allocation=allocations.find(item=>String(item.id)===currentId);
      if(allocation)scheduleRows.push({...full,hours:Number(allocation.hours)||0});
    }
    programmedRows.sort((a,b)=>a.week.localeCompare(b.week)||WEEKDAYS.indexOf(a.day)-WEEKDAYS.indexOf(b.day)||a.id.localeCompare(b.id,'pt-BR',{numeric:true}));
    scheduleRows.sort((a,b)=>a.week.localeCompare(b.week)||WEEKDAYS.indexOf(a.day)-WEEKDAYS.indexOf(b.day)||a.id.localeCompare(b.id,'pt-BR',{numeric:true}));
  }
  function isSupervisor(){
    const name=fold(currentPerson?.name),first=name.split(/\s+/)[0];
    return !!name&&people.some(person=>{const supervisor=fold(person.supervisor);return supervisor===name||(supervisor&&supervisor.split(/\s+/)[0]===first);});
  }
  function canViewTeamProgramming(){
    const area=fold(currentPerson?.area);
    return ['1801','1502'].includes(currentId)||area.includes('pcm')||area.includes('engenharia de manutencao')||isSupervisor()||!!window.SIMEC_ACCESS?.canProgram?.();
  }
  function allocationArea(item){return personMap.get(String(item.id))?.area||'';}
  function teamAreas(){
    const values=new Set(people.map(person=>person.area).filter(Boolean));
    programmedRows.forEach(row=>{if(row.area)values.add(row.area);row.allocations.forEach(item=>{const area=allocationArea(item);if(area)values.add(area);});});
    return [...values].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  }
  function teamRows(){
    const mode=state.teamMode,area=state.teamArea;
    return programmedRows.filter(row=>{
      if(row.week!==state.teamWeek)return false;
      if(mode==='mine')return row.audit.userId===currentId||fold(row.audit.by).includes(fold(currentPerson?.name));
      if(mode==='preventive'&&row.type!=='Periódica')return false;
      if(!area)return true;
      return fold(row.area)===fold(area)||row.allocations.some(item=>fold(allocationArea(item))===fold(area));
    });
  }
  function extractJsonObject(source,marker){
    const markerIndex=source.indexOf(marker);if(markerIndex<0)throw new Error('Base de treinamentos não localizada.');
    const start=source.indexOf('{',markerIndex+marker.length);if(start<0)throw new Error('Base de treinamentos inválida.');
    let depth=0,inString=false,escaped=false;
    for(let i=start;i<source.length;i++){
      const char=source[i];
      if(inString){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')inString=false;continue;}
      if(char==='"'){inString=true;continue;}if(char==='{')depth++;else if(char==='}'&&--depth===0)return JSON.parse(source.slice(start,i+1));
    }
    throw new Error('Base de treinamentos incompleta.');
  }
  async function loadTraining(){
    const response=await fetch('treinamentos.html',{cache:'no-store'});if(!response.ok)throw new Error('Não foi possível consultar os treinamentos.');
    const trainingData=extractJsonObject(await response.text(),'const DATA=');
    let aliases={};try{const saved=JSON.parse(localStorage.getItem('simec-training-people-v2')||'null');aliases=saved?.aliases||{};}catch{}
    state.training=(trainingData.records||[]).filter(record=>String(aliases[String(record.id)]||record.id)===currentId);
  }
  function statusBadge(status){const cls=status==='Concluído'?'done':status==='A treinar'?'todo':'progress';return`<span class="status ${cls}">${esc(status||'Não informado')}</span>`;}
  function renderProfile(){
    $('#employee-name').textContent=currentPerson?.name||window.SIMEC_ACCESS?.currentName?.()||'Funcionário';
    $('#employee-id').textContent=currentId;
    $('#employee-meta').textContent=[currentPerson?.area,currentPerson?.supervisor?`Supervisor: ${currentPerson.supervisor}`:'',currentPerson?.type].filter(Boolean).join(' · ');
  }
  function renderTraining(){
    const all=state.training,done=all.filter(r=>r.status==='Concluído').length,todo=all.filter(r=>r.status==='A treinar').length,progress=all.filter(r=>r.status==='Em andamento').length;
    $('#training-kpis').innerHTML=[['Registros',all.length,'Todos os treinamentos'],['Concluídos',done,all.length?`${(done/all.length*100).toLocaleString('pt-BR',{maximumFractionDigits:1})}% do total`:'Sem registros'],['A treinar',todo,'Pendências cadastradas'],['Em andamento',progress,'Treinamentos iniciados']].map(([label,value,note])=>`<div><span>${label}</span><strong>${nf(value)}</strong><small>${note}</small></div>`).join('');
    const query=fold(state.trainingSearch),rows=all.filter(r=>(!state.trainingStatus||r.status===state.trainingStatus)&&(!query||fold(`${r.title} ${r.code} ${r.revision}`).includes(query))).sort((a,b)=>String(a.status).localeCompare(String(b.status),'pt-BR')||String(a.title).localeCompare(String(b.title),'pt-BR'));
    let expiry={};try{expiry=JSON.parse(localStorage.getItem('simec-expiry-v1')||'{}')}catch{}
    $('#training-body').innerHTML=rows.map(r=>{const expiryKey=[currentId,r.code,r.revision].join('|');return`<tr><td><strong>${esc(r.title||'Treinamento não informado')}</strong></td><td>${esc(r.code||'—')}</td><td>${esc(r.revision||'—')}</td><td>${statusBadge(r.status)}</td><td>${dateText(r.date)}</td><td>${dateText(expiry[expiryKey])}</td></tr>`;}).join('')||'<tr><td colspan="6">Nenhum treinamento encontrado nesta seleção.</td></tr>';
  }
  function renderWeekOptions(){
    const weeks=[...new Set([currentWeek(),...scheduleRows.map(row=>row.week)])].filter(Boolean).sort();
    $('#schedule-week').innerHTML=weeks.map(value=>`<option value="${esc(value)}" ${value===state.week?'selected':''}>${weekLabel(value)}</option>`).join('');
    if(!weeks.includes(state.week))state.week=weeks[0]||currentWeek();
  }
  function renderSchedule(){
    renderWeekOptions();
    const rows=scheduleRows.filter(row=>row.week===state.week),totalHours=rows.reduce((sum,row)=>sum+row.hours,0),areas=new Set(rows.map(row=>row.area)).size,days=new Set(rows.map(row=>row.day)).size;
    $('#schedule-kpis').innerHTML=[['Ordens',rows.length,weekLabel(state.week)],['Horas programadas',`${totalHours.toLocaleString('pt-BR')} h`,'Somente para sua matrícula'],['Dias com programação',days,'Na semana selecionada'],['Áreas atendidas',areas,'Áreas das ordens']].map(([label,value,note])=>`<div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
    $('#schedule-board').innerHTML=WEEKDAYS.map(dayName=>{const daily=rows.filter(row=>row.day===dayName),cards=daily.map(row=>`<article class="personal-order"><strong>OS ${esc(row.id)}</strong><span>${esc(row.description)}</span><b>${row.hours.toLocaleString('pt-BR')} h</b><small>${esc(row.area)} · ${esc(row.asset)}</small></article>`).join('');return`<section class="personal-day"><header><strong>${esc(dayName.replace('-feira',''))}</strong><span>${daily.length}</span></header><div>${cards||'<p class="empty-day">Sem programação</p>'}</div></section>`;}).join('');
    $('#schedule-body').innerHTML=rows.map(row=>`<tr><td>${esc(row.day)}</td><td><strong>OS ${esc(row.id)}</strong><small>${esc(row.description)}</small></td><td>${esc(row.area)}</td><td>${esc(row.asset)}${row.assetName?`<small>${esc(row.assetName)}</small>`:''}</td><td><span class="status done">${esc(row.stage)}</span></td><td><strong>${row.hours.toLocaleString('pt-BR')} h</strong></td><td>${esc(row.resources||'—')}</td></tr>`).join('')||'<tr><td colspan="7">Nenhuma ordem programada para sua matrícula nesta semana.</td></tr>';
  }
  function renderTeamOptions(){
    const weeks=[...new Set([currentWeek(),...programmedRows.map(row=>row.week)])].filter(Boolean).sort();
    if(!weeks.includes(state.teamWeek))state.teamWeek=weeks[0]||currentWeek();
    $('#team-week').innerHTML=weeks.map(value=>`<option value="${esc(value)}" ${value===state.teamWeek?'selected':''}>${weekLabel(value)}</option>`).join('');
    const areas=teamAreas();
    if(!state.teamArea)state.teamArea=currentPerson?.area||areas[0]||'';
    if(state.teamArea&&!areas.includes(state.teamArea))areas.unshift(state.teamArea);
    $('#team-area').innerHTML=['<option value="">Todas as equipes</option>',...areas.map(value=>`<option value="${esc(value)}" ${value===state.teamArea?'selected':''}>${esc(value)}</option>`)].join('');
    $('#team-mode').value=state.teamMode;$('#team-area-label').hidden=state.teamMode==='mine';
  }
  function renderTeamProgramming(){
    renderTeamOptions();const rows=teamRows();
    const totalHours=rows.reduce((sum,row)=>sum+row.allocations.reduce((s,item)=>s+(Number(item.hours)||0),0),0);
    const professionals=new Set(rows.flatMap(row=>row.allocations.map(item=>String(item.id)))).size,areas=new Set(rows.map(row=>row.area)).size;
    $('#team-kpis').innerHTML=[['Ordens',rows.length,weekLabel(state.teamWeek)],['Horas programadas',`${totalHours.toLocaleString('pt-BR')} h`,'Total da seleção'],['Profissionais',professionals,'Matrículas programadas'],['Áreas atendidas',areas,'Áreas das ordens']].map(([label,value,note])=>`<div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
    $('#team-board').innerHTML=WEEKDAYS.map(dayName=>{const daily=rows.filter(row=>row.day===dayName),cards=daily.map(row=>{const hours=row.allocations.reduce((sum,item)=>sum+(Number(item.hours)||0),0);return`<article class="personal-order"><strong>OS ${esc(row.id)}</strong><span>${esc(row.description)}</span><b>${hours.toLocaleString('pt-BR')} h</b><small>${esc(row.area)} · ${row.type==='Periódica'?'Preventiva':esc(row.type)}</small></article>`;}).join('');return`<section class="personal-day"><header><strong>${esc(dayName.replace('-feira',''))}</strong><span>${daily.length}</span></header><div>${cards||'<p class="empty-day">Sem programação</p>'}</div></section>`;}).join('');
    $('#team-body').innerHTML=rows.map(row=>{const labor=row.allocations.map(item=>{const person=personMap.get(String(item.id));return`${person?.name||`Matrícula ${item.id}`} (${item.id}): ${(Number(item.hours)||0).toLocaleString('pt-BR')} h`;}).join('<br>')||'—';const hours=row.allocations.reduce((sum,item)=>sum+(Number(item.hours)||0),0);return`<tr><td>${esc(row.day)}</td><td><strong>OS ${esc(row.id)}</strong><small>${esc(row.description)}</small></td><td>${row.type==='Periódica'?'<span class="status progress">Preventiva</span>':esc(row.type)}</td><td>${esc(row.area)}</td><td>${esc(row.asset)}${row.assetName?`<small>${esc(row.assetName)}</small>`:''}</td><td>${labor}</td><td><strong>${hours.toLocaleString('pt-BR')} h</strong></td><td>${esc(row.audit.by||row.audit.userId||'—')}</td></tr>`;}).join('')||'<tr><td colspan="8">Nenhuma programação encontrada nesta seleção.</td></tr>';
  }
  function printView(view){document.querySelectorAll('.employee-view').forEach(section=>section.classList.toggle('print-target',section.id===`${view}-view`));window.print();setTimeout(()=>document.querySelectorAll('.employee-view').forEach(section=>section.classList.remove('print-target')),0);}
  function setView(view){if(view==='team'&&!canViewTeamProgramming())return;state.view=view;document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));$('#training-view').hidden=view!=='training';$('#schedule-view').hidden=view!=='schedule';$('#team-view').hidden=view!=='team';if(view==='team')renderTeamProgramming();}
  function bind(){
    document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>setView(button.dataset.view));
    $('#training-search').oninput=event=>{state.trainingSearch=event.target.value;renderTraining();};
    $('#training-status').onchange=event=>{state.trainingStatus=event.target.value;renderTraining();};
    $('#schedule-week').onchange=event=>{state.week=event.target.value;renderSchedule();};
    $('#print-schedule').onclick=()=>printView('schedule');
    $('#team-mode').onchange=event=>{state.teamMode=event.target.value;renderTeamProgramming();};
    $('#team-area').onchange=event=>{state.teamArea=event.target.value;renderTeamProgramming();};
    $('#team-week').onchange=event=>{state.teamWeek=event.target.value;renderTeamProgramming();};
    $('#print-team').onclick=()=>printView('team');
  }
  async function start(){
    const id=String(window.SIMEC_ACCESS?.currentId?.()||sessionStorage.getItem('simec_portal_usuario_v1')||'').replace(/\D/g,'');
    if(!id)return;
    currentId=id;currentPerson=personMap.get(id)||{id,name:window.SIMEC_ACCESS?.currentName?.()||'Funcionário',area:'Cadastro não localizado'};renderProfile();buildSchedule();$('#team-tab').hidden=!canViewTeamProgramming();
    try{await loadTraining();$('#loading').hidden=true;renderTraining();renderSchedule();bind();setView('training');}
    catch(error){$('#loading').hidden=true;$('#load-error').hidden=false;$('#load-error').textContent=error.message||'Não foi possível carregar os dados.';renderSchedule();bind();setView('schedule');}
  }
  document.addEventListener('DOMContentLoaded',()=>{start();window.addEventListener('simec-authenticated',start,{once:true});});
})();
