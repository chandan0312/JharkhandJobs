import assert from 'assert';

// Test placeholder converter logic
function translateSql(sqlText, params = []) {
  let sql = sqlText.trim();
  let transformedParams = Array.isArray(params) ? [...params] : [];

  const hasReturning = /RETURNING\s+\*/i.test(sql);
  if (hasReturning) {
    sql = sql.replace(/RETURNING\s+\*/gi, '').trim();
  }

  sql = sql.replace(/::[a-zA-Z_]+/g, '');
  sql = sql.replace(/\bILIKE\b/gi, 'LIKE');

  if (/\$[0-9]+/.test(sql)) {
    const orderedParams = [];
    sql = sql.replace(/\$([0-9]+)/g, (match, index) => {
      const paramIdx = parseInt(index, 10) - 1;
      if (paramIdx >= 0 && paramIdx < params.length) {
        orderedParams.push(params[paramIdx]);
      } else {
        orderedParams.push(null);
      }
      return '?';
    });
    transformedParams = orderedParams;
  }

  const sanitizedParams = transformedParams.map(param => {
    if (param === undefined) return null;
    if (param !== null && typeof param === 'object' && !(param instanceof Date) && !Buffer.isBuffer(param)) {
      return JSON.stringify(param);
    }
    return param;
  });

  return { sql, sanitizedParams };
}

console.log('Testing SQL Translation for MySQL compatibility...');

// Test 1: $1, $2 placeholders and ILIKE
const t1 = translateSql('SELECT * FROM jobs WHERE category = $1 AND location ILIKE $2', ['Govt Jobs', '%Ranchi%']);
assert.strictEqual(t1.sql, 'SELECT * FROM jobs WHERE category = ? AND location LIKE ?');
assert.deepStrictEqual(t1.sanitizedParams, ['Govt Jobs', '%Ranchi%']);
console.log('✅ Test 1 Passed: Placeholders and ILIKE conversion');

// Test 2: ::integer cast removal
const t2 = translateSql('SELECT type AS "_id", COUNT(*)::integer AS "count" FROM jobs GROUP BY type', []);
assert.strictEqual(t2.sql, 'SELECT type AS "_id", COUNT(*) AS "count" FROM jobs GROUP BY type');
console.log('✅ Test 2 Passed: Typecast removal');

// Test 3: RETURNING * removal and JSON serialization
const t3 = translateSql(
  'INSERT INTO jobs (id, title, responsibilities) VALUES ($1, $2, $3) RETURNING *',
  ['job-1', 'Teacher', ['Teach students', 'Evaluate exams']]
);
assert.strictEqual(t3.sql, 'INSERT INTO jobs (id, title, responsibilities) VALUES (?, ?, ?)');
assert.deepStrictEqual(t3.sanitizedParams, ['job-1', 'Teacher', JSON.stringify(['Teach students', 'Evaluate exams'])]);
console.log('✅ Test 3 Passed: RETURNING * stripped and JSON arrays serialized');

console.log('\n🎉 All SQL translation tests passed successfully!');
