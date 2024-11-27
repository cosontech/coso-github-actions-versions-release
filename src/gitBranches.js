const github = require('@actions/github');

export function getBranchName(value) {
    if (value?.startsWith('refs/heads/')) {
        return value.substring(11);
    }
    else {
        return value ?? 'local';
    }
}

export function getCurrentBranchName() {
    return getBranchName(github.context.payload.ref);
}
