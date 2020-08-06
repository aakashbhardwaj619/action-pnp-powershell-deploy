import * as core from '@actions/core';
import { existsSync } from 'fs';
import PowerShellToolRunner from './PowerShellToolRunner';

async function main() {
    try {
        const siteUrl: string = core.getInput("SHAREPOINT_SITE_URL", { required: true });
        const username: string = core.getInput("ADMIN_USERNAME", { required: true });
        const password: string = core.getInput("ADMIN_PASSWORD", { required: true });
        const appFilePath: string = core.getInput("APP_FILE_PATH", { required: true });
        const overwrite: string = core.getInput("OVERWRITE", { required: false }) == "true" ? "-Overwrite" : "";
        const scope: string = core.getInput("SCOPE", { required: false }).toLowerCase() == "site" ? "Site" : "Tenant";
        const skipFeatureDeployment: string = core.getInput("SKIP_FEATURE_DEPLOYMENT", { required: false }) == "true" ? "-SkipFeatureDeployment" : "";

        if (!existsSync(appFilePath)) {
            throw new Error("Please check if the app file path - APP_FILE_PATH - is correct.");
        }

        core.info("ℹ️ Starting deployment...");

        await PowerShellToolRunner.init();

        const script = `$ErrorActionPreference = "Stop"
            $WarningPreference = "SilentlyContinue"
            Install-Module -Name SharePointPnPPowerShellOnline -Force -Verbose -Scope CurrentUser
            $encpassword = convertto-securestring -String ${password} -AsPlainText -Force
            $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist ${username}, $encpassword
            Write-Output "Connecting to SharePoint Online. Site Url: ${siteUrl}, Username: ${username}"
            Connect-PnPOnline -Url ${siteUrl} -Credentials $cred
            Write-Output "Connected."
            $appId = Add-PnPApp -Path ${appFilePath} ${overwrite} ${skipFeatureDeployment} -Scope ${scope} -Publish
            Write-Output "App $($appId.Id) deployed."`;

        await PowerShellToolRunner.executePowerShellScriptBlock(script);

        core.info("✅ App deployment successful.");
    } catch (err) {
        core.error("🚨 Some error occurred");
        core.setFailed(err);
    }
}

main();