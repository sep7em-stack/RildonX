/* ===================== MULTIPAGE NAV ===================== */
(function () {
  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-item[data-page]').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-page') === page);
  });
  // Only the Início page is designed to fit the viewport without page scroll
  var content = document.querySelector('.content');
  if (content && page === 'inicio') content.classList.add('no-scroll');
})();


function toggleSidebar(force) {
  var app = document.getElementById('app-root');
  if (typeof force === 'boolean') {
    app.classList.toggle('sidebar-open', force);
  } else {
    app.classList.toggle('sidebar-open');
  }
}

function toggleNotifications(e) {
  e.stopPropagation();
  document.getElementById('notif-dropdown').classList.toggle('open');
}
function showGroupsTab(tab) {
  document.getElementById('grupos-meusgrupos-view').style.display = (tab === 'meusgrupos') ? 'block' : 'none';
  document.getElementById('grupos-pessoas-view').style.display = (tab === 'pessoas') ? 'block' : 'none';
  document.querySelectorAll('.tab[data-gtab]').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-gtab') === tab);
  });
}
document.addEventListener('click', function(e) {
  var dropdown = document.getElementById('notif-dropdown');
  var btn = document.getElementById('notif-btn');
  if (dropdown && dropdown.classList.contains('open') && !dropdown.contains(e.target) && e.target !== btn) {
    dropdown.classList.remove('open');
  }
});

/* ===================== MODAL SYSTEM ===================== */
function openModal(id) {
  document.querySelectorAll('.modal-panel').forEach(function(el){ el.classList.remove('open'); });
  var panel = document.getElementById(id);
  if (panel) panel.classList.add('open');
  document.getElementById('modal-backdrop').classList.add('open');
  if (id === 'modal-nova-tarefa') resetNovaTarefaForm();
  if (id === 'modal-suporte-ti') resetSuporteTIForm();
  if (id === 'modal-reserva-sala') resetReservaSalaForm();
}
function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
  document.querySelectorAll('.modal-panel').forEach(function(el){ el.classList.remove('open'); });
}

/* ===================== TOASTS ===================== */
function showToast(message) {
  var wrap = document.getElementById('toast-wrap');
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>' + message + '</span>';
  wrap.appendChild(toast);
  setTimeout(function(){
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s ease';
    setTimeout(function(){ toast.remove(); }, 300);
  }, 4200);
}
function nowStamp() {
  var d = new Date();
  var dd = String(d.getDate()).padStart(2,'0');
  var mm = String(d.getMonth()+1).padStart(2,'0');
  var hh = String(d.getHours()).padStart(2,'0');
  var mi = String(d.getMinutes()).padStart(2,'0');
  return dd + '/' + mm + '/2026 às ' + hh + ':' + mi;
}

/* ===================== GENERIC CHOICE / CHIP HELPERS ===================== */
function selectChoice(btn, groupId) {
  document.querySelectorAll('#' + groupId + ' .choice-btn').forEach(function(el){ el.classList.remove('selected'); });
  btn.classList.add('selected');
}
function togglePeopleChip(chip) {
  chip.classList.toggle('selected');
}
function addChecklistItem() {
  var wrap = document.getElementById('nt-checklist');
  var row = document.createElement('div');
  row.className = 'checklist-item';
  row.innerHTML = '<input type="text" placeholder="Item da checklist..."><button type="button" class="rm-btn" onclick="this.parentElement.remove()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
  wrap.appendChild(row);
}

