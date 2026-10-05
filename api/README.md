<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Account email flows

Registration verification and password reset links use SMTP. For local development, start the inbox with `docker compose up -d mailpit` and open `http://localhost:8025`. If Docker Desktop is unavailable, run `npx --yes maildev --smtp 1025 --web 8025` and use the SMTP defaults in `.env.example`. In production, provide the SMTP server's host, port, sender, optional credentials, and the public `FRONTEND_URL`. Apply database migrations with `npx prisma migrate deploy` and regenerate Prisma Client with `npx prisma generate` after schema changes.

## Administrator bootstrap

Public registration always creates a student account that must verify its email and be approved by an administrator. Administrator accounts can only be bootstrapped through `POST /api/auth/create-admin` when `ADMIN_BOOTSTRAP_SECRET` is configured in the API environment. The secret has no fallback value and must never be included in frontend code or public forms.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Free preview deployment (Vercel + Render)

The repository root contains `render.yaml`, configured for Render's free web service
and free PostgreSQL database. This is only for a temporary preview and online testing,
not production or real customer/student data:

- Render free web services can sleep after inactivity, so the first request may take
  about a minute to wake the API.
- Render free PostgreSQL expires after 30 days, has no managed backups, and is
  deleted after its additional 14-day upgrade grace period. Export and migrate any
  data manually before expiry; do not assume the free database is permanent.
- Uploaded documents are written under `/tmp/uploads` on the API's ephemeral
  filesystem and can disappear whenever the service restarts, sleeps, or redeploys.
  Do not upload real identity, immigration, or other sensitive documents on this
  preview. A paid persistent disk or external object storage is required for durable
  documents.
- Render's free web services cannot send outbound SMTP on ports 25, 465, or 587.
  Account verification and password-reset mail require an SMTP provider/port allowed
  by Render; without working mail, new student registration will fail. Test email
  delivery before inviting testers.
- Vercel Hobby is free only for personal, non-commercial use. Check Vercel's current
  terms and plan before using the site for a business.

To deploy the preview:

1. In Vercel, import the repository, set the Root Directory to `frontend`, and deploy
   the first preview. Vercel Hobby is appropriate only if the project meets its
   non-commercial terms.
2. In Render, create a Blueprint from this repository and review that both services
   show the `free` plan before confirming. The Blueprint generates `JWT_SECRET` and
   `ADMIN_BOOTSTRAP_SECRET`; enter the Vercel preview's public URL for `FRONTEND_URL`
   and the exact same origin for `FRONTEND_ORIGINS`. Configure SMTP values only if
   using an SMTP provider and port reachable from the free Render service.
3. Set Vercel's `NEXT_PUBLIC_API_URL` to the deployed Render API URL followed by
   `/api`, then redeploy the frontend so the public API URL is included in its build.
4. Check the Render API health endpoint (`/api`), create the first administrator,
   sign in at `/gestion`, and check administrator API access before testing other
   flows. The first admin is created once with `POST /api/auth/create-admin`, using
   the admin's email/password and the private `ADMIN_BOOTSTRAP_SECRET`; do not
   register that email first. Remove or rotate the bootstrap secret after creation.
5. Test email delivery before relying on registration/password reset. Test document
   upload/download only with disposable sample files. Confirm the data is in Render,
   not your computer.

The administrator console is available at `/gestion` (including paths such as
`/gestion/utilisateurs`). The path is not a password: the frontend checks the stored
admin role, and the API independently enforces administrator authorization.

When the owner is ready to pay for durable production hosting, change Render to a
paid database and API plan and add persistent or object storage for documents. Back
up and migrate the preview database before it expires; changing a plan alone does not
make ephemeral uploaded files durable.

For local development, start services with `docker compose up -d postgres mailpit`.
For production migration details, see the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
