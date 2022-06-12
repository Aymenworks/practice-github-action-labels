const core = require('@actions/core');
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

try {
const { data } = octokit.rest.pulls.list({
    owner,
    repo,
    state: open,
  });
  console.log(`PRs data ${data}!`);
  
} catch (error) {
  core.setFailed(error.message);
}