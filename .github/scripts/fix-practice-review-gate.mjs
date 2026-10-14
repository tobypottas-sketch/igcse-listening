import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const replacements = [
  [
    `function defaultState(){ return { mode:'practice', answers:{}, examSubmitted:false, playCounts:{} }; }`,
    `function defaultState(){ return { mode:'practice', answers:{}, examSubmitted:false, practiceReviewRevealed:false, playCounts:{} }; }`
  ],
  [
    `<div id="reviewList"></div>`,
    `<div id="practiceReviewControls" style="margin-bottom:12px;display:none">
        <button class="btn secondary" id="revealPracticeReviewBtn" onclick="togglePracticeReviewAnswers()">Reveal answers and explanations</button>
        <div class="notice plum" id="practiceReviewNotice" style="margin-top:10px"></div>
      </div>
      <div id="reviewList"></div>`
  ],
  [
    `function renderReview(){
  const st=getState(), box=document.getElementById('reviewList');`,
    `function renderReview(){
  const st=getState(), box=document.getElementById('reviewList');
  const controls=document.getElementById('practiceReviewControls');
  const revealBtn=document.getElementById('revealPracticeReviewBtn');
  const reviewNotice=document.getElementById('practiceReviewNotice');`
  ],
  [
    `  if(st.mode==='exam' && !st.examSubmitted){
    box.innerHTML='<div class="exam-lock"><strong>Review locked during Exam Mode.</strong><br>Submit the paper to reveal correct answers and explanations.</div>';
    return;
  }
  const entries=Object.entries(st.answers).sort((a,b)=>Number(a[0])-Number(b[0]));`,
    `  if(st.mode==='exam' && !st.examSubmitted){
    if(controls) controls.style.display='none';
    box.innerHTML='<div class="exam-lock"><strong>Review locked during Exam Mode.</strong><br>Submit the paper to reveal correct answers and explanations.</div>';
    return;
  }
  const practiceComplete=Object.keys(st.answers).length===questions.length;
  const showFullReview=st.mode==='exam' ? st.examSubmitted : practiceComplete && !!st.practiceReviewRevealed;
  if(controls) controls.style.display=st.mode==='practice' ? '' : 'none';
  if(st.mode==='practice' && revealBtn){
    revealBtn.disabled=!practiceComplete;
    revealBtn.textContent=showFullReview ? 'Hide answers and explanations' : 'Reveal answers and explanations';
  }
  if(st.mode==='practice' && reviewNotice){
    const answered=Object.keys(st.answers).length;
    reviewNotice.textContent=!practiceComplete
      ? 'Full answer review unlocks after the whole paper is completed. ('+answered+'/'+questions.length+' answered)'
      : showFullReview ? 'Full answer review is visible.' : 'Paper complete. You can now reveal the correct answers and explanations.';
  }
  const entries=Object.entries(st.answers).sort((a,b)=>Number(a[0])-Number(b[0]));`
  ],
  [
    `    return '<div class="review-item '+(val.correct?'good':'bad')+'"><div><strong>Question '+q.n+'</strong> · '+q.prompt+'</div><div class="kv"><strong>Your answer:</strong> '+val.choice+'</div><div class="kv"><strong>Correct answer:</strong> '+q.answer+'</div><div class="kv"><strong>Explanation:</strong> '+q.explain+'</div></div>';`,
    `    return '<div class="review-item '+(showFullReview ? (val.correct?'good':'bad') : '')+'"><div><strong>Question '+q.n+'</strong> · '+q.prompt+'</div><div class="kv"><strong>Your answer:</strong> '+val.choice+'</div>'+(showFullReview ? '<div class="kv"><strong>Correct answer:</strong> '+q.answer+'</div><div class="kv"><strong>Explanation:</strong> '+q.explain+'</div>' : '<div class="kv"><strong>Correct answer:</strong> Hidden until revealed</div>')+'</div>';`
  ],
  [
    `}
function resetAllAnswers(){ localStorage.removeItem(STORE_KEY); setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); }`,
    `}
function togglePracticeReviewAnswers(){
  const st=getState();
  if(st.mode!=='practice') return;
  const practiceComplete=Object.keys(st.answers).length===questions.length;
  if(!practiceComplete) return;
  st.practiceReviewRevealed=!st.practiceReviewRevealed;
  saveState(st);
  renderReview();
}
function resetAllAnswers(){ localStorage.removeItem(STORE_KEY); setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); }`
  ],
  [
    `    st.examSubmitted=false;
    st.playCounts={};`,
    `    st.examSubmitted=false;
    st.practiceReviewRevealed=false;
    st.playCounts={};`
  ]
];

for (const [before, after] of replacements) {
  if (!html.includes(before)) {
    throw new Error('Expected source block not found:\n' + before.slice(0, 180));
  }
  html = html.replace(before, after);
}

fs.writeFileSync(file, html);
