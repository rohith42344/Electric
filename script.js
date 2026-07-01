 /* app.js - full script for split-files EE Study Hub demo */

/* Utilities: copy & toast */
async function copyToClipboard(text){
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('Copied to clipboard');
    return true;
  } catch(e){
    showToast('Copy failed');
    return false;
  }
}
function showToast(msg='Copied'){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(()=> t.classList.remove('show'), 1800);
}

/* Static data */
const subjectsBySem = {
  1: ["Fundamentals of Electrical Engineering", "Engineering Mathematics"],
  2: ["Fundamentals of Electronics Engineering", "Applied Science"],
  3: ["Electrical Engineering", "Electrical Panel Engineering", "Digital Electronics"],
  4: ["Power Electronics", "Industrial Automation and Control", "Microcontroller and IoT", "Motor and Transformer"],
  5: ["Power Electronics for Electric Vehicle", "Renewable Technology"],
  6: ["Project Work", "Industrial Training", "Electric Vehicle Technology", "Smart Grid Technology"]
};

const sampleNotes = {
  "Fundamentals of Electrical Engineering": [{title:"Intro to Circuits (Sample)",url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}],
  "Engineering Mathematics": [{title:"Mathematics Notes (Sample)",url:"https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"}],
  "Fundamentals of Electronics Engineering": [{title:"Electronics Basics",url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}],
  "Digital Electronics": [{title:"Digital Electronics",url:"https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"}],
  "Power Electronics for Electric Vehicle": [{title:"EV Power Electronics",url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}]
};

const sampleVideos = [
  {title:"Circuit Analysis - Lecture", embed:"https://www.youtube.com/embed/3d2eoQFij7s"},
  {title:"Power Electronics Basics", embed:"https://www.youtube.com/embed/0MJk9LrGzbw"}
];

const samplePapers = [
  {title:"Prev Year Paper 2019", url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"},
  {title:"Prev Year Paper 2020", url:"https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"}
];

const sampleQuiz = {
  general:[
    {q:"Ohm's law relates which quantities?", choices:["Voltage, Current, Resistance","Power, Energy, Time","Flux, Inductance, Capacitance"], a:0},
    {q:"Power (single phase) formula is:", choices:["P = V × I","P = V^2/R","P = I^2 × R"], a:0},
    {q:"Transformer ratio is:", choices:["V1/V2","I1/I2","R1/R2"], a:0},
    {q:"Reactive power unit is:", choices:["VAR","W","VA"], a:0},
    {q:"kWh is a unit of:", choices:["Energy","Power","Voltage"], a:0}
  ]
};

/* DOM ready: bind events and initialize */
document.addEventListener('DOMContentLoaded', () => {
  // register UI event handlers
  document.getElementById('enterBtn').addEventListener('click', login);
  document.getElementById('darkModeToggle').addEventListener('change', e => toggleDarkMode(e.target.checked));
  document.getElementById('exportBtn').addEventListener('click', exportProfile);
  document.getElementById('copyProfileBtn').addEventListener('click', copyProfile);
  document.getElementById('subjectSearch').addEventListener('input', filterSubjects);
  document.getElementById('semester').addEventListener('change', () => { loadSubjects(); populateNotesList(); });
  document.getElementById('subjects').addEventListener('change', populateNotesList);

  document.getElementById('notesBtn').addEventListener('click', () => toggleElement('notesModal', true));
  document.getElementById('quizBtn').addEventListener('click', () => { toggleElement('quizModal', true); startQuizForSubject(document.getElementById('subjects').value); });
  document.getElementById('attendanceBtn').addEventListener('click', () => toggleElement('attendanceModal', true));
  document.getElementById('cgpaBtn').addEventListener('click', () => toggleElement('cgpaModal', true));
  document.getElementById('formulaBtn').addEventListener('click', () => toggleElement('formulaModal', true));
  document.getElementById('resumeBtn').addEventListener('click', () => toggleElement('resumeModal', true));
  document.getElementById('chatBtn').addEventListener('click', () => toggleElement('chatModal', true));

  document.querySelectorAll('.closeBtn').forEach(b => b.addEventListener('click', e => toggleElement(e.target.dataset.target, false)));

  document.getElementById('calcAttendanceBtn').addEventListener('click', calcAttendance);
  document.getElementById('addCgpaRowBtn').addEventListener('click', addCgpaRow);
  document.getElementById('calcCgpaBtn').addEventListener('click', calcCgpa);
  document.getElementById('calcPowerBtn').addEventListener('click', calcPower);
  document.getElementById('convertUnitBtn').addEventListener('click', convertUnit);

  document.getElementById('downloadResumeBtn').addEventListener('click', downloadResume);
  document.getElementById('copyResumeBtn').addEventListener('click', copyResume);

  document.getElementById('sendChatBtn').addEventListener('click', sendChat);
  document.getElementById('copyAllChatBtn').addEventListener('click', copyAllChat);

  // load stored user if any
  const stored = localStorage.getItem('ee_student_name');
  if(stored) showHome(stored);

  // create one CGPA row by default
  addCgpaRow();

  // restore theme
  const theme = localStorage.getItem('ee_theme');
  if(theme === 'dark'){ 
    document.documentElement.setAttribute('data-theme','dark');
    document.getElementById('darkModeToggle').checked = true;
    const meta = document.getElementById('meta-theme-color');
    if(meta) meta.setAttribute('content','#061425');
  }

  // register service worker (file: service-worker.js in same folder)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js').then(()=> {
      console.log('Service worker registered.');
    }).catch(err => console.warn('SW registration failed:', err));
  }

  // beforeinstallprompt handling (custom install UI)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    const area = document.getElementById('installArea');
    if(area) area.innerHTML = '<button id="installBtn" class="install-btn">Install App</button>';
    const ib = document.getElementById('installBtn');
    if(ib){
      ib.addEventListener('click', async () => {
        if(window.deferredPrompt){
          window.deferredPrompt.prompt();
          await window.deferredPrompt.userChoice;
          window.deferredPrompt = null;
          ib.style.display = 'none';
        } else {
          alert('Install prompt not available');
        }
      });
    }
  });
});

