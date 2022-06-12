const core = require('@actions/core');
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

try {
    run()
} catch (error) {
    core.setFailed(error.message);
}

async function run() {
    console.log(`owner=${owner}, repo=${repo}`);
    const data = await fetchPRs();
    console.log("data=");
    console.log(data)
  }

  async function fetchPRs() {
    const data = await octokit.rest.pulls.list({
        owner,
        repo,
        state: "open",
      });
      return data;
  }