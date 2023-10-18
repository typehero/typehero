# Running E2E Tests
Date: 2023-10-17

Status: accepted

# Context
TypeHero utilizes Playwright for E2E testing. Playwrite enables reliable, end-to-end 
tesing for modern web apps. Here is a [link to their docs](https://playwright.dev/docs/intro).

# Decision
If you would like to write a test, please follow the steps below:

1. Navigate to the folder `apps/web/tests/e2e`

![Folder location](..%2F..%2F..%2F..%2F..%2FDesktop%2FScreenshot%202023-10-17%20at%207.55.27%E2%80%AFPM.png)

2. Create a new file with the name of your test. For example, `my-test.test.ts`.
3. To run the test, run the following command `npx playwright test`.

Tests output will be displayed in the terminal by default, to enable UI mode, where you can see a visual output, 
refer to 
[these docs](https://playwright.dev/docs/test-ui-mode).

# Consequences
This decision will allow us to have a reliable test suite that will ensure that our app is working as expected.