/* ===================== NOVA TAREFA ===================== */
function resetNovaTarefaForm() {
  document.getElementById('nt-nome').value = '';
  document.getElementById('nt-prazo').value = '2026-09-20';
  document.getElementById('nt-checklist').innerHTML = '<div class="checklist-item"><input type="text" placeholder="Item da checklist..."><button type="button" class="rm-btn" onclick="this.parentElement.remove()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>';
  document.querySelectorAll('#nt-people-group .people-chip').forEach(function(c){ c.classList.remove('selected'); });
  document.querySelectorAll('#nt-etapa-group .choice-btn').forEach(function(c,i){ c.classList.toggle('selected', i===0); });
  document.querySelectorAll('#nt-prioridade-group .choice-btn').forEach(function(c){ c.classList.toggle('selected', c.dataset.priority==='Média'); });
}
function submitNovaTarefa() {
  var nome = document.getElementById('nt-nome').value.trim();
  if (!nome) {
    document.getElementById('nt-nome').style.borderColor = 'var(--red)';
    document.getElementById('nt-nome').focus();
    return;
  }
  var prazoRaw = document.getElementById('nt-prazo').value;
  var prazo = prazoRaw ? prazoRaw.split('-').reverse().join('/') : '—';
  var etapaBtn = document.querySelector('#nt-etapa-group .choice-btn.selected');
  var etapa = etapaBtn ? etapaBtn.dataset.etapa : 'Pendente';
  var prioBtn = document.querySelector('#nt-prioridade-group .choice-btn.selected');
  var prioridade = prioBtn ? prioBtn.dataset.priority : 'Média';
  var checklistItems = Array.from(document.querySelectorAll('#nt-checklist input')).map(function(i){return i.value.trim();}).filter(Boolean);
  var people = Array.from(document.querySelectorAll('#nt-people-group .people-chip.selected')).map(function(c){return c.dataset.name;});
  var firstPerson = people[0] || 'Adson';
  var avatarLetter = firstPerson.charAt(0).toUpperCase();

  var prioClass = prioridade === 'Alta' ? 'alta' : (prioridade === 'Baixa' ? 'baixa' : 'media');
  var stripeColor = prioridade === 'Alta' ? 'var(--red)' : (prioridade === 'Baixa' ? 'var(--green)' : 'var(--orange)');
  var desc = checklistItems.length ? ('0/' + checklistItems.length + ' itens da checklist') : 'Sem checklist';
  var peopleText = people.length ? people.join(', ') : 'Você';

  var rowHtml = '<div class="task-row">' +
      '<div class="stripe" style="background:' + stripeColor + ';"></div>' +
      '<span class="checkbox"' + (etapa === 'Em andamento' ? ' style="background:var(--blue-600);border-color:var(--blue-600);"' : '') + '></span>' +
      '<div class="task-body"><h4>' + nome + '</h4><p>' + desc + ' · ' + peopleText + '</p></div>' +
      '<div class="task-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + prazo + '</div>' +
      (etapa === 'Em andamento'
        ? '<span class="tag" style="background:var(--blue-100);color:var(--blue-600);">Em andamento</span>'
        : '<span class="priority ' + prioClass + '">' + prioridade + '</span>') +
      '<div class="task-avatar">' + avatarLetter + '</div>' +
    '</div>';

  var target = (etapa === 'Em andamento') ? 'andamento'
             : (etapa === 'Concluída')     ? 'concluida'
             : 'pendente';

  if (document.body.getAttribute('data-page') === 'tarefas') {
    injectTaskRow(target, rowHtml);
    closeModal();
    showToast('Tarefa "' + nome + '" criada com sucesso!');
  } else {
    // Static multipage: hand the task off to tarefas.html
    queueTask({ target: target, html: rowHtml });
    sessionStorage.setItem('rildonx_toast', 'Tarefa "' + nome + '" criada com sucesso!');
    closeModal();
    location.href = 'tarefas.html';
  }
}

/* Tasks created on other pages travel here through sessionStorage */
function queueTask(task) {
  var q = JSON.parse(sessionStorage.getItem('rildonx_tasks') || '[]');
  q.push(task);
  sessionStorage.setItem('rildonx_tasks', JSON.stringify(q));
}
function injectTaskRow(target, rowHtml) {
  if (target === 'andamento') {
    var list = document.getElementById('tarefas-andamento-list');
    if (!list) return;
    list.insertAdjacentHTML('afterbegin', rowHtml);
    bumpCount('count-chip-andamento', 1);
  } else if (target === 'concluida') {
    bumpCount('tab-concluidas-count', 1);
  } else {
    var listP = document.getElementById('tarefas-pendentes-list');
    if (!listP) return;
    listP.insertAdjacentHTML('afterbegin', rowHtml);
    bumpCount('count-chip-pendentes', 1);
    bumpCount('tab-minhas-count', 1);
  }
}
function flushQueuedTasks() {
  if (document.body.getAttribute('data-page') !== 'tarefas') return;
  var q = JSON.parse(sessionStorage.getItem('rildonx_tasks') || '[]');
  q.forEach(function (t) { injectTaskRow(t.target, t.html); });
  sessionStorage.removeItem('rildonx_tasks');

  var pending = sessionStorage.getItem('rildonx_toast');
  if (pending) {
    showToast(pending);
    sessionStorage.removeItem('rildonx_toast');
  }
}
document.addEventListener('DOMContentLoaded', flushQueuedTasks);
function bumpCount(id, delta) {
  var el = document.getElementById(id);
  if (!el) return;
  var n = parseInt(el.textContent, 10) || 0;
  el.textContent = n + delta;
}

/* ===================== SETOR PESSOAL ===================== */
function submitSetorPessoal(opcao) {
  closeModal();
  showToast('✅ Solicitação "' + opcao + '" enviada ao RH / Departamento Pessoal.<br>Adson Silva · ' + nowStamp());
}

/* ===================== SUPORTE TI ===================== */
function resetSuporteTIForm() {
  document.querySelectorAll('#ti-categoria-group .choice-btn').forEach(function(c,i){ c.classList.toggle('selected', i===0); });
  document.getElementById('ti-texto').value = '';
  document.getElementById('ti-charcount').textContent = '0/150';
}
function submitSuporteTI() {
  var catBtn = document.querySelector('#ti-categoria-group .choice-btn.selected');
  var categoria = catBtn ? catBtn.dataset.cat : 'Impressora';
  var texto = document.getElementById('ti-texto').value.trim();
  closeModal();
  showToast('✅ Chamado de "' + categoria + '" enviado à equipe de TI.<br>Adson Silva · ' + nowStamp() + (texto ? ('<br>"' + texto + '"') : ''));
}

