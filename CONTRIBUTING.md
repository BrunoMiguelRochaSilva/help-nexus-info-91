# 🤝 Contributing to Help Nexus Info

## Table of Contents
- [Project Overview](#project-overview)
- [Development Workflow](#development-workflow)
- [Branch Strategy](#branch-strategy)
- [Code Review Process](#code-review-process)
- [Quality Standards](#quality-standards)
- [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## 📋 Project Overview

**Help Nexus Info** is an accessibility-first web application for rare disease information and support.

### Tech Stack
- **Frontend**: React 18.3.1 + TypeScript + Vite 5.4.21
- **UI Framework**: shadcn/ui + Radix UI + Tailwind CSS 3.4.17
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI Chatbot**: Ollama (llama3:8b) + Custom Proxy Server
- **State Management**: React Context API
- **Testing**: Vitest 4.0.14 + Testing Library + axe-core

### Core Requirements
- ✅ **WCAG 2.1 Level AA compliance** (mandatory)
- ✅ **Bilingual support** (Portuguese + English)
- ✅ **Accessibility-first** design
- ✅ **Zero breaking changes** to existing features
- ✅ **Mobile-first** responsive design

---

## 🔄 Development Workflow

### 1. Initial Setup (First Time Only)

**⚠️ Important**: You only clone the repository ONCE. After that, you just update it!

```bash
# Clone the repository (ONLY FIRST TIME!)
git clone https://github.com/TorneiraPT/help-nexus-info.git
cd help-nexus-info

# Install dependencies
npm install

# Start development servers
npm run dev                  # Frontend (port 8080/8081)
cd proxy && npm start        # Chatbot proxy (port 3001)

# Or use quick start script
./start-all.bat             # Windows: starts both servers
```

### 2. Daily Workflow (Every Other Time)

**Before starting new work**, always update your local repository:

```bash
# 1. Go to main branch
git checkout main

# 2. Get latest changes from GitHub
git pull origin main

# 3. Install any new dependencies (if package.json changed)
npm install

# 4. Now you're ready to create a new feature branch!
```

### 3. Create Feature Branch

**Branch naming convention:**
```bash
feature/<description>       # New features
fix/<bug-name>             # Bug fixes
refactor/<component>       # Code refactoring
docs/<topic>               # Documentation
style/<component>          # Styling changes
test/<feature>             # Test additions
```

**Examples:**
```bash
git checkout -b feature/user-profiles
git checkout -b fix/login-validation-error
git checkout -b refactor/accessibility-context
git checkout -b docs/api-documentation
```

### 4. Development Process

```bash
# Make your changes...

# Check for TypeScript errors
npm run lint

# Run tests
npm test

# Run accessibility tests (critical!)
npm test -- src/components/accessibility/__tests__/WCAG.test.tsx

# Check git status
git status

# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add user profile management"

# Push to your branch
git push origin feature/user-profiles
```

### 5. Common Scenarios

#### Scenario A: Starting a New Feature

```bash
# You've already cloned the repo before, so DON'T clone again!

cd help-nexus-info           # Go to existing project folder
git checkout main            # Switch to main
git pull origin main         # Get latest changes
npm install                  # Update dependencies

git checkout -b feature/my-new-feature  # Create new branch
# ... make changes ...
git add .
git commit -m "feat: my new feature"
git push origin feature/my-new-feature
```

#### Scenario B: Fixing a Bug

```bash
cd help-nexus-info           # Existing project
git checkout main
git pull origin main

git checkout -b fix/bug-name  # Create fix branch
# ... fix the bug ...
git add .
git commit -m "fix: resolve bug-name"
git push origin fix/bug-name
```

#### Scenario C: After Your PR Was Merged

```bash
# Your feature was merged to main on GitHub

git checkout main            # Go to main
git pull origin main         # Get the merged changes
git branch -d feature/old-feature  # Delete old local branch

# Ready to start a new feature!
git checkout -b feature/next-feature
```

#### Scenario D: Multiple Features in Progress

```bash
# Working on feature A
git checkout feature/feature-a
# ... make changes ...
git add .
git commit -m "feat: progress on feature A"
git push origin feature/feature-a

# Switch to work on feature B
git checkout feature/feature-b
# ... make changes ...
git add .
git commit -m "feat: progress on feature B"
git push origin feature/feature-b

# Switch back to feature A
git checkout feature/feature-a
```

---

## 🌿 Branch Strategy

### Main Branches

- **`main`**: Production-ready code. Always stable and deployable.
- **`develop`** (optional): Integration branch for features before main merge.

### Working Branches

All feature development happens in dedicated branches created from `main`:

```
main
 ├── feature/anonymous-login
 ├── feature/user-profiles
 ├── fix/chatbot-timeout
 └── refactor/accessibility-toolbar
```

### Merge Strategy

1. **Never commit directly to `main`**
2. All changes go through Pull Requests (PRs)
3. PRs must be reviewed before merging
4. Delete branch after successful merge

---

## 🔍 Code Review Process

### Creating a Pull Request

1. **Push your branch to GitHub:**
   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub:**
   - Go to repository → "Pull requests" → "New pull request"
   - Select your branch
   - Fill in PR template (see below)

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of what this PR does.

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Refactoring
   - [ ] Documentation
   - [ ] Accessibility improvement

   ## Changes Made
   - Added X component
   - Modified Y functionality
   - Fixed Z bug

   ## Testing
   - [ ] Tested manually
   - [ ] Added unit tests
   - [ ] Passed accessibility tests
   - [ ] Tested in both PT and EN

   ## Accessibility Checklist
   - [ ] WCAG 2.1 AA compliant
   - [ ] Keyboard navigation works
   - [ ] Screen reader compatible
   - [ ] Color contrast ratios ≥ 4.5:1
   - [ ] Focus indicators visible

   ## Screenshots (if UI changes)
   [Add screenshots here]
   ```

### Review Process

**For Repository Owner (Manual Review):**

```bash
# Fetch all branches
git fetch origin

# Checkout the PR branch
git checkout feature/user-profiles

# Install dependencies (if package.json changed)
npm install

# Start servers and test manually
npm run dev

# Run automated tests
npm test

# Check TypeScript errors
npm run lint

# Review code changes
git diff main..feature/user-profiles
```

**For AI Assistant (Automated Review):**

The AI assistant will:
1. Checkout the branch automatically
2. Read all modified files
3. Check for:
   - TypeScript errors
   - Missing accessibility features
   - Broken bilingual support
   - Code quality issues
   - Breaking changes
4. Provide detailed feedback
5. Suggest improvements

---

## ✅ Quality Standards

### Code Quality

**TypeScript:**
- ✅ No `any` types (use proper typing)
- ✅ Interfaces for all props
- ✅ Enums for constants
- ✅ Strict mode enabled

**React:**
- ✅ Functional components with hooks
- ✅ Proper dependency arrays in useEffect
- ✅ Memoization for expensive operations
- ✅ Context API for shared state

**Styling:**
- ✅ Tailwind CSS classes (no inline styles unless necessary)
- ✅ shadcn/ui components for UI primitives
- ✅ Mobile-first responsive design
- ✅ Dark mode support (if applicable)

### Accessibility Requirements (CRITICAL)

**Every UI component MUST:**

1. **Keyboard Navigation:**
   ```tsx
   // ✅ Good
   <button onClick={handleClick} aria-label="Close dialog">
     <X size={16} />
   </button>

   // ❌ Bad
   <div onClick={handleClick}>
     <X size={16} />
   </div>
   ```

2. **ARIA Labels:**
   ```tsx
   // ✅ Good
   <input
     id="username"
     aria-label="Username"
     aria-describedby="username-error"
   />
   <span id="username-error" role="alert">
     {error}
   </span>

   // ❌ Bad
   <input placeholder="Username" />
   ```

3. **Color Contrast:**
   - Text: ≥ 4.5:1 ratio
   - Large text: ≥ 3:1 ratio
   - Use tools: https://webaim.org/resources/contrastchecker/

4. **Focus Indicators:**
   ```css
   /* ✅ Good - visible focus */
   button:focus-visible {
     outline: 2px solid hsl(var(--primary));
     outline-offset: 2px;
   }

   /* ❌ Bad - removes focus */
   button:focus {
     outline: none;
   }
   ```

5. **Screen Reader Support:**
   ```tsx
   // ✅ Good - announces changes
   <div role="status" aria-live="polite">
     {message}
   </div>

   // ❌ Bad - no announcement
   <div>{message}</div>
   ```

### Bilingual Support

**All user-facing text MUST have PT and EN:**

```tsx
// ✅ Good
const labels = {
  pt: {
    login: 'Entrar',
    logout: 'Sair',
    welcome: 'Bem-vindo',
  },
  en: {
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',
  },
};

const { language } = useLanguage();
const t = labels[language];

return <button>{t.login}</button>;

// ❌ Bad - hardcoded language
return <button>Login</button>;
```

### Testing Requirements

**All new features MUST include:**

1. **Unit Tests:**
   ```typescript
   describe('LoginButton', () => {
     it('renders login text in Portuguese', () => {
       render(<LoginButton />, { language: 'pt' });
       expect(screen.getByText('Entrar')).toBeInTheDocument();
     });

     it('renders login text in English', () => {
       render(<LoginButton />, { language: 'en' });
       expect(screen.getByText('Login')).toBeInTheDocument();
     });
   });
   ```

2. **Accessibility Tests:**
   ```typescript
   it('passes automated accessibility checks', async () => {
     const { container } = render(<LoginDialog open={true} />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

3. **Integration Tests (if applicable):**
   ```typescript
   it('logs in user successfully', async () => {
     render(<App />);

     const loginButton = screen.getByRole('button', { name: /login/i });
     fireEvent.click(loginButton);

     const usernameInput = screen.getByLabelText(/username/i);
     const passwordInput = screen.getByLabelText(/password/i);

     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
     fireEvent.change(passwordInput, { target: { value: 'password123' } });

     const submitButton = screen.getByRole('button', { name: /login/i });
     fireEvent.click(submitButton);

     await waitFor(() => {
       expect(screen.getByText('testuser')).toBeInTheDocument();
     });
   });
   ```

---

## 🤖 AI Assistant Guidelines

### For AI Code Reviewers

When reviewing Pull Requests, follow this checklist:

#### 1. Initial Analysis

```bash
# Checkout the branch
git fetch origin
git checkout <branch-name>

# Analyze changed files
git diff main..<branch-name> --name-only

# Read all modified files
# Use Read tool for each file
```

#### 2. Code Quality Checks

**TypeScript Validation:**
```bash
npm run lint
# Review all TypeScript errors
# Check for 'any' types
# Verify interface definitions
```

**Dependency Analysis:**
```bash
# If package.json changed:
git diff main..<branch-name> -- package.json

# Check for:
# - Unnecessary dependencies
# - Version conflicts
# - Security vulnerabilities
```

#### 3. Accessibility Audit (CRITICAL)

**Run automated tests:**
```bash
npm test -- src/components/accessibility/__tests__/WCAG.test.tsx
```

**Manual checks for each UI component:**

- [ ] **Keyboard Navigation**
  - Can reach all interactive elements with Tab?
  - Can activate with Enter/Space?
  - Can close dialogs with Esc?

- [ ] **ARIA Attributes**
  - All buttons have accessible names?
  - All inputs have labels?
  - Error messages have role="alert"?
  - Dialogs have aria-labelledby and aria-describedby?

- [ ] **Color Contrast**
  - Text contrast ≥ 4.5:1?
  - Icon-only buttons have tooltips/labels?
  - Error states visually distinct (not just color)?

- [ ] **Focus Management**
  - Focus indicators visible?
  - Focus trapped in modals?
  - Focus restored when closing dialogs?

- [ ] **Screen Reader Support**
  - All images have alt text?
  - Dynamic content announces changes?
  - Loading states have aria-busy?

#### 4. Bilingual Verification

**Check all text content:**

```typescript
// Search for hardcoded strings
grep -r "return.*>.*[A-Za-z]" src/components/<new-component>

// Verify translation object exists
// Example:
const labels = {
  pt: { /* Portuguese */ },
  en: { /* English */ }
};
```

**Test in both languages:**
```bash
# Manually switch language in browser
# Verify all text changes
# Check for layout breaks
```

#### 5. Breaking Changes Detection

**Check for:**

- [ ] Modified existing component props (breaking change)
- [ ] Renamed exported functions/components
- [ ] Changed Context API structure
- [ ] Modified database schema
- [ ] Changed API endpoints

**Test existing features:**
```bash
# Run full test suite
npm test

# Manually test:
# 1. Login/logout flow
# 2. Accessibility toolbar
# 3. Chatbot functionality
# 4. Language switching
# 5. All navigation links
```

#### 6. Performance Review

**Check for:**

- [ ] Unnecessary re-renders (missing memoization)
- [ ] Large bundle imports (use tree-shaking)
- [ ] Unoptimized images (use WebP, lazy loading)
- [ ] Missing loading states
- [ ] Inefficient loops/algorithms

#### 7. Security Review

**Check for:**

- [ ] No hardcoded secrets/tokens
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities (React escapes by default)
- [ ] No sensitive data in localStorage
- [ ] Proper input validation
- [ ] No eval() or dangerouslySetInnerHTML

#### 8. Provide Detailed Feedback

**Feedback format:**

```markdown
## Code Review: feature/user-profiles

### ✅ What's Good
- Well-structured components
- Proper TypeScript typing
- Comprehensive tests

### ⚠️ Issues Found

#### Critical (Must Fix)
1. **Accessibility**: Missing aria-label on close button
   - File: `src/components/UserProfile.tsx:45`
   - Fix: Add `aria-label="Close profile dialog"`

2. **Bilingual**: Hardcoded "Save" button text
   - File: `src/components/UserProfile.tsx:78`
   - Fix: Add to translation object

#### Warnings (Should Fix)
1. **Performance**: Missing useMemo for expensive calculation
   - File: `src/components/UserProfile.tsx:34`
   - Suggestion: Wrap sortedUsers in useMemo

2. **Code Quality**: Unused import
   - File: `src/components/UserProfile.tsx:3`
   - Fix: Remove unused import

### 💡 Suggestions
- Consider adding loading skeleton
- Add error boundary for profile fetch failures
- Extract validation logic to separate hook

### 🧪 Test Results
- ✅ All tests passing (42/42)
- ✅ TypeScript: No errors
- ⚠️ Accessibility: 2 violations found (listed above)

### 📊 Recommendation
**Status**: ⚠️ **Changes Requested**

Please fix the 2 critical accessibility issues before merge.
After fixes, this PR will be ready to merge.
```

#### 9. Merge Decision

**Approve if:**
- ✅ No critical issues
- ✅ All tests passing
- ✅ WCAG 2.1 AA compliant
- ✅ Bilingual support complete
- ✅ No breaking changes (or properly documented)

**Request changes if:**
- ❌ Critical accessibility violations
- ❌ Missing translations
- ❌ Breaking changes without migration guide
- ❌ Tests failing
- ❌ Security vulnerabilities

**Merge process:**
```bash
# If approved, merge to main
git checkout main
git merge --no-ff feature/user-profiles
git push origin main

# Delete feature branch
git branch -d feature/user-profiles
git push origin --delete feature/user-profiles
```

---

## 📝 Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no feature/bug change)
- `style`: Styling changes (CSS, formatting)
- `docs`: Documentation changes
- `test`: Adding/updating tests
- `chore`: Maintenance (dependencies, scripts)
- `perf`: Performance improvements
- `a11y`: Accessibility improvements

### Examples

```bash
# New feature
git commit -m "feat(auth): add anonymous login system"

# Bug fix
git commit -m "fix(chatbot): resolve timeout on long responses"

# Accessibility improvement
git commit -m "a11y(toolbar): add keyboard navigation support"

# Documentation
git commit -m "docs: add contributing guidelines"

# Refactoring
git commit -m "refactor(context): simplify accessibility state management"

# Multiple changes
git commit -m "feat(profiles): add user profile management

- Add ProfileCard component
- Implement profile editing
- Add profile image upload
- Include bilingual support

Closes #123"
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

Before merging to `main`:

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Accessibility tests passing
- [ ] Manual testing completed
- [ ] Both languages tested (PT/EN)
- [ ] Mobile responsive verified
- [ ] Code reviewed and approved
- [ ] Documentation updated

### Deployment Process

```bash
# Main branch is auto-deployed on push
git checkout main
git merge feature/your-feature
git push origin main

# Monitor deployment
# Check production site after ~5 minutes
```

---

## 📚 Resources

### Documentation
- **Project Overview**: `PROJECT_OVERVIEW.md`
- **Setup Guide**: `COMO_INICIAR.md`
- **Lovable Login Prompt**: `docs/LOVABLE_LOGIN_PROMPT.md`

### External Resources
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Accessibility Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Screen Reader Testing](https://www.nvaccess.org/) (NVDA for Windows)

---

## 🤝 Getting Help

### Questions or Issues?

1. **Check existing documentation** (README, PROJECT_OVERVIEW, this file)
2. **Search closed issues** on GitHub
3. **Ask the AI assistant** (I'm here to help!)
4. **Create a GitHub issue** with detailed description

### Contact

- **Repository Owner**: [@TorneiraPT](https://github.com/TorneiraPT)
- **AI Assistant**: Available during development sessions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
**Maintained by**: TorneiraPT + AI Assistant (Claude Code)