/* Login / Home */
function login(){
  const name = document.getElementById('studentName').value.trim();
  if(!name) { alert('Enter Name'); return; }
  localStorage.setItem('ee_student_name', name);
  showHome(name);
}
function showHome(name){
  document.getElementById('registerPage').classList.remove('active');
  document.getElementById('homePage').classList.add('active');
  document.getElementById('username').innerText = name || localStorage.getItem('ee_student_name') || 'Student';
  populateNotesList();
  populateVideos();
  populatePapers();
}

/* Subjects and search */
function loadSubjects(){
  const sem = document.getElementById('semester').value;
  const subEl = document.getElementById('subjects');
  subEl.innerHTML = '<option value="">Select Subject</option>';
  if(!sem) return;
  (subjectsBySem[sem] || []).forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    subEl.appendChild(opt);
  });
}
function filterSubjects(){
  const q = document.getElementById('subjectSearch').value.trim().toLowerCase();
  const subEl = document.getElementById('subjects');
  if(!document.getElementById('semester').value){
    subEl.innerHTML = '<option value="">Select Subject</option>';
    const all = [].concat(...Object.values(subjectsBySem));
    all.forEach(s=>{
      if(!q || s.toLowerCase().includes(q)){
        const opt = document.createElement('option'); opt.value = s; opt.textContent = s; subEl.appendChild(opt);
      }
    });
    return;
  }
  Array.from(subEl.options).forEach(opt=>{
    if(opt.value === "") return;
    opt.style.display = (!q || opt.value.toLowerCase().includes(q)) ? '' : 'none';
  });
}

