const core = require('@actions/core');
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const labelMergedToStaging = 'MergedInStaging'
const labelMergeConflictToStaging = 'MergeConflictInStaging'
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

try {
    run()
} catch (error) {
    core.setFailed(error.message);
}

async function run() {
    const pullRequestsList = await fetchStagingPRs();
    for (let index = 0; index < pullRequestsList.length; index++) {
        const pr = pullRequestsList[index];
        console.log(`Start Merging Pull Request "${pr.title}"`)
        try {
            const mergeResponse = await mergePRToStaging(pr.head.ref)
            console.log(mergeResponse.status)
            const labelResponse = await addLabelForMerge(pr.number, labelMergedToStaging)
            console.log(labelResponse.status)
        } catch(error) {
            if(error.response && error.response.status == 409) {
                console.log(`Merging Pull Request "${pr.title}" creates conflicts so don't do anything else with this branch.`)
                const labelResponse = await addLabelForMerge(pr.number, labelMergeConflictToStaging)
                console.log(labelResponse.status)
            } else {
                console.log(error)
            }
        }
    }
    console.log(`Finish merging all Staging PRs`)
  }

  async function fetchStagingPRs() {
    const data = await octokit.rest.pulls.list({
        owner,
        repo,
        state: "open", // only open PRs
      });
      return data.data.filter(pr => {
            return pr.draft !== true && pr.labels.some(l => l.name === "Staging") // Only PRs with 'Staging' label.
      });
  }

  async function addLabelForMerge(prNumber, label) {
    const response = await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: prNumber,
        labels: [
          label
        ]
      });
      return response;
  }

  async function mergePRToStaging(branchName) {
      // handle merge conflicts
    const response = await octokit.rest.repos.merge({
        owner,
        repo,
        base: 'stage', // merge Staging PR to Stage
        head: branchName,
      });
      return response;
  }