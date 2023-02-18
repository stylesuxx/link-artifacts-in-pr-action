const core = require('@actions/core');
const github = require('@actions/github');
const Repo = require('./repo');

// most @actions toolkit packages have async methods
async function run() {
  try {
    // Variables from context
    const contextOwner = github.context.repo.owner;
    const contextRepo = github.context.repo.repo;
    const contextSuiteId = github.context.payload.workflow_run.check_suite_id;
    const contextRunId = github.context.payload.workflow_run.id;
    const contextSha = github.context.payload.workflow_run.head_sha;

    // Variables set by user
    const artifactNameWhitelist = JSON.parse(core.getInput('whitelist')) || [];
    const token = core.getInput('token');

    const repo = new Repo(contextOwner, contextRepo, token);

    core.info(`Searching ${contextOwner}/${contextRepo} for related PR with sha: ${contextSha}`);
    const matchingPrs = await repo.getMatchingPrs(contextSha);

    if(matchingPrs.length > 0) {
      const pr = matchingPrs[0].number;
      core.info(`Found matching PR #${pr}`);

      const allArtifacts = await repo.getAllArtifacts(contextRunId);
      core.info(`Found ${allArtifacts.length} artifact for run ${contextRunId}`);

      if(allArtifacts.length > 0) {
        core.info(`Building message - whitelist contains ${artifactNameWhitelist.length} items`);
        const body = repo.buildComment(allArtifacts, contextSuiteId, artifactNameWhitelist);
        if(body) {
          await repo.postComment(pr, body);

          core.info(`Linked build artifact(s) in PR #${pr}`);
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
