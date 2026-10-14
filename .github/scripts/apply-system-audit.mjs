import fs from 'node:fs';
const file='index.html';
let html=fs.readFileSync(file,'utf8');
const once=(before,after,label)=>{ if(html.includes(after)) return; if(!html.includes(before)) throw new Error('Missing '+label); html=html.replace(before,after); };

once("const STORE_KEY = 'igcse_0511_listening_resource_v1';","const STORE_KEY_BASE = 'igcse_0511_listening_resource_v1';\nlet hubStorageNamespace = 'anonymous';\nlet listeningAppInitialised = false;\nfunction storageKey(){ return hubStorageNamespace === 'anonymous' ? STORE_KEY_BASE : STORE_KEY_BASE + ':' + hubStorageNamespace; }\nfunction applyHubStorageNamespace(namespace){\n  const clean=String(namespace||'').trim().replace(/[^a-zA-Z0-9_-]/g,'').slice(0,96);\n  if(!clean || clean===hubStorageNamespace) return;\n  hubStorageNamespace=clean;\n}\nwindow.addEventListener('message',function(event){\n  if(window.parent===window || event.source!==window.parent || event.origin!==window.location.origin) return;\n  const data=event.data;\n  if(!data || data.type!=='self-study-hub-context') return;\n  applyHubStorageNamespace(data.storageNamespace);\n  initialiseListeningApp();\n});",'storage constants');

html=html.replaceAll('localStorage.getItem(STORE_KEY)','localStorage.getItem(storageKey())')
  .replaceAll('localStorage.setItem(STORE_KEY, JSON.stringify(st))','localStorage.setItem(storageKey(), JSON.stringify(st))')
  .replaceAll('__safeStorage.getItem(STORE_KEY)','__safeStorage.getItem(storageKey())')
  .replaceAll('__safeStorage.setItem(STORE_KEY, JSON.stringify(st))','__safeStorage.setItem(storageKey(), JSON.stringify(st))')
  .replaceAll('__safeStorage.removeItem(STORE_KEY)','__safeStorage.removeItem(storageKey())');

const oldInit=`function init(){
  setMode(getState().mode || 'practice');
  renderSectionButtons();
  openSection('ex1');
  renderResults();
  renderProgress();
  renderReview();
  initAudioHooks();
  updateModeUI();
  checkAudioReadiness();
}
init();`;
const newInit=`function initialiseListeningApp(){
  if(listeningAppInitialised) return;
  listeningAppInitialised=true;
  setMode(getState().mode || 'practice');
  renderSectionButtons();
  openSection('ex1');
  renderResults();
  renderProgress();
  renderReview();
  initAudioHooks();
  updateModeUI();
  checkAudioReadiness();
}
if(window.parent===window) initialiseListeningApp();`;
once(oldInit,newInit,'deferred init');
fs.writeFileSync(file,html);
