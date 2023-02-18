# Link build artifacts in triggering PR

<p align="center">
  <a href="https://github.com/stylesuxx/link-artifacts-in-pr-action"><img alt="javscript-action status" src="https://github.com/stylesuxx/link-artifacts-in-pr-action/workflows/units-test/badge.svg"></a>
</p>

This action will should run after a workflow that build artifacts which is triggered from a PR. It will then find the generated artifacts and link them in the PR that triggered the build.

By default all artifacts will be linked. A whitelist can be provided if only a subset of the artifacts should be linked.

## Usage

You can now consume the action by referencing the v1 branch. This will link all build artifacts:

```yaml
comment-action:
  runs-on: ubuntu-latest
  steps:
    - name: Link Artifacts via action
      uses: stylesuxx/link-artifacts-in-pr-action@v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```

This will only link the artifact with the name `link-me`:

```yaml
comment-action:
  runs-on: ubuntu-latest
  steps:
    - name: Link Artifacts via action
      uses: stylesuxx/link-artifacts-in-pr-action@v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        whitelist: "['link-me']"
```

## Development

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
...
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```