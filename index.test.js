const process = require('process');
const cp = require('child_process');
const path = require('path');
const Repo = require('./repo');

const repo = new Repo('stylesuxx', 'link-artifacts-in-pr-action');

test('invalid sha', async () => {
  const matchingPrs = await repo.getMatchingPrs('invalid');

  expect(matchingPrs.length).toEqual(0);
});

test('valid sha', async () => {
  const matchingPrs = await repo.getMatchingPrs('invalid');

  expect(matchingPrs.length).toEqual(1);
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = 100;
  const ip = path.join(__dirname, 'index.js');
  const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
  console.log(result);
});
