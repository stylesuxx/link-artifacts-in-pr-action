const Repo = require('./repo');

const suiteId = '123456'
const sha = '2f3fe53fdbc85bf46e3f810e53dc6547a2d9c4bc';

const repo = new Repo('stylesuxx', 'link-artifacts-in-pr-action');
const artifactsMock = [
  {
    id: 12345678,
    name: 'artifact-1',
    expires_at: '2023-05-18T14:29:30Z'
  },
  {
    id: 12345679,
    name: 'artifact-2',
    expires_at: '2023-05-18T14:29:30Z'
  }
];

test('invalid SHA', async () => {
  const matchingPrs = await repo.getMatchingPrs('invalid');

  expect(matchingPrs.length).toEqual(0);
});

test('find PR for valid SHA', async () => {
  const matchingPrs = await repo.getMatchingPrs(sha);

  expect(matchingPrs.length).toEqual(1);
});

test('no comment without artifacts', async () => {
  const body = repo.buildComment([]);

  expect(body).toEqual(null);
});

/*
// This test can only be run with a workflow run that has artifacts still attached
test('find artifacts', async () => {
  const repo = new Repo('stylesuxx', 'gh-action-tester');

  const runId = 4204678673;
  const allArtifacts = await repo.getAllArtifacts(runId);
  console.log(allArtifacts);

  expect(allArtifacts.length).toEqual(1);
});
*/

test('build message for all artifact', async () => {
  const body = repo.buildComment(artifactsMock, suiteId);

  expect(body).toEqual(`Build artifacts:
 - [Download artifact-1](https://github.com/stylesuxx/link-artifacts-in-pr-action/suites/123456/artifacts/12345678) (Expires on 2023-5-18)
 - [Download artifact-2](https://github.com/stylesuxx/link-artifacts-in-pr-action/suites/123456/artifacts/12345679) (Expires on 2023-5-18)
`);
});

test('build message for single white-listed artifact', async () => {
  const body = repo.buildComment(artifactsMock, suiteId, ['artifact-1']);

  expect(body).toEqual(`Build artifacts:
 - [Download artifact-1](https://github.com/stylesuxx/link-artifacts-in-pr-action/suites/123456/artifacts/12345678) (Expires on 2023-5-18)
`);
});

test('no message for non white listed artifact', async () => {
  const body = repo.buildComment(artifactsMock, suiteId, ['missing']);

  expect(body).toEqual(null);
});