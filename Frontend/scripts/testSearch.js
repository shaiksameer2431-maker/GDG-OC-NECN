import { matchesSearchQuery } from '../src/utils/searchHelper.js';

console.log('Testing search matching logic:');

function test(query, name, expected) {
  const result = matchesSearchQuery(query, name);
  const status = result === expected ? 'PASS' : 'FAIL';
  console.log(`[${status}] Query: "${query}" vs "${name}" => got ${result}, expected ${expected}`);
  if (result !== expected) {
    process.exit(1);
  }
}

// 1. Shaik sameer vs Sameer Shaik (User's exact request!)
test('Shaik sameer', 'Sameer Shaik', true);
test('sameer shaik', 'Shaik Sameer', true);
test('shaik sameer', 'Shaik Mohammad Sameer', true);
test('sameer shaik', 'Shaik Sameer Basha', true);
test('Shaik sameer', 'Shaik Sameer', true);

// 2. Partial tokens
test('shaik', 'Sameer Shaik', true);
test('sameer', 'Sameer Shaik', true);

// 3. Punctuation & spacing
test('ch naga', 'CH. Naga Venkata Harshini', true);
test('naga ch', 'CH. Naga Venkata Harshini', true);
test('harshini ch', 'CH. Naga Venkata Harshini', true);

// 4. Non-matches
test('Shaik sameer', 'BELLAMKONDA VENKATA SAKETH', false);
test('Shaik sameer', 'Shaik Sharukh', false);
test('sameer basha', 'Sameer Shaik', false);

// 5. Empty query
test('', 'Sameer Shaik', true);
test('   ', 'Sameer Shaik', true);

console.log('All search test assertions passed successfully!');
