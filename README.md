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
- prepare local env file: `cp .env-template .env`
- copy application main URL as value of `BASE_URL` variable in `.env` file
- install faker library: `npm install --save-dev @faker-js/faker`

## Use

Run all tests:

```
npx playwright test
```

Run all test with tags:

```
npx playwright test --grep "@GAD-R01-02"
```

Run all test without tag:

```
npx playwright test --grep-invert "@GAD-R01"
```

For more usage cases look in `package.json` scripts section.

```

## Shortcuts

refactor names in all files: F2, changing name, press left shift + enter
```
