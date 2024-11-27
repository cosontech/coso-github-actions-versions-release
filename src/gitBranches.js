const github = require('@actions/github');

function getBranchName(value) {
    if (value?.startsWith('refs/heads/')) {
        return value.substring(11);
    }
    else {
        return value ?? 'local';
    }
}

function getCurrentBranchName() {
    return getBranchName(github.context.payload.ref);
}

module.exports = { getBranchName, getCurrentBranchName }