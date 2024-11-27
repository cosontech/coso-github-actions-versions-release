const core = require('@actions/core');
const { parseVersion } = require('./versions');
const { createOrUpdateRelease } = require('./releases');

// ****INPUTS****

const versionNumber = core.getInput('version-number');
const updateMajorRelease = core.getInput('update-major-release');
const createVersionRelease = core.getInput('create-version-release');

// ****EXECUTION****

try {
    console.log(`Current version: ${versionNumber}`);

    //parse current version of the release
    const parsed = parseVersion(versionNumber);

    if (parsed.isPreRelease) console.log('Pre-Release detected');
    else console.log('Finale Release detected');

    if (createVersionRelease === 'true') {
        createOrUpdateRelease(`v${versionNumber}`, parsed.isPreRelease, true);
    }
    else {
        console.log(`Creation of a release for the version v${versionNumber} has not been requested`);
    }
    
    if (updateMajorRelease === 'true' && !parsed.isPreRelease) {
        createOrUpdateRelease(`v${parsed.majorNumber}`, false, false);
    }
    else {
        if (parsed.isPreRelease) console.log("Current version is a pre-release, the major release won't be updated");
        else console.log(`The update of the major release v${parsed.majorNumber} has not been requested`);
    }
}
catch (error) {
    core.setFailed(error);
}