/* ===================== RESERVA DE SALA ===================== */
var salasOcupadas = [
  {sala:'Sala de Reunião', data:'2026-09-14', inicio:'14:00', fim:'15:00'},
  {sala:'Sala de Reunião', data:'2026-09-14', inicio:'16:30', fim:'17:30'},
  {sala:'Auditório', data:'2026-09-14', inicio:'08:30', fim:'11:30'}
];
function resetReservaSalaForm() {
  document.getElementById('reserva-form-view').style.display = 'block';
  document.getElementById('reserva-confirm-view').style.display = 'none';
  document.getElementById('reserva-form-foot').style.display = 'flex';
  document.getElementById('reserva-conflict-slot').innerHTML = '';
  document.querySelectorAll('#rs-sala-group .choice-btn').forEach(function(c,i){ c.classList.toggle('selected', i===0); });
  document.getElementById('rs-data').value = '2026-09-14';
  document.getElementById('rs-inicio').value = '14:00';
  document.getElementById('rs-fim').value = '15:00';
  document.getElementById('rs-qtd').value = 4;
  document.getElementById('rs-motivo').value = '';
  document.querySelectorAll('#rs-people-group .people-chip').forEach(function(c){ c.classList.remove('selected'); });
  document.querySelectorAll('#modal-reserva-sala .checkbox-opt input').forEach(function(c){ c.checked = false; });
}
function timeOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}
function submitReservaSala() {
  var salaBtn = document.querySelector('#rs-sala-group .choice-btn.selected');
  var sala = salaBtn ? salaBtn.dataset.sala : 'Sala de Reunião';
  var data = document.getElementById('rs-data').value;
  var inicio = document.getElementById('rs-inicio').value;
  var fim = document.getElementById('rs-fim').value;
  var qtd = document.getElementById('rs-qtd').value || '1';
  var motivo = document.getElementById('rs-motivo').value.trim() || 'Reunião';
  var people = Array.from(document.querySelectorAll('#rs-people-group .people-chip.selected')).map(function(c){return c.dataset.name;});
  var recursos = Array.from(document.querySelectorAll('#modal-reserva-sala .checkbox-opt input:checked')).map(function(c){return c.value;});

  var conflictSlot = document.getElementById('reserva-conflict-slot');
  conflictSlot.innerHTML = '';

  if (!inicio || !fim || fim <= inicio) {
    conflictSlot.innerHTML = '<div class="booking-conflict"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Verifique o horário: o fim deve ser depois do início.</div>';
    return;
  }

  var conflict = salasOcupadas.some(function(o) {
    return o.sala === sala && o.data === data && timeOverlap(inicio, fim, o.inicio, o.fim);
  });
  if (conflict) {
    conflictSlot.innerHTML = '<div class="booking-conflict"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Este horário já está ocupado para ' + sala + '. Escolha outro horário.</div>';
    return;
  }

  // register as busy for this session
  salasOcupadas.push({sala:sala, data:data, inicio:inicio, fim:fim});

  var dataFmt = data ? data.split('-').slice(1).reverse().join('/') : '—';
  var participantesTxt = people.length ? people.join(', ') : 'Somente você';

  var confirmHtml = '<div class="confirm-card">' +
    '<div class="status-badge">🟢 Confirmada</div>' +
    '<h4>🏢 ' + motivo + '</h4>' +
    '<div class="confirm-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + dataFmt + ' · ' + inicio + '–' + fim + '</div>' +
    '<div class="confirm-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + sala + '</div>' +
    '<div class="confirm-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' + qtd + ' participantes' + (recursos.length ? (' · ' + recursos.join(', ')) : '') + '</div>' +
    '<div class="confirm-participants"><b>Participantes</b>' + participantesTxt + '</div>' +
    '</div>';

  document.getElementById('reserva-confirm-view').innerHTML = confirmHtml;
  document.getElementById('reserva-form-view').style.display = 'none';
  document.getElementById('reserva-confirm-view').style.display = 'block';
  document.getElementById('reserva-form-foot').innerHTML =
    '<button class="btn secondary" onclick="cancelarReserva()">Cancelar reserva</button>' +
    '<button class="btn" onclick="verDetalhesReserva()">Ver detalhes</button>';
  showToast('📅 Sala reservada: ' + sala + ' em ' + dataFmt + ' das ' + inicio + ' às ' + fim + '.');
}
function verDetalhesReserva() {
  showToast('Detalhes da reserva enviados para o seu e-mail.');
}
function cancelarReserva() {
  showToast('Reserva cancelada.');
  resetReservaSalaForm();
}
