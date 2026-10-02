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
  const state = {view:'training',training:[],trainingSearch:'',trainingStatus:'',week:currentWeek()};
  let currentId = '';
  let currentPerson = null;
  let scheduleRows = [];

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
  function buildOrders(){
    const build=(row,type)=>({id:String(row.id),type,area:row.area||'Não informada',asset:row.asset||'—',assetName:row.assetName||'',description:row.description||row.service||'Atividade não informada',service:row.service||'',specialty:row.specialty||'',status:row.status||'',system:row.system||''});
    return [...(data.periodic||[]).map(row=>build(row,'Periódica')),...(data.nonperiodic||[]).map(row=>build(row,'Não periódica'))];
  }
  function buildSchedule(){
    scheduleRows=[];
    for(const order of buildOrders()){
      if(stage(order.id)!=='04SC')continue;
      const allocation=assignments(order.id).find(item=>String(item.id)===currentId);
      if(!allocation||!week(order.id)||!day(order.id))continue;
      scheduleRows.push({...order,week:week(order.id),day:day(order.id),stage:stage(order.id),hours:Number(allocation.hours)||0,resources:resource(order.id)});
    }
    scheduleRows.sort((a,b)=>a.week.localeCompare(b.week)||WEEKDAYS.indexOf(a.day)-WEEKDAYS.indexOf(b.day)||a.id.localeCompare(b.id,'pt-BR',{numeric:true}));
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
  function setView(view){state.view=view;document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));$('#training-view').hidden=view!=='training';$('#schedule-view').hidden=view!=='schedule';}
  function bind(){
    document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>setView(button.dataset.view));
    $('#training-search').oninput=event=>{state.trainingSearch=event.target.value;renderTraining();};
    $('#training-status').onchange=event=>{state.trainingStatus=event.target.value;renderTraining();};
    $('#schedule-week').onchange=event=>{state.week=event.target.value;renderSchedule();};
    $('#print-schedule').onclick=()=>window.print();
  }
  async function start(){
    const id=String(window.SIMEC_ACCESS?.currentId?.()||sessionStorage.getItem('simec_portal_usuario_v1')||'').replace(/\D/g,'');
    if(!id)return;
    currentId=id;currentPerson=personMap.get(id)||{id,name:window.SIMEC_ACCESS?.currentName?.()||'Funcionário',area:'Cadastro não localizado'};renderProfile();buildSchedule();
    try{await loadTraining();$('#loading').hidden=true;renderTraining();renderSchedule();bind();setView('training');}
    catch(error){$('#loading').hidden=true;$('#load-error').hidden=false;$('#load-error').textContent=error.message||'Não foi possível carregar os dados.';renderSchedule();bind();setView('schedule');}
  }
  document.addEventListener('DOMContentLoaded',()=>{start();window.addEventListener('simec-authenticated',start,{once:true});});
})();