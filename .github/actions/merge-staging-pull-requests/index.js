const core = require('@actions/core');
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

try {
const data = await fetchPRs();
  console.log(`PRs data ${data}!`);
  console.log(data);
  
} catch (error) {
  core.setFailed(error.message);
}

async function fetchPRs() {
    const data = await octokit.rest.pulls.list({
        owner,
        repo,
        state: "open",
      });
      return data
  }