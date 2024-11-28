# coso-github-actions-versions-release
Create a release and allow to keep the "major version tag" (eg v1) targeting the last commit.

See also:  
[coso-github-actions-versions-calculate](https://github.com/cosontech/coso-github-actions-versions-calculate)  
[coso-github-actions-versions-json](https://github.com/cosontech/coso-github-actions-versions-json)  
[coso-github-actions-versions-dotnet](https://github.com/cosontech/coso-github-actions-versions-dotnet)  

## Inputs

#### `GITHUB_TOKEN`
**Required** GitHub token  
***The GitHub token must have the write permissions on Contents***

#### `version-number`
**Required** Current Semantic Version Number.  
Use "cosontech/coso-github-actions-versions-calculate@v1" action to calculate it

#### `create-version-release`
**Required** Create a release for the current version (eg v1.0.0 or v1.0.0-alpha.1 or ...).  
Default is `true`

#### `update-major-release`
**Required** Update the "major version release" (eg v1) to target the commit at the origin of the execution of the current workflow.  
Default is `true`

## Example usage

```yaml
# required for release action if github token only has read permission
permissions:
  contents: write

steps:  
  - name: Create release
    id: create-release
    uses: cosontech/coso-github-actions-versions-release@v1
    with:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      version-number: 'v1.0.0'
      create-version-release: 'true'
      update-major-release: 'true'
```

## Full example usage with the versioning actions of COSONTECH

```yaml
# required for release action if github token only has read permission
permissions:
  contents: write

steps:
  # calculate the version number
  - name: Calculate Versions
    id: calculate-version
    uses: cosontech/coso-github-actions-versions-calculate@v1
    with:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      major-number: '1'
      minor-number: '0'

  # update project files with the version number
  - name: Set version
    id: set-dotnet-version
    uses: cosontech/coso-github-actions-versions-dotnet@v1
    with:
      version-semantic: ${{ steps.calculate-version.outputs.semVersion }}
      version-build: ${{ steps.calculate-version.outputs.buildVersion }}
      root-directory: ${{ github.workspace }}

  # update json file with the version number
  - name: Set version
    id: set-version
    uses: cosontech/coso-github-actions-versions-json@v1
    with:
      version-number: ${{ steps.calculate-version.outputs.semVersion }}
      json-path: "${{ github.workspace }}/test.json"
      json-property: 'version'

  # create a release to be able to increment the version number at next run
  - name: Create release
    id: create-release
    uses: cosontech/coso-github-actions-versions-release@v1
    with:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      version-number: ${{ steps.calculate-version.outputs.semVersion }}
      create-version-release: 'true'
      update-major-release: 'true'
```

## Details

If requested through the parameter `create-version-release`, the action will create a release with a name and a tag matching with the semantic version number.  
If the release already exists, it will be updated.  

If requested through the parameter `update-major-release`, the existing major release (v1, v2v, v...) will be updated to target the last commit, as the "version release" created by the action too.  

If the major release doens't exist, it will be created.