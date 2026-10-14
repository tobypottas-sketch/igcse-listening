import fs from 'node:fs';

const file='index.html';
let html=fs.readFileSync(file,'utf8');

function replaceOnce(before,after,label){
  if(html.includes(after)) return;
  if(!html.includes(before)) throw new Error(`Missing ${label} anchor`);
  html=html.replace(before,after);
}

replaceOnce(
`  const answered=Object.keys(st.answers).length;
  const msg='Finish and submit this listening paper? You have answered '+answered+' of '+questions.length+' questions. Results, Review and transcripts will then unlock.';
  if(!window.confirm(msg)) return;`,
`  const answered=Object.keys(st.answers).length;
  if(answered!==questions.length){
    const notice=document.getElementById('audioNotice');
    if(notice) notice.textContent='Complete all '+questions.length+' questions before submitting Exam Mode. ('+answered+'/'+questions.length+' answered)';
    return;
  }
  if(!window.confirm('Finish and submit this listening paper? Your answers will be locked and feedback will unlock.')) return;`,
'finishExam completeness');

replaceOnce(
`  const changed = st.mode !== mode;
  if(changed){`,
`  const changed = st.mode !== mode;
  if(changed && Object.keys(st.answers || {}).length && !window.confirm('Switch mode? This will clear the current listening attempt.')) return;
  if(changed){`,
'mode-switch confirmation');

replaceOnce(
`function resetAllAnswers(){ localStorage.removeItem(STORE_KEY); setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); }`,
`function resetAllAnswers(){
  const st=getState();
  if(Object.keys(st.answers || {}).length && !window.confirm('Reset all listening answers and start again?')) return;
  localStorage.removeItem(STORE_KEY); setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview();
}`,
'primary reset confirmation');

replaceOnce(
`resetAllAnswers = function(){
  window.__safeStorage.removeItem(STORE_KEY);
  setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); updateModeUI();
};`,
`resetAllAnswers = function(){
  const st=getState();
  if(Object.keys(st.answers || {}).length && !window.confirm('Reset all listening answers and start again?')) return;
  window.__safeStorage.removeItem(STORE_KEY);
  setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); updateModeUI();
};`,
'safe-storage reset confirmation');

fs.writeFileSync(file,html);
