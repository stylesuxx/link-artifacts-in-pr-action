const { Octokit } = require("@octokit/rest");

class Repo {
  constructor(owner, repo, auth) {
    this.owner = owner;
    this.repo = repo;
    this.github = new Octokit({ auth });
  }

  // Return an array of matching open PRs vor a given SHA hash
  async getMatchingPrs(sha) {
    const allPRs = await this.github.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      open: true,
    });
    const matchingPRs = allPRs.data.filter((pr) => (pr.head.sha === sha));

    return matchingPRs;
  }

  // Return an array of all artifacts for a given workflow run
  async getAllArtifacts(runId) {
    const allArtifacts = await this.github.rest.actions.listWorkflowRunArtifacts({
      owner: this.owner,
      repo: this.repo,
      run_id: runId,
   });

    return allArtifacts.data.artifacts;
  }

  // Post comment to a given PR
  async postComment(pr, body) {
    await this.github.rest.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: pr,
      body: body
    });
  }

  buildComment(artifacts, suiteId, whitelist = []) {
    let body = 'Build artifacts:\n';

    let artifactCount = 0;
    for(let i = 0; i < artifacts.length; i += 1) {
      const artifact = artifacts[i];

      // If whitelist present and artifact not in it - continue
      const artifactName = artifact.name;
      if(whitelist.length > 0 && !whitelist.includes(artifactName)) {
        continue;
      }

      const artifactId = artifact.id;
      const expirationDate = new Date(artifact.expires_at);
      const formattedExpirationDate = `${expirationDate.getFullYear()}-${(expirationDate.getMonth()+1)}-${expirationDate.getDate()}`;
      const artifactUrl = `https://github.com/${this.owner}/${this.repo}/suites/${suiteId}/artifacts/${artifactId}`;

      body += ` - [Download ${artifactName}](${artifactUrl}) (Expires on ${formattedExpirationDate})\n`;

      artifactCount += 1;
    }

    return (artifactCount > 0) ? body : null;
  }
}

module.exports = Repo;