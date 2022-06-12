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
    const data = await fetchStagingPRs();
    data.forEach(pr => {
        console.log(`PR ${pr.title} url=${pr.url}, isDraft=${pr.draft == null || pr.draft == false}, prLabels=${pr.labels}, hasStaging=${pr.labels.some(l => l.name != undefined && l.name === "Staging")}`)
    });
    console.log("data=");
    console.log(data)
  }

  async function fetchStagingPRs() {
    const data = await octokit.rest.pulls.list({
        owner,
        repo,
        state: "open",
      });
      return data.data;
      return data.data.filter(pr => {
        (pr.draft == null || pr.draft == false) && pr.labels.includes({name: "Staging"})
      });
  }