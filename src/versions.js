import { VersionNumber } from './models';

function parseVersion(version) {
    var splitted = new VersionNumber();

    var workVersion = version;
    if (workVersion.startsWith('v')) workVersion = workVersion.substring(1);

    splitted.fullVersionNumber = workVersion;

    splitted.majorNumber = workVersion.substring(0, workVersion.indexOf('.'));
    workVersion = workVersion.substring(splitted.majorNumber.length + 1);

    splitted.minorNumber = workVersion.substring(0, workVersion.indexOf('.'));
    workVersion = workVersion.substring(splitted.minorNumber.length + 1);

    splitted.patchNumber = workVersion;
    if (splitted.patchNumber.indexOf('-') > -1) {
        splitted.patchNumber = splitted.patchNumber.substring(0, splitted.patchNumber.indexOf('-'));

        workVersion = workVersion.substring(splitted.patchNumber.length + 1);
        splitted.preReleaseIdentifier = workVersion.substring(0, workVersion.indexOf('.'));

        workVersion = workVersion.substring(splitted.preReleaseIdentifier.length + 1);
        splitted.preReleaseNumber = workVersion.substring(0);

        splitted.isPreRelease = true;
    }

    return splitted;
}

module.exports = { parseVersion }