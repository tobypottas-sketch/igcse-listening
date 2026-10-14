import fs from 'node:fs';
const file='index.html';
let html=fs.readFileSync(file,'utf8');

const setStart=html.indexOf('function setMode(mode){');
const setEnd=html.indexOf('\nfunction updateModeUI(){',setStart);
if(setStart<0||setEnd<0) throw new Error('setMode block not found');
let setBlock=html.slice(setStart,setEnd);
setBlock=setBlock
  .replace("if(changed && Object.keys(st.answers || {}).length && !window.confirm('Switch mode? This will clear the current listening attempt.')) return;","if(changed && Object.keys(st.answers || {}).length && !window.confirm('Switch mode? This will clear the current listening attempt.')) return false;")
  .replace('  updateModeUI();\n}', '  updateModeUI();\n  return true;\n}');
html=html.slice(0,setStart)+setBlock+html.slice(setEnd);

const resetStart=html.indexOf('function resetAllAnswers(){');
const resetEnd=html.indexOf('\n\nfunction playCurrentSection(){',resetStart);
if(resetStart<0||resetEnd<0) throw new Error('resetAllAnswers block not found');
let resetBlock=html.slice(resetStart,resetEnd);
resetBlock=resetBlock
  .replace("if(Object.keys(st.answers || {}).length && !window.confirm('Reset all listening answers and start again?')) return;","if(Object.keys(st.answers || {}).length && !window.confirm('Reset all listening answers and start again?')) return false;")
  .replace('localStorage.removeItem(STORE_KEY);','localStorage.removeItem(storageKey());')
  .replace(' renderReview();\n}', ' renderReview();\n  return true;\n}');
html=html.slice(0,resetStart)+resetBlock+html.slice(resetEnd);

fs.writeFileSync(file,html);
