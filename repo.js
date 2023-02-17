const { Octokit } = require("@octokit/rest");
const github = new Octokit();

class Repo {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
  }

  // Return an array of matching open PRs vor a given SHA hash
  async getMatchingPrs(sha) {
    const allPRs = await github.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      open: true,
    });
    const matchingPRs = allPRs.data.filter((pr) => (pr.head.sha === sha));

    return matchingPRs;
  }
}

module.exports = Repo;