## Contributing

To contribute you will first need to fork the repo and make some adjustments to get it up and running on your local
machine. Below are the steps to follow in order for you to get dotfyle to run on your local machine.

### 1. Make a copy of `.env` from the example file `.env.example`.

```
cp .env.example .env
```

### 2. Setup planetscale.

[Follow the planetscale quick start guide to get you connection string][prisma-quick-start]


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


### 4. Install dependencies

Use `pnpm` to install dependencies.

```
pnpm install
```

### 5. Push Schema Changes

Run the prisma push command to sync db schemas:

```
pnpx prisma db push
```

### 6. Seed the database

Run the prisma seed command to add mock data

```
pnpx prisma db seed
```

### Running the dev server

Finally, you can run the dev server:

```
pnpm dev
```

[planetscale-quick-start]: https://planetscale.com/docs/tutorials/planetscale-quick-start-guide
[new-oauth]: https://github.com/settings/applications/new


### Sync data

Once the server is running you can seed and sync data

1. Navigate to [http://localhost:5173/api/auth/github](http://localhost:5173/api/auth/github) to authenticate with GitHub OAuth.

#### Tips

if you ever need to blow away everything in your data and reseed run:

```
pnpm reset
pnpx prisma db seed
```

