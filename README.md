# coso-github-actions-versions-release
Create a release and allow to keep the "major version tag" (eg v1) targeting the last commit.

## Inputs

#### `GITHUB_TOKEN`
**Required** GitHub token  
***The GitHub token must have the write permissions on Content and Workflow***

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

## Example usage with the versioning action of COSONTECH

```yaml
permissions:
  contents: write

steps:
  - name: Set and Get Versions
    id: calculate-version
    uses: cosontech/coso-github-actions-versions-calculate@v1
    with:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      major-number: '1'
      minor-number: '0'
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

If requested through the parameter `update-major-release`, the existing major release (v1, v2v, v...) will be updated to target the last commit, as the "version release" created by the action too.  

If the major release doens't exist, it will be created.