import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const replacements = [
  [
    "function defaultState(){ return { mode:'practice', answers:{}, examSubmitted:false, playCounts:{} }; }",
    "function defaultState(){ return { mode:'practice', answers:{}, examSubmitted:false, practiceReviewRevealed:false, playCounts:{} }; }"
  ],
  [
    '<div id="reviewList"></div>',
    `<div id="practiceReviewControls" style="margin-bottom:12px;display:none">
        <button class="btn secondary" id="revealPracticeReviewBtn" onclick="togglePracticeReviewAnswers()">Reveal answers and explanations</button>
        <div class="notice plum" id="practiceReviewNotice" style="margin-top:10px"></div>
      </div>
      <div id="reviewList"></div>`
  ],
  [
    "function renderReview(){\n  const st=getState(), box=document.getElementById('reviewList');",
    "function renderReview(){\n  const st=getState(), box=document.getElementById('reviewList');\n  const controls=document.getElementById('practiceReviewControls');\n  const revealBtn=document.getElementById('revealPracticeReviewBtn');\n  const reviewNotice=document.getElementById('practiceReviewNotice');"
  ],
  [
    "  if(st.mode==='exam' && !st.examSubmitted){\n    box.innerHTML='<div class=\\\"exam-lock\\\"><strong>Review locked during Exam Mode.</strong><br>Submit the paper to reveal correct answers and explanations.</div>';\n    return;\n  }\n  const entries=Object.entries(st.answers).sort((a,b)=>Number(a[0])-Number(b[0]));",
    "  if(st.mode==='exam' && !st.examSubmitted){\n    if(controls) controls.style.display='none';\n    box.innerHTML='<div class=\\\"exam-lock\\\"><strong>Review locked during Exam Mode.</strong><br>Submit the paper to reveal correct answers and explanations.</div>';\n    return;\n  }\n  const practiceComplete=Object.keys(st.answers).length===questions.length;\n  const showFullReview=st.mode==='exam' ? st.examSubmitted : practiceComplete && !!st.practiceReviewRevealed;\n  if(controls) controls.style.display=st.mode==='practice' ? '' : 'none';\n  if(st.mode==='practice' && revealBtn){\n    revealBtn.disabled=!practiceComplete;\n    revealBtn.textContent=showFullReview ? 'Hide answers and explanations' : 'Reveal answers and explanations';\n  }\n  if(st.mode==='practice' && reviewNotice){\n    const answered=Object.keys(st.answers).length;\n    reviewNotice.textContent=!practiceComplete\n      ? 'Full answer review unlocks after the whole paper is completed. ('+answered+'/'+questions.length+' answered)'\n      : showFullReview ? 'Full answer review is visible.' : 'Paper complete. You can now reveal the correct answers and explanations.';\n  }\n  const entries=Object.entries(st.answers).sort((a,b)=>Number(a[0])-Number(b[0]));"
  ],
  [
    "    return '<div class=\\\"review-item '+(val.correct?'good':'bad')+'\\\"><div><strong>Question '+q.n+'</strong> · '+q.prompt+'</div><div class=\\\"kv\\\"><strong>Your answer:</strong> '+val.choice+'</div><div class=\\\"kv\\\"><strong>Correct answer:</strong> '+q.answer+'</div><div class=\\\"kv\\\"><strong>Explanation:</strong> '+q.explain+'</div></div>';",
    "    return '<div class=\\\"review-item '+(showFullReview ? (val.correct?'good':'bad') : '')+'\\\"><div><strong>Question '+q.n+'</strong> · '+q.prompt+'</div><div class=\\\"kv\\\"><strong>Your answer:</strong> '+val.choice+'</div>'+(showFullReview ? '<div class=\\\"kv\\\"><strong>Correct answer:</strong> '+q.answer+'</div><div class=\\\"kv\\\"><strong>Explanation:</strong> '+q.explain+'</div>' : '<div class=\\\"kv\\\"><strong>Correct answer:</strong> Hidden until revealed</div>')+'</div>';"
  ],
  [
    "}\nfunction resetAllAnswers(){ localStorage.removeItem(STORE_KEY); setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); }",
    "}\nfunction togglePracticeReviewAnswers(){\n  const st=getState();\n  if(st.mode!=='practice') return;\n  const practiceComplete=Object.keys(st.answers).length===questions.length;\n  if(!practiceComplete) return;\n  st.practiceReviewRevealed=!st.practiceReviewRevealed;\n  saveState(st);\n  renderReview();\n}\nfunction resetAllAnswers(){ localStorage.removeItem(STORE_KEY); setMode('practice'); renderSectionButtons(); openSection(currentSectionId || 'ex1'); renderResults(); renderProgress(); renderReview(); }"
  ],
  [
    "    st.examSubmitted=false;\n    st.playCounts={};",
    "    st.examSubmitted=false;\n    st.practiceReviewRevealed=false;\n    st.playCounts={};"
  ]
];

for (const [before, after] of replacements) {
  if (!html.includes(before)) {
    throw new Error('Expected source block not found:\n' + before.slice(0, 180));
  }
  html = html.replace(before, after);
}

fs.writeFileSync(file, html);
