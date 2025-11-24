# Contributing to BYD CRM v2.0

Thank you for contributing to BYD CRM v2.0! This document outlines the development workflow and guidelines.

## 🔄 Development Workflow

### Branch Strategy

- **`main`** - Production branch, deployed to GitHub Pages
- All changes MUST go through Pull Requests
- No direct commits to `main`

### Creating a New Feature/Fix

1. **Create a new branch from `main`**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style guidelines
   - Write tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test      # Run tests
   npm run build     # Verify build works
   npm run dev       # Test locally
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push your branch**
   ```bash
   git push -u origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR from your branch to `main`
   - Fill out the PR template
   - Request review if needed

7. **After PR is approved and merged**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name
   ```

## 🏗️ Project Structure

```
BYD-CRM-2/
├── src/
│   ├── app/           # Application setup, providers
│   ├── features/      # Feature modules (customers, auth, etc.)
│   │   ├── customers/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   └── auth/
│   ├── shared/        # Shared utilities, hooks, components
│   └── tests/         # Test setup and utilities
├── docs/              # Built files for GitHub Pages (auto-generated)
├── .github/           # GitHub configuration, workflows, templates
└── PROGRESS.md        # Development progress tracker
```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes
- Use Zod schemas for runtime validation

### React Components
- Use functional components with hooks
- Follow feature-based organization
- Keep components focused and single-purpose
- Use CSS modules or separate CSS files

### Naming Conventions
- **Components**: PascalCase (e.g., `CustomerList.tsx`)
- **Files**: camelCase or kebab-case (e.g., `authService.ts`, `customer-form.css`)
- **Variables/Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Types/Interfaces**: PascalCase (e.g., `CustomerType`, `AuthState`)

### CSS
- Use CSS custom properties (variables) defined in `App.css`
- Follow BEM naming for CSS classes when applicable
- Keep styles scoped to components
- Use the established color theme (cyan/turquoise)

## 🧪 Testing

- Write tests for new features
- Run tests before creating a PR: `npm run test`
- Maintain or improve test coverage
- Test files should be colocated with source files or in `__tests__` folders

## 🚀 Deployment

- GitHub Actions automatically builds and deploys to GitHub Pages
- Deployment happens on push to `main`
- Build output goes to `docs/` folder
- Site is available at: https://zeromizer.github.io/BYD-CRM-2/

## 📋 Pull Request Guidelines

1. **Fill out the PR template** completely
2. **Link related issues** if applicable
3. **Ensure all checks pass**:
   - Build succeeds
   - Tests pass
   - No TypeScript errors
4. **Keep PRs focused** - one feature/fix per PR
5. **Write clear descriptions** - explain what and why
6. **Add screenshots** for UI changes
7. **Request review** if unsure about changes

## 🐛 Reporting Issues

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/environment details

## 💡 Feature Requests

For feature requests, please include:
- Clear description of the feature
- Use case and benefits
- Any implementation ideas
- Mockups or examples if applicable

## 🔒 Security

- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for configuration
- Review the `.gitignore` to ensure sensitive files are excluded
- Report security vulnerabilities privately to the maintainer

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

If you have questions about contributing, feel free to:
- Open a discussion on GitHub
- Check existing issues and PRs
- Review the PROGRESS.md file for current development status

---

Happy coding! 🎉