/* Notes/Videos/Papers */
function populateNotesList(){
  const sel = document.getElementById('subjects').value;
  const notesArea = document.getElementById('notesList');
  notesArea.innerHTML = '';
  const items = sel ? (sampleNotes[sel] || []) : (Object.values(sampleNotes).flat());
  if(items.length === 0) notesArea.innerHTML = '<div class="small muted">No notes available for this subject (sample demo links).</div>';
  items.forEach(it=>{
    const d = document.createElement('div');
    d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
      <div><strong class="small">${it.title}</strong><div class="muted small">${sel||'General'}</div></div>
      <div style="display:flex;gap:8px">
        <a href="${it.url}" target="_blank"><button>Open</button></a>
        <button onclick="downloadURL('${it.url}','${escape(it.title)}')">Download</button>
      </div>
    </div>`;
    notesArea.appendChild(d);
  });
  const modalList = document.getElementById('notesModalList');
  if(modalList) modalList.innerHTML = items.map(it=>`<div style="display:flex;justify-content:space-between;padding:6px 0"><div>${it.title}</div><div><a href="${it.url}" target="_blank">Open</a></div></div>`).join('');
}
function populateVideos(){
  const v = document.getElementById('videosList');
  if(!v) return;
  v.innerHTML = sampleVideos.map(s=>`<div style="margin-bottom:6px"><strong>${s.title}</strong><div style="margin-top:6px"><iframe width="100%" height="170" src="${s.embed}" frameborder="0" allowfullscreen></iframe></div></div>`).join('');
}
function populatePapers(){
  const p = document.getElementById('papersList');
  if(!p) return;
  p.innerHTML = samplePapers.map(s=>`<div style="display:flex;justify-content:space-between;padding:6px 0"><div>${s.title}</div><div><a href="${s.url}" target="_blank">Open</a></div></div>`).join('');
}
function toggleElement(id, show){
  const el = document.getElementById(id);
  if(!el) return;
  el.style.display = show ? 'block' : 'none';
}

/* Download helper */
function downloadURL(url, filename){
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || '';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Dark mode */
function toggleDarkMode(enabled){
  if(enabled){
    document.documentElement.setAttribute('data-theme','dark');
    localStorage.setItem('ee_theme','dark');
    const meta = document.getElementById('meta-theme-color'); if(meta) meta.setAttribute('content','#061425');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('ee_theme');
    const meta = document.getElementById('meta-theme-color'); if(meta) meta.setAttribute('content','#0077cc');
  }
}

/* Quiz */
function startQuizForSubject(subject){
  const area = document.getElementById('quizArea');
  area.innerHTML = '';
  const questions = sampleQuiz['general'];
  let idx = 0, score = 0;
  function render(){
    area.innerHTML = '';
    const q = questions[idx];
    const qBox = document.createElement('div');
    qBox.className = 'card';
    qBox.innerHTML = `<div><strong>Q${idx+1}. ${q.q}</strong></div>`;
    q.choices.forEach((c,i)=>{
      const btn = document.createElement('button');
      btn.className = 'linkish';
      btn.style.display = 'block';
      btn.style.marginTop = '8px';
      btn.textContent = c;
      btn.onclick = () => { if(i===q.a) score++; idx++; if(idx<questions.length) render(); else finish(); };
      qBox.appendChild(btn);
    });
    area.appendChild(qBox);
  }
  function finish(){
    area.innerHTML = `<div class="result"><strong>Score: ${score}/${questions.length}</strong><div class="small muted">Scores saved locally (per browser).</div><div style="margin-top:8px"><button onclick="startQuizForSubject(document.getElementById('subjects').value)">Retake</button> <button onclick="toggleElement('quizModal', false)">Close</button></div></div>`;
    localStorage.setItem('ee_quiz_score_'+(subject||'general'), JSON.stringify({score, total:questions.length, time:Date.now()}));
  }
  render();
}

/* Attendance & CGPA */
function calcAttendance(){
  const a = Number(document.getElementById('attended').value)||0;
  const t = Number(document.getElementById('total').value)||0;
  const target = Number(document.getElementById('target').value)||75;
  if(t<=0){ document.getElementById('attResult').innerText='Enter total classes'; return; }
  const perc = (a/t*100).toFixed(2);
  let need = '';
  if(perc >= target) need = `You have ${perc}% attendance — target met.`;
  else {
    const neededClasses = Math.ceil(((target/100)*t - a) / (1 - target/100));
    need = `Current ${perc}%. To reach ${target}% you need approx ${neededClasses} more consecutive classes (estimate).`;
  }
  document.getElementById('attResult').innerText = need;
}

function addCgpaRow(){
  const div = document.getElementById('cgpaInputs');
  const idx = div.children.length;
  const row = document.createElement('div');
  row.className = 'row';
  row.style.marginTop = '8px';
  row.innerHTML = `<input placeholder="Course" id="cname${idx}" style="flex:2;margin-right:8px" />
    <input placeholder="Credits" id="ccr${idx}" type="number" style="width:90px;margin-right:8px" />
    <input placeholder="Grade Point" id="cgp${idx}" type="number" style="width:120px" />`;
  div.appendChild(row);
}
function calcCgpa(){
  const div = document.getElementById('cgpaInputs');
  let totalCred = 0, totalPoints = 0;
  for(let i=0;i<div.children.length;i++){
    const cr = Number(document.getElementById('ccr'+i)?.value)||0;
    const gp = Number(document.getElementById('cgp'+i)?.value)||0;
    totalCred += cr;
    totalPoints += cr*gp;
  }
  if(totalCred===0){ document.getElementById('cgpaResult').innerText='Enter credits and grade points.'; return; }
  const cgpa = (totalPoints/totalCred).toFixed(2);
  document.getElementById('cgpaResult').innerText = `CGPA: ${cgpa} (Total credits: ${totalCred})`;
}

/* Formula & Unit conv */
function calcPower(){
  const V = Number(document.getElementById('fV').value)||0;
  const I = Number(document.getElementById('fI').value)||0;
  document.getElementById('fResult').innerText = `Power = ${V * I} W`;
}
function convertUnit(){
  const v = Number(document.getElementById('uVal').value)||0;
  const from = document.getElementById('uFrom').value;
  const to = document.getElementById('uTo').value;
  let out = v;
  if(from===to) out = v;
  else if(from==='kWh' && to==='J') out = v * 3.6e6;
  else if(from==='J' && to==='kWh') out = v / 3.6e6;
  document.getElementById('uResult').innerText = `${v} ${from} = ${out} ${to}`;
}

/* Resume builder */
function buildResumeText(){
  const n = document.getElementById('resName').value || localStorage.getItem('ee_student_name') || 'Student';
  const email = document.getElementById('resEmail').value || '';
  const edu = document.getElementById('resEdu').value || '';
  const skills = document.getElementById('resSkills').value || '';
  return `Name: ${n}\nEmail: ${email}\n\nEducation:\n${edu}\n\nSkills:\n${skills}\n\nGenerated from Electrical Engineering Study Hub`;
}
function downloadResume(){
  const content = buildResumeText();
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${(document.getElementById('resName').value||'Student').replace(/\s+/g,'_')}_resume.txt`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function copyResume(){
  copyToClipboard(buildResumeText());
}

/* Chatbot with per-message copy and copy-all */
const botKnowledge = [
  {q:"hello", a:"Hello! How can I help with Electrical Engineering topics today?"},
  {q:"formulas", a:"Key formulas: V=IR, P=VI, E=Pt, Transformer ratio = V1/V2. Ask me for specific topics."},
  {q:"ev", a:"EV topics: battery management, motor control, power electronics for charging and drivetrains."},
  {q:"projects", a:"Project ideas: Battery monitoring, Solar EV charger, IoT energy meter. Want one with a block diagram?"}
];
function sendChat(){
  const input = document.getElementById('chatInput');
  const txt = input.value.trim();
  if(!txt) return;
  addChatMessage(txt, 'user');
  input.value = '';
  const cleaned = txt.toLowerCase();
  let reply = "I don't know that yet — try asking about 'formulas', 'ev', or 'projects'.";
  for(const k of botKnowledge) if(cleaned.includes(k.q)){ reply = k.a; break; }
  setTimeout(()=> addChatMessage(reply, 'bot'), 300);
}
function addChatMessage(text, who){
  const box = document.getElementById('chatbox');
  if(!box) return;
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  const content = document.createElement('div');
  content.textContent = text;
  div.appendChild(content);
  const btn = document.createElement('button');
  btn.className = 'copy-msg-btn';
  btn.title = 'Copy message';
  btn.innerText = 'Copy';
  btn.onclick = (e) => { e.stopPropagation(); copyToClipboard(text); };
  div.appendChild(btn);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function copyAllChat(){
  const box = document.getElementById('chatbox');
  if(!box){ showToast('No messages'); return; }
  const msgs = Array.from(box.querySelectorAll('.msg')).map(m=>{
    const who = m.classList.contains('user') ? 'You' : 'Bot';
    return who + ': ' + (m.firstChild ? m.firstChild.textContent : m.textContent);
  }).join('\n');
  if(msgs.trim()) copyToClipboard(msgs);
  else showToast('No messages to copy');
}

/* Export / Copy Profile */
function exportProfile(){
  const obj = {name: localStorage.getItem('ee_student_name')||'', theme: localStorage.getItem('ee_theme')||'light', time: new Date().toISOString()};
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'profile.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function copyProfile(){
  const obj = {name: localStorage.getItem('ee_student_name')||'', theme: localStorage.getItem('ee_theme')||'light', time: new Date().toISOString()};
  copyToClipboard(JSON.stringify(obj, null, 2));
}