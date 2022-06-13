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
    const pullRequestsList = await fetchStagingPRs();
    for (let index = 0; index < pullRequestsList.length; index++) {
        const pr = pullRequestsList[index];
        console.log(`Merging pr ${pr.title}`)
        const response = await mergePRToStaging(pr.head.ref)
        console.log(`response status ${response.status}`)
    }
  }

  async function fetchStagingPRs() {
    const data = await octokit.rest.pulls.list({
        owner,
        repo,
        state: "open",
      });
      return data.data.filter(pr => {
            return pr.draft !== true && pr.labels.some(l => l.name === "Staging")
      });
  }

  async function mergePRToStaging(head) {
      // handle merge conflicts
    const response = await octokit.rest.repos.merge({
        owner,
        repo,
        base: 'stage',
        head,
      });
      return response;
  }