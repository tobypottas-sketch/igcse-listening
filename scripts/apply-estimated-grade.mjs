import fs from 'node:fs';
const path='index.html';
let html=fs.readFileSync(path,'utf8');
if(html.includes('id="scoreGrade"')) process.exit(0);
function once(a,b,label){if(!html.includes(a)) throw new Error(`Missing patch anchor: ${label}`); html=html.replace(a,b);}
const card='<div class="stat"><div class="v" id="scorePercent">0%</div><div>Accuracy</div></div>';
once(card,card+'\n        <div class="stat"><div class="v" id="scoreGrade">—</div><div>Estimated 0511 listening grade</div><div class="small" style="margin-top:6px">June 2026 · Component 22 · practice estimate, not an official Cambridge result</div></div>','grade card');
const anchor='function renderResults(){';
const helper=`function estimate0511Component22Grade(percent){\n  const thresholds=[35,32,29,26,23,20,17];\n  const grades=['A','B','C','D','E','F','G'];\n  const raw=(Number(percent)||0)*40/100;\n  for(let i=0;i<thresholds.length;i++){ if(raw>=thresholds[i]) return grades[i]; }\n  return 'U';\n}\n\n`;
once(anchor,helper+anchor,'helper');
const vals="  const vals=Object.values(st.answers), done=vals.length, correct=vals.filter(v=>v.correct).length, wrong=vals.filter(v=>!v.correct).length, pct=done?Math.round(correct/done*100):0;";
once(vals,vals+"\n  const gradeComplete = questions.length>0 && done >= questions.length;",'completion');
const pctLine="  document.getElementById('scorePercent').textContent=String(pct)+'%';";
if(html.includes(pctLine)) once(pctLine,pctLine+"\n  document.getElementById('scoreGrade').textContent=gradeComplete?estimate0511Component22Grade(pct):'—';",'grade render');
else {
  const alt="  document.getElementById('scorePercent').textContent=pct+'%';";
  once(alt,alt+"\n  document.getElementById('scoreGrade').textContent=gradeComplete?estimate0511Component22Grade(pct):'—';",'grade render alt');
}
fs.writeFileSync(path,html);
