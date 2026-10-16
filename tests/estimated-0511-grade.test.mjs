import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Listening Results shows a June 2026 0511 Component 22 grade only after all 40 questions', () => {
  assert.match(html, /Estimated 0511 listening grade/);
  assert.match(html, /estimate0511Component22Grade/);
  assert.match(html, /35\s*,\s*32\s*,\s*29\s*,\s*26\s*,\s*23\s*,\s*20\s*,\s*17/);
  assert.match(html, /done\s*>=\s*questions\.length/);
  assert.match(html, /June 2026/);
  assert.match(html, /not an official Cambridge result/i);
});

// Regression guard for the student-facing grade result.
