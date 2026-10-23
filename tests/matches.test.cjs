const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const filename = require.resolve('../src/matches.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const source = new Module(filename, module);
source._compile(compiled, filename);
const { parseMatches, filterMatches, matchStatus, matchDate } = source.exports;
const fixture = require('../data/matches.json');

test('all eight matches survive parsing, including zero scores and missing date', () => {
  const data = parseMatches(fixture);
  assert.equal(data.matches.length, 8);
  assert.deepEqual(data.matches[1].score, { home: 0, away: 0 });
  assert.equal(data.matches[6].startsAt, null);
});
test('filters use status, not the current date; postponed remains upcoming', () => {
  assert.deepEqual(filterMatches(fixture.matches, 'upcoming').map(m => m.id), ['m5', 'm6', 'm7', 'm8']);
  assert.deepEqual(filterMatches(fixture.matches, 'finished').map(m => m.id), ['m1', 'm2', 'm3']);
  assert.equal(filterMatches(fixture.matches, 'all').length, 8);
});
test('search checks both clubs, ignores case and spaces, combines with filter', () => {
  assert.equal(filterMatches(fixture.matches, 'all', '  СПАРТАК ').length, 1);
  assert.equal(filterMatches(fixture.matches, 'all', 'динамо').length, 2);
  assert.equal(filterMatches(fixture.matches, 'finished', 'Акрон').length, 0);
});
test('empty response is valid; malformed data and duplicate IDs are rejected', () => {
  assert.deepEqual(parseMatches({ round: 1, matches: [] }).matches, []);
  for (const value of [null, {}, { round: 1, matches: [null] },
    { round: 1, matches: [fixture.matches[0], fixture.matches[0]] },
    { round: 1, matches: [{ ...fixture.matches[0], score: { home: -1, away: 0 } }] }]) {
    assert.throws(() => parseMatches(value));
  }
});
test('unknown status stays visible in All; live minute zero is preserved', () => {
  const unknown = { ...fixture.matches[0], status: 'cancelled' };
  assert.equal(filterMatches([unknown], 'all').length, 1);
  assert.equal(filterMatches([unknown], 'finished').length, 0);
  assert.equal(matchStatus(unknown), 'Статус уточняется');
  assert.equal(matchStatus({ ...unknown, status: 'live', minute: 0 }), 'Идёт матч · 0 мин');
});
test('null and invalid date never become the Unix epoch or Invalid Date', () => {
  assert.equal(matchDate(null), 'Дата и время уточняются');
  assert.equal(matchDate('bad date'), 'Дата и время уточняются');
});
test('dates use the device timezone, including a date boundary', () => {
  const previous = process.env.TZ;
  process.env.TZ = 'Asia/Yekaterinburg';
  try {
    assert.match(matchDate('2026-10-11T22:30:00Z'), /12 окт.*03:30/);
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
