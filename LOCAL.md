# Local Setup

[![Join the Trash Discord](https://discordapp.com/api/guilds/796594544980000808/widget.png?style=banner2)][trash-discord]

[trash-discord]: https://discord.gg/WjZhvVbFHM

To contribute you will first need to fork the repo and make some adjustments to
get it up and running on your local machine. Below are the steps to follow for you to get TypeHero to run on your local machine.

### 1. Create a `.env` file

Provide your values as needed.

### 2 Configure your database

You can use a local Docker container to run your database, or any other remote MySQL host you prefer that is compatible with Prisma.

### 2.a Local Database & Redis (using Docker)

Starting the docker container

```
docker compose up -d
```

### 3. Create a new GitHub OAuth Application

[Follow this link][new-oauth] to create a new app filling the following required
details on creation:

```
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

Once completed, you will be redirected to the application page settings, from
there create the client secret by clicking on `Generate a new client secret`
button.

Next, copy the client secret generated and the client ID into the `.env` file,
replacing `<client_id>` and `<client_secret>`, respectively:

```
GITHUB_ID=<client_id>
GITHUB_SECRET=<client_secret>
```

### 4. Setup uploadthing for file uploads

Go to [uploadthing.com](https://uploadthing.com/dashboard) and create a project,
then copy in the secrets (legacy, not SDK v7+) into your `.env`.

In the end your local `.env` file should look something like the following

```
DATABASE_URL="mysql://dev:dev@localhost/typehero"
GITHUB_ID=very_real_github_id
GITHUB_SECRET=very_real_secret

UPLOADTHING_SECRET="very_real_uploadthing_secret"
UPLOADTHING_APP_ID="very_real_uploadthing_app_id"
# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
NEXTAUTH_SECRET="for local use you can just use a garble of letters"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_AOT_ID=asdf
GITHUB_AOT_SECRET=asdf
```

### 5. Setup algolia for search

Go to [algolia.com](https://www.algolia.com/apps/) and create a project, then copy in the secrets into your `.env`.

```
NEXT_PUBLIC_ALGOLIA_APP_ID=APP_ID
NEXT_PUBLIC_ALGOLIA_API_KEY=API_KEY
```

### 6. Install dependencies

Use `pnpm` to install dependencies.

```
pnpm install
```

### 7. Push Database Schema and Seed

```
pnpm db:push
pnpm db:seed
```

### 8. Running the dev server

Finally, you can run the dev server:

```
pnpm dev
```

### Sync data

Once the server is running you can seed and sync data

1. Navigate to [http://localhost:3000](http://localhost:3000) in your browser and login using your GitHub account

[new-oauth]: https://github.com/settings/applications/new

### Make Yourself an Admin

1. Ensure you have logged into your local instance atleast once
2. Run `pnpm db:studio` - to open [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)

   ![prisma studio](./media/prisma-studio-models.png)

3. Click on the `User` table from the list of models
4. Locate your username and open record in new tab to modify Role

   ![modify role](./media/change-role-to-admin.png)

#### Dependencies

UI Library: [shadcn](https://ui.shadcn.com/)

# Testing

### 1. Install Playwright Dependencies

```
pnpm test:e2e:install
```

### 2. Run E2E Tests

You can use the production server or the dev server to run the e2e tests.

> [!WARNING]
> The dev server may cause tests to timeout.

### 2.a Production server

Playwright will automatically start the production server

```
pnpm build && pnpm test:e2e
```

### 2.b Dev server

Open two separate terminals and run the following commands in each one:

Terminal 1:

```
pnpm dev
```

Terminal 2:

```
pnpm test:e2e
```

### Running Tests in UI Mode

In the event you need to troubleshoot the end-to-end tests, you can run Playwright in [UI mode](https://playwright.dev/docs/test-ui-mode). You can do this by running `pnpm test:e2e:ui`. This will spin up a playwright server on localhost:8080, which will provide a playwright app that you can use to view a series of snapshots.

In addition you can use [Playwright Inspector](https://playwright.dev/docs/debug#playwright-inspector) to debug tests, which is a debugger that Playwright maintains. It automatically stops at each test suite, as well as each test case within them. As a result, you can debug a specific test suite by running `pnpm test:e2e:inspector -- {testName}`

### Troubleshooting A11y

In the event the end-to-end tests find an A11y violation, the playwright report will contain more information. Such as the description of the violation, a link to Deque University that will explain the violation as well as some ways to fix it, and finally the HTML that is causing the violation.

You can access the playwright report by first running `pnpm test:e2e`. After it has completed, you can run `pnpm exec playwright show-report` to see the HTML report, or simply open the `index.html` file under `apps/web/playwright-report`.

## FAQ

<details>
  <summary>How do I totally rebuild and re-seed the database?</summary>

<p>Run the command</p>

```
pnpm refresh
```

This will cause Prisma to force reset the database through the `db:reset`
command and then run `db:seed`.

</details>

<details>
  <summary>What if I run into errors with that command?</summary>
  If you are using the docker setup for your local environment then get into the container with

```sh
docker exec -it typehero-db bash
# we are in the container from here on
$ mysql -u dev -p -h 127.0.0.1 typehero
> drop database typehero;
```

Exit out of the container and then run

```sh
pnpm refresh
```

This tends to resolve the issue as it entirely destroys and rebuilds + reseeds the database.

</details>

<details>
  <summary>How do I use the `@vercel/toolbar` locally?</summary>
  If you have access to the vercel project then you can run `vercel link` (make sure you have the vercel CLI).

Follow the interactive CLI to link it to the Trash Company/typehero project.

From there on out you should be able to read and make comments while on local host for that branch.

</details>
