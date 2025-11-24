# Branch Protection Setup Guide

This document provides instructions for setting up branch protection rules on the `main` branch to ensure all changes go through Pull Requests.

## 📋 Recommended Settings

### 1. Navigate to Branch Protection Settings

Go to: https://github.com/Zeromizer/BYD-CRM-2/settings/branches

Click **"Add branch protection rule"** or edit the existing rule for `main`

### 2. Branch Name Pattern

```
main
```

### 3. Protection Rules

#### ✅ Required (Strongly Recommended)

- **Require a pull request before merging**
  - ✅ Require approvals: `1` (or more if you have a team)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (optional)

- **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Select required checks:
    - `build` (if you have a build workflow)
    - `test` (if you have a test workflow)

- **Require conversation resolution before merging**
  - ✅ All conversations on code must be resolved

- **Do not allow bypassing the above settings**
  - ✅ Include administrators (prevents even admins from pushing directly)

#### 🔧 Optional (But Useful)

- **Require signed commits**
  - Ensures commits are verified

- **Require linear history**
  - Prevents merge commits, enforces rebase or squash

- **Lock branch**
  - Makes the branch read-only (use only if needed)

- **Require deployments to succeed before merging**
  - If you have deployment checks

### 4. Rules Applied to Everyone

- **Allow force pushes**: ❌ Disabled
- **Allow deletions**: ❌ Disabled

## 🎯 What This Achieves

With these settings:

1. ✅ No one can push directly to `main` (including admins)
2. ✅ All changes must go through a Pull Request
3. ✅ PRs must be reviewed and approved
4. ✅ Status checks (build, tests) must pass
5. ✅ Conversations must be resolved
6. ✅ Branch must be up-to-date with `main`

## 🔄 Workflow After Setup

### For Contributors

1. Create a feature branch from `main`
2. Make changes and commit
3. Push branch to GitHub
4. Create a Pull Request
5. Wait for reviews and checks
6. Merge after approval

### For Reviewers

1. Review code changes
2. Leave comments/suggestions
3. Request changes if needed
4. Approve when satisfied
5. Merge the PR

## 🚨 Emergency Hotfixes

If you need to make an urgent fix:

1. Still create a branch
2. Still create a PR
3. You can approve your own PR if needed
4. But the CI checks must still pass

**Never disable branch protection rules to make a quick fix!**

## 📊 Monitoring

You can view:
- **Protected branches**: Settings → Branches
- **Recent PRs**: Pull Requests tab
- **Branch policies**: Insights → Network

## 🔐 Best Practices

1. **Keep `main` stable** - It's always production-ready
2. **Small, focused PRs** - Easier to review
3. **Clear PR descriptions** - Use the template
4. **Test before PR** - Run tests locally
5. **Review your own code** - Before requesting review
6. **Keep PRs up-to-date** - Rebase or merge `main` regularly
7. **Delete merged branches** - Keep repo clean

## 📝 Additional GitHub Settings

### Actions Permissions

Settings → Actions → General

- **Allow all actions and reusable workflows**
- **Workflow permissions**: Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

### Pages Settings

Settings → Pages

- **Source**: Deploy from a branch
- **Branch**: `main` / `/docs` folder
- **Custom domain**: (optional)

## 🛡️ Security Settings

Settings → Code security and analysis

- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning

## ⚙️ Auto-merge (Optional)

If you want to enable auto-merge:

1. Go to Settings → General
2. Under "Pull Requests"
3. ✅ Allow auto-merge
4. ✅ Automatically delete head branches

This lets you set PRs to auto-merge after approvals and checks pass.

## 📞 Need Help?

If you encounter issues with branch protection:

1. Check that you have admin access to the repository
2. Verify all required checks are configured
3. Review the GitHub documentation: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches

---

**Status**: Please configure these settings to complete the workflow setup.
