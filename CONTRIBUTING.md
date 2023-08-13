## Contributing

To contribute you will first need to fork the repo and make some adjustments to get it up and running on your local
machine. Below are the steps to follow in order for you to get dotfyle to run on your local machine.

### 1. `.env` files

You'll need one for your web application:

```
cp apps/web/.env.example apps/web/.env
```

And one for your Prisma package:

```
cp packages/db/.env.example packages/db/.env
```

### 2 Configure your database

You can either use planetscale or a local docker container to run your database.
Use either 2.a or 2.b for the next step.

### 2.a Docker local DB

Starting the docker container

```
docker compose up -d
```

### 2.b Planetscale cloud DB

[Follow the planetscale quick start guide to get you connection string][planetscale-quick-start]

1. Click Get Started -> Continue with GitHub
2. Click Blue "create".
   <br/><img width="444" alt="Screenshot 2023-06-30 at 3 44 27 PM" src="https://github.com/bautistaaa/typehero/assets/31113245/c30929fe-68ca-407d-9894-ef2ea52ced3c">

3. Click "Get connection strings".
   <br/><img width="429" alt="Screenshot 2023-06-30 at 3 46 45 PM" src="https://github.com/bautistaaa/typehero/assets/31113245/c06a5829-92e6-417f-a5e6-083b7690923f">

4. Switch to "Connect with Prisma" and copy the `DATABASE_URL` for `.env` (replace **\*\*\*** with password)
   <br/><img width="344" alt="Screenshot 2023-06-30 at 3 49 03 PM" src="https://github.com/bautistaaa/typehero/assets/31113245/4c9694ef-b954-47a8-9954-c2b677a1123a">

### 3. Create a new GitHub OAuth Application

[Follow this link][new-oauth] to create a new app filling the following required details on creation:

```
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

Once completed, you will be redirected to the application page settings, from there create the client secret by clicking
on `Generate a new client secret` button.

Next, copy the client secret generated and the client ID into the `.env` file, replacing `<client_id>` and
`<client_secret>`, respectively:

```
GITHUB_ID=<client_id>
GITHUB_SECRET=<client_secret>
```

### 4. Setup uploadthing for file uploads

Go to [uploadthing.com](https://uploadthing.com/dashboard) and create a project, then copy in the secrets into your `.env`.

### 5. Install dependencies

Use `pnpm` to install dependencies.

```
pnpm install
```

### 6. Push Database Schema and Seed

```
turbo seed
```

### Running the dev server

Finally, you can run the dev server:

```
turbo dev
```

### Sync data

Once the server is running you can seed and sync data

1. Navigate to [http://localhost:5173/api/auth/github](http://localhost:5173/api/auth/github) to authenticate with GitHub OAuth.

#### Tips

if you ever need to blow away everything in your data and reseed run:

```
pnpm refresh
```

[planetscale-quick-start]: https://planetscale.com/docs/tutorials/planetscale-quick-start-guide
[new-oauth]: https://github.com/settings/applications/new

#### Dependencies

UI Library: [shadcn](https://ui.shadcn.com/)
