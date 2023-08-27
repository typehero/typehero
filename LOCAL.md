# Local Setup

[![Join the Trash Discord](https://discordapp.com/api/guilds/796594544980000808/widget.png?style=banner2)][trash-discord]

[trash-discord]: https://discord.gg/trashdev

To contribute you will first need to fork the repo and make some adjustments to
get it up and running on your local machine. Below are the steps to follow for you to get TypeHero to run on your local machine.

### 1. Create a `.env` file

Provide your values as needed.

### 2 Configure your database

You can either use PlanetScale or a local Docker container to run your database.
Use either 2.a or 2.b for the next step.

### 2.a Local Database (using Docker)

Starting the docker container

```
docker compose up -d
```

### 2.b Remote Database (using PlanetScale)

[Follow the PlanetScale quick start guide to get started][planetscale-quick-start]

After creating an account and creating a database using the steps above:

1. Click either the big "Connect" button or the "connect to your database" Link.
   ![connect](./media/connect.png)

2. Select "Connect with Prisma" and copy the `DATABASE_URL` for your `.env`
   ![getting the connection string](./media/getting-connection-string.png)

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
then copy in the secrets into your `.env`.

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
```

### 5. Install dependencies

Use `pnpm` to install dependencies.

```
pnpm install
```

### 6. Push Database Schema and Seed

```
pnpm db:push
pnpm db:seed
```

### 7. Running the dev server

Finally, you can run the dev server:

```
pnpm dev
```

### Sync data

Once the server is running you can seed and sync data

1. Navigate to
   [http://localhost:3000/api/auth/github](http://localhost:3000/api/auth/github)
   to authenticate with GitHub OAuth.

[planetscale-quick-start]: https://planetscale.com/docs/tutorials/planetscale-quick-start-guide
[new-oauth]: https://github.com/settings/applications/new

#### Dependencies

UI Library: [shadcn](https://ui.shadcn.com/)

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
