# Contributing to Business Management System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check the issue list. When creating a bug report, include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Screenshots if applicable
- Your environment (OS, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Include:
- Clear description of the enhancement
- Reasoning for the enhancement
- Examples of how it would work
- Potential drawbacks

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/Near08x/demo.git
   cd demo
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Follow the existing code style
   - Add/update tests as needed
   - Update documentation

5. **Run tests and build**
   ```bash
   npm test              # Run all tests
   npm run build        # Build for production
   npm run typecheck    # Check TypeScript
   ```

6. **Commit your changes**
   ```bash
   git commit -m "feat: description of your changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Use the PR template
   - Link related issues
   - Provide screenshots for UI changes

## Development Guidelines

### Code Style

- Use TypeScript with strict mode
- Follow the existing folder structure
- Use meaningful variable and function names
- Add comments for complex logic

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]
```

Examples:
- `feat(loans): add payment distribution algorithm`
- `fix(auth): resolve JWT expiration issue`
- `docs(api): update endpoint documentation`

### Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Aim for >80% code coverage

### TypeScript

- No `any` types unless absolutely necessary
- Use strict mode (enabled by default)
- Add type annotations to function parameters

## Project Structure

```
src/
├── app/          # Next.js pages and API routes
├── components/   # React components
├── lib/          # Utilities and configurations
├── modules/      # Business logic (services, repositories)
└── schemas/      # Zod validation schemas
```

## Pull Request Review Process

1. Submit your PR with a clear description
2. Ensure all tests pass and build succeeds
3. Address review feedback
4. PR will be merged once approved

## Questions or Need Help?

- Check the [Architecture Guide](./docs/ARCHITECTURE.md)
- Read the [API Reference](./docs/API.md)
- Review existing issues and PRs
- Open a discussion if needed

---

Thank you for contributing to making this project better! 🙏
