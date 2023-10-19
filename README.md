# Tests for GAD application

Piszemy: czego dotyczy nasz kod, nasza praca; potem - jak zacząć pracę z projektem, wymagane narzędzia oraz te opcjonalne, najważniejsze skrypty

## GAD Application

Repository: https://github.com/jaktestowac/gad-gui-api-demo

Follow instructions in app README

## Prepare

### Local recommended tools:

- VS Code
- Git
- Node.js (version >16)

### Installation and setup

- (optional) install VSC recommended plugins
- install dependencies: `npm install`
- setup Playwright with: `npx playwright install --with-deps chromium`
- setup husky with: `npx husky install`

## Use

Run all tests:

```
npx playwright test
```

For more usage cases look in `package.json` scripts section.
