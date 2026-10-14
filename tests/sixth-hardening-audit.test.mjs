import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Listening reset removes state through the safe storage wrapper', () => {
  const start = html.indexOf('function resetAllAnswers()');
  const end = html.indexOf('\n}', start) + 2;
  const block = html.slice(start, end);
  assert.match(block, /__safeStorage\.removeItem\(storageKey\(\)\)/, 'reset should use __safeStorage.removeItem');
  assert.doesNotMatch(block, /localStorage\.removeItem\(storageKey\(\)\)/, 'reset must not bypass safe storage');
});
