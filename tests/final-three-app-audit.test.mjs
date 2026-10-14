import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Listening Exam cannot be submitted until every question is answered', () => {
  assert.match(html, /function\s+finishExam\s*\([\s\S]*?if\s*\(\s*answered\s*!==\s*questions\.length\s*\)\s*\{[\s\S]*?return;[\s\S]*?\}/);
});

test('mode switching with answers asks before clearing the attempt', () => {
  assert.match(html, /function\s+setMode\s*\([\s\S]*?Object\.keys\(st\.answers\s*\|\|\s*\{\}\)\.length[\s\S]*?confirm\(/);
});

test('Reset answers asks before deleting an in-progress attempt', () => {
  assert.match(html, /function\s+resetAllAnswers\s*\([\s\S]*?confirm\(/);
});
