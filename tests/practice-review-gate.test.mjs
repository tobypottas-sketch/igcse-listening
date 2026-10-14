import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Practice Review has an explicit completion-gated reveal control', () => {
  assert.match(html, /practiceReviewRevealed\s*:\s*false/);
  assert.match(html, /id="revealPracticeReviewBtn"/);
  assert.match(html, /function togglePracticeReviewAnswers\(/);
  assert.match(html, /Object\.keys\(st\.answers\)\.length===questions\.length/);
});

test('Practice Review hides answer-key content until legitimately revealed', () => {
  assert.match(html, /showFullReview\s*=\s*st\.mode==='exam'\s*\?\s*st\.examSubmitted\s*:\s*practiceComplete\s*&&\s*!!st\.practiceReviewRevealed/);
  assert.match(html, /Correct answer:<\/strong> Hidden until revealed/);
  assert.match(html, /showFullReview\s*\?[^;]*q\.answer/s);
  assert.match(html, /showFullReview\s*\?[^;]*q\.explain/s);
});

test('switching mode resets Practice Review reveal state', () => {
  assert.match(html, /st\.practiceReviewRevealed=false/);
});
