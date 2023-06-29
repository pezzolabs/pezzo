<p align="center">
  <img src=".github/assets/logo-square.svg" width="180px">
  <br />
  <strong>
  <br />
  Pezzo is an open-source AI development toolkit designed to streamline prompt design, version management, publishing, collaboration, troubleshooting, observability and more. Our mission is to empower individuals and teams to harness the power of AI with confidence.
  </strong>
  <br />
</p>

<br />
<p align="center">
  <a href="https://bit.ly/pezzo-demo-github" target="_blank">
  <img src=".github/assets/banner.png" width="900px">
</p>

<p align="center">
  <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" width="40px" style="margin-bottom: 10px;">
  <br />
  <a href="https://discord.gg/h5nBW5ySqQ">Join Pezzo on Discord</a>
</p>

<p align="center">
  <a href="https://forms.gle/dg7fXnG5WKkeAUb59"><strong>Click here to sign up for early access to Pezzo Cloud! 🌩️</strong></a>
</p>

<p align="center">
<img src="https://github.com/pezzolabs/pezzo/actions/workflows/ci.yaml/badge.svg" />
<a href="CODE_OF_CONDUCT.md">
  <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
</a>
<a href="https://opensource.org/licenses/Apache-2.0">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
</a>
  <img src="https://img.shields.io/discord/1105803596475404358?label=Discord"/>
</p>

# Features

🎛️ **Centralized Prompt Management**: Manage all AI prompts in one place for maximum visibility and efficiency.

🚀 **Streamlined Prompt Design, Publishing & Versioning:** Create, edit, test and publish prompts with ease.

🔍 **Observability**: Access detailed prompt execution history, stats and metrics (duration, prompt cost, completion cost, etc.) for better insights.

🛠️ **Troubleshooting:** Effortlessly resolve issues with your prompts. Time travel to retroactively fine-tune failed prompts and commit the fix instantly.

💰 **Cost Transparency**: Gain comprehensive cost transparency across all prompts and AI models.

💡 **Simplified Integration:** Reduce code overhead by 90% by consuming your AI prompts using the Pezzo Client, regardless of the model provider.

# Documentation

[Click here to navigate to the Official Pezzo Documentation](https://docs.pezzo.ai/).

In the documentation, you can find information on how to use Pezzo, its architecture, as well as a tutorial for getting up and running with a simple demo app.

# Getting Started - Development

This section is useful for contributors who want to run Pezzo locally in development mode.

### Prerequisites

- Node.js 18+
- Docker
- (Recommended) [GraphQL Language Feature Support VSCode Extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

### Install dependencies

Install NPM dependencies by running:

```
npm install
```

### Spin up development dependencies via Docker Compose

Pezzo relies on Postgres, [InfluxDB](https://github.com/influxdata/influxdb) and [Supertokens](https://supertokens.com/). You can spin it up using Docker Compose:

```
docker-compose -f docker-compose.dev.yaml up
```

### Start Pezzo

Generate the Prisma client:

```
npx nx prisma:generate server
```

Deploy Prisma migrations:

```
npx dotenv-cli -e apps/server/.env -- npx prisma migrate deploy --schema apps/server/prisma/schema.prisma
```

Run the server:

```
npx nx serve server
```

The server is now running. In the background, [graphql-codegen](https://www.npmjs.com/package/@graphql-codegen/cli) has generated GraphQL types based on the actual schema. These can be found at [libs/graphql/src/@generated](libs/graphql/src/@generated). This provides excellent type safety across the monorepo.

In development mode, you want to run `graphql-codegen` in watch mode, so whenever you make changes to the schema, types are generated automatically. In a separate Terminal tab, run:

```
npm run graphql:codegen:watch
```

Finally, you are ready to run the Pezzo Console:

```
npx nx serve console
```

That's it! Pezzo is now accessible at http://localhost:4200 🚀

# Contributing

We welcome contributions from the community! Please feel free to submit pull requests or create issues for bugs or feature suggestions.

If you want to contribute but not sure how, join our [Discord](https://discord.gg/h5nBW5ySqQ) and we'll be happy to help you out!

Please check out [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

# License

This repository's source code is available under the [Apache 2.0 License](LICENSE).
