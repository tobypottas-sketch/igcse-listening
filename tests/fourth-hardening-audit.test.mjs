import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function parseConst(name, nextName){
  const re = new RegExp(`const ${name} = (.*?);\\nconst ${nextName} =`, 's');
  const m = html.match(re);
  assert.ok(m, `${name} should be parseable`);
  return JSON.parse(m[1]);
}

const sections = parseConst('sections', 'questions');
const questions = parseConst('questions', 'transcripts');
const transcriptMatch = html.match(/const transcripts = (\{.*?\});\s*const /s);
assert.ok(transcriptMatch, 'transcripts should be parseable');
const transcripts = JSON.parse(transcriptMatch[1]);

test('Listening question bank is structurally complete', () => {
  assert.equal(questions.length, 40);
  assert.deepEqual(questions.map(q => q.n), Array.from({length:40}, (_,i)=>i+1));
  const sectionIds = new Set(sections.map(s => s.id));
  for(const q of questions){
    assert.ok(sectionIds.has(q.section), `Q${q.n} has a valid section`);
    assert.ok(Object.hasOwn(q.options, q.answer), `Q${q.n} answer exists in its options`);
  }
  assert.deepEqual(
    Object.fromEntries(sections.map(s => [s.id, questions.filter(q => q.section === s.id).length])),
    {ex1:8, ex2:10, ex3:8, ex4:6, ex5:8}
  );
});

test('every Listening section has a non-empty transcript', () => {
  for(const section of sections){
    assert.equal(typeof transcripts[section.id], 'string');
    assert.ok(transcripts[section.id].trim().length > 100, `${section.id} transcript is substantial`);
  }
});

test('Listening has no remote network egress or dynamic code execution', () => {
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /XMLHttpRequest|sendBeacon|WebSocket|EventSource/);
  assert.doesNotMatch(html, /\beval\s*\(|new\s+Function\s*\(/);
});

test('embedded Listening accepts Hub context only from its same-origin parent', () => {
  assert.match(html, /event\.source\s*!==\s*window\.parent/);
  assert.match(html, /event\.origin\s*!==\s*window\.location\.origin/);
});
