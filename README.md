# PnP PowerShell deploy GitHub action

GitHub action to deploy a SharePoint app using PnP PowerShell.

## Features
- Installs [PnP PowerShell](https://docs.microsoft.com/en-us/powershell/sharepoint/sharepoint-pnp/sharepoint-pnp-cmdlets?view=sharepoint-ps) module
- Connects to the specified site using the [Connect-PnPOnline](https://docs.microsoft.com/en-us/powershell/module/sharepoint-pnp/connect-pnponline?view=sharepoint-ps) command
- Deploys the app using the [Add-PnPApp](https://docs.microsoft.com/en-us/powershell/module/sharepoint-pnp/add-pnpapp?view=sharepoint-ps) command

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---PnP-PowerShell-deploy) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Supported Opearting System
- This action only works with `Windows` Operations System
- This action only works for SharePoint Online

#### Optional requirement
Since this action requires user name and password which are sensitive pieces of information, it would be ideal to store them securely. We can achieve this in a GitHub repo by using [secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets). So, click on `settings` tab in your repo and add 2 new secrets:
- `adminUsername` - store the admin user name in this (e.g. user@contoso.onmicrosoft.com)
- `adminPassword` - store the password of that user in this.
These secrets are encrypted and can only be used by GitHub actions.

### Inputs
- `SHAREPOINT_SITE_URL` : **Required** URL of the SharePoint Site.
- `ADMIN_USERNAME` : **Required** Username of the admin.
- `ADMIN_PASSWORD` : **Required** Password of the admin.
- `APP_FILE_PATH` : **Required** Relative path of the app in your repo
- `OVERWRITE` : `true|false` Set to overwrite the existing package file. Default is `false`
- `SCOPE` : `Site|Tenant` Scope of the app catalog: `Tenant|Site`. Default is `Tenant`
- `SKIP_FEATURE_DEPLOYMENT` : `true|false` If the app supports tenant-wide deployment, deploy it to the whole tenant. Default is `false`

### Example workflow - PnP PowerShell Deploy
On every `push` build the code, deploy the app.

```yaml
name: SPFx CICD with PnP PowerShell

on: [push]

jobs:
  build:
    ##
    ## Build code omitted
    ##
        
  deploy:
    needs: build
    runs-on: windows-latest
    env:
      siteUrl: https://contoso.sharepoint.com/sites/teamsite
    
    steps:
    
    ##
    ## Code to get the package omitted
    ##
    
    # PnP PowerShell deploy app action
    # Use either option 1 or option 2
    
    # Option 1 - Deploy app at tenant level
    - name: Option 1 - Deploy app to tenant
      id: PnPPowerShellDeploy
      uses: aakashbhardwaj619/action-pnp-powershell-deploy@v1.0.0
      with:
        SHAREPOINT_SITE_URL: ${{ env.siteUrl }}
        ADMIN_USERNAME: ${{ secrets.adminUsername }}
        ADMIN_PASSWORD: ${{ secrets.adminPassword }}
        APP_FILE_PATH: sharepoint/solution/spfx-pnp-powershell-action.sppkg
        SKIP_FEATURE_DEPLOYMENT: true
        OVERWRITE: true
    # Option 1 - ends
     
    # Option 2 - Deploy app to a site collection
    - name: Option 2 - Deploy app to a site collection
      uses: aakashbhardwaj619/action-pnp-powershell-deploy@v1.0.0
      with:
        SHAREPOINT_SITE_URL: ${{ env.siteUrl }}
        ADMIN_USERNAME: ${{ secrets.adminUsername }}
        ADMIN_PASSWORD: ${{ secrets.adminPassword }}
        APP_FILE_PATH: sharepoint/solution/spfx-pnp-powershell-action.sppkg
    # Option 2 - ends
```
