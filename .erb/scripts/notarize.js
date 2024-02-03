require('dotenv').config();
const { notarize } = require('@electron/notarize');
const { appId } = require('../../electron-builder.json');

exports.default = async function notarizeMacos(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    if (process.env.CI !== 'true') {
        console.warn('Skipping notarizing step. Packaging is not running in CI');
        return;
    }

    console.warn(process.env.APPLE_ID, process.env.APPLE_ID_PASS, process.env.APPLE_TEAM_ID);
    if (!('APPLE_ID' in process.env && 'APPLE_ID_PASS' in process.env && 'APPLE_TEAM_ID' in process.env)) {
        console.warn('Skipping notarizing step. APPLE_ID, APPLE_ID_PASS and APPLE_TEAM_ID env variables must be set');
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    await notarize({
        appBundleId: appId,
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASS,
        teamId: process.env.APPLE_TEAM_ID,
    });
};
