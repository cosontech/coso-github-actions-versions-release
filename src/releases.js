import { getCurrentBranchName } from './gitBranches';

const core = require('@actions/core');
const github = require('@actions/github');

const myToken = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(myToken);
const currentBranch = getCurrentBranchName();

//name format: v%version number
//search release
//if not found, create the release
//if found, update the targeted commit
export async function createOrUpdateRelease(name, isPreRelease, generateReleaseNotes) {
    await octokit.rest.repos.getReleaseByTag({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        tag: name
    })
        .catch((error) => {
            if (error.status !== 404) throw error;
        })
        .then(async (response) => {
            if (!response || response.status === 404) {
                console.log(`Release ${name} has not been found, create it`);
                const creationResult = await octokit.rest.repos.createRelease({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    tag_name: name,
                    target_commitish: currentBranch,
                    name: name,
                    prerelease: isPreRelease,
                    generate_release_notes: generateReleaseNotes
                });

                if (creationResult.status !== 201) {
                    core.setFailed(`Status returned for the creation of the major release is ${updateResult.status}`);
                }
                else {
                    console.log(`Release ${name} has been created`);
                }
            }
            else {
                console.log(`Release ${name} has been found, update it`);

                var refUri = `tags/${name}`;
                const updateResult = await octokit.rest.git.updateRef({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    ref: refUri,
                    sha: github.context.sha,
                    force: true
                });

                if (updateResult.status !== 200) {
                    core.setFailed(`Status returned for the update of the major release is ${updateResult.status}`);
                }
                else {
                    console.log(`Release ${name} has been updated`);
                }
            }
        }
    );
}