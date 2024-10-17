## Running in development

- Seed your database with `pnpm db:prod:seed`
- Create a separate github oauth app for aot. Follow the same directions you did for the TypeHero app. Callback url should be `http://localhost:3003/api/auth/callback/github`
- Change NEXT_AUTH_URL to `http://localhost:3003`. This will allow you to make sure your oauth flow works locally.
  - Need to figure out a way to be able to sign into both typehero and aot locally but good enough ™
- Navigate to `http://localhost:3003` to see the app running locally.
