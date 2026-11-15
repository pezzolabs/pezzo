# AGENTS.md

## Project Overview
Pezzo is an Nx-based TypeScript monorepo for an open-source LLMOps platform. It contains backend services, frontend console UI, supporting libraries, and end-user/developer documentation.

Validated stack and tooling in this repo:
- **Workspace/build orchestration:** Nx (`nx.json`, per-project `project.json`)
- **Backend:** NestJS + Prisma + GraphQL codegen (`apps/server`)
- **Frontend:** React + Webpack + Storybook (`apps/console`)
- **Libraries:** publishable/internal TS libraries (for example `libs/client` with Rollup)
- **Docs:** Mintlify docs site + OpenAPI (`docs/mint.json`, `docs/openapi.json`)
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yaml`, `.github/workflows/release.yaml`)

## Repository Structure
Top-level structure verified from repository root:

- `apps/`
  - `server/`: NestJS API service (`apps/server/project.json`)
  - `console/`: React console application (`apps/console/project.json`)
  - `proxy/`: additional deployable app
- `libs/`
  - `client/`, `common/`, `kafka/`, `types/`, `ui/`
- `docs/`
  - Mintlify content (`docs/mint.json`, `docs/README.md`, `docs/api-reference/*`)
- `.github/workflows/`
  - `ci.yaml` (format/lint/test/build + dockerize)
  - `release.yaml`
- `tools/`
  - workspace scripts (e.g. postinstall patch + publish tooling)
- `clickhouse/`
  - ClickHouse-related resources
- Workspace config files:
  - `package.json`, `nx.json`, `tsconfig.base.json`, `jest.config.ts`, `codegen.ts`

## Development Guidelines
Use Nx targets and existing project configuration rather than ad-hoc commands.

Core setup commands (from `README.md` / `package.json`):
- `npm install`
- infra: `docker-compose -f docker-compose.infra.yaml up`
- server: `npx nx serve server`
- console: `npx nx serve console`
- GraphQL watch codegen: `npm run graphql:codegen:watch`

Useful workspace scripts:
- `npm run docs:dev` (runs Mintlify docs on port 3200)
- `npm run graphql:generate`

Branch/commit conventions (from `CONTRIBUTING.md`):
- Branches typically prefixed with `docs/`, `feat/`, `fix/`
- Conventional commit pattern: `<type>(<package>): <subject>`

## Code Patterns
### 1) Nx target-driven pipelines
- Projects define behavior in `project.json` targets (`build`, `serve`, `lint`, `test`, custom targets).
- Workspace-wide cacheable operations are declared in `nx.json`.

### 2) Server build chain (`apps/server/project.json`)
- `build` depends on Prisma generation and prebuild steps.
- `prebuild` depends on `prisma:generate` and `graphql:generate`.
- GraphQL flow includes schema generation and codegen targets.
- OpenAPI spec can be generated via `generate-open-api-spec` target.

### 3) Console app configuration (`apps/console/project.json`)
- Webpack-based build with env file replacements for production.
- Storybook targets are present (`storybook`, `build-storybook`, `test-storybook`).

### 4) Publishable library pattern (`libs/client/project.json`)
- Prebuild script generates version source, Rollup builds CJS/ESM, postbuild script finalizes package.
- Publish operation delegated to workspace tooling (`tools/scripts/publish.mjs`).

### 5) Docs as product surface (`docs/mint.json`)
- Navigation and API sections are curated explicitly.
- OpenAPI source is local (`/openapi.json`) and API base URL configured.

## Quality Standards
CI expectations are defined in `.github/workflows/ci.yaml`:
1. Formatting check: `npx nx format:check --all --verbose`
2. Lint all projects: `npx nx run-many --target=lint --all --parallel --maxParallel=3`
3. Test all projects: `npx nx run-many --target=test --all --parallel --maxParallel=3`
4. Build flow:
   - `npx nx graphql:generate --skip-nx-cache`
   - `npx nx run-many --target=build --all --parallel --maxParallel=3`

Agent changes should preserve these expectations.

## Critical Rules
1. **Do not bypass Nx project targets** when a target already exists.
2. **Respect generator/build dependencies** (especially server Prisma + GraphQL generation).
3. **Keep docs/config aligned with code** when behavior or APIs change:
   - update docs content under `docs/`
   - keep OpenAPI/GraphQL generated assets in sync when required.
4. **Limit scope of changes** to the relevant app/lib/docs area.
5. **Do not introduce new build tooling conventions** when existing Nx/webpack/rollup patterns already cover the use case.

## Common Tasks
### Run one app locally
- Server: `npx nx serve server`
- Console: `npx nx serve console`

### Run workspace quality gates locally
- `npx nx format:check --all --verbose`
- `npx nx run-many --target=lint --all --parallel --maxParallel=3`
- `npx nx run-many --target=test --all --parallel --maxParallel=3`

### Build all
- `npx nx graphql:generate --skip-nx-cache`
- `npx nx run-many --target=build --all --parallel --maxParallel=3`

### Work on docs
- `npm run docs:dev`
- Edit `docs/mint.json` only when changing navigation/top-level docs structure.

### Regenerate server schema/artifacts
- `npx nx graphql:generate server`
- For watch mode during active schema work: `npm run graphql:codegen:watch`

## Reference Examples
Concrete files that represent canonical patterns in this repo:
- Complex app pipeline: `apps/server/project.json`
- Frontend app + Storybook: `apps/console/project.json`
- Publishable library with pre/post build: `libs/client/project.json`
- Workspace caching/defaults: `nx.json`
- CI contract: `.github/workflows/ci.yaml`
- Docs IA/API integration: `docs/mint.json`
- Contribution conventions: `CONTRIBUTING.md`

## Additional Resources
- Root setup and architecture context: `README.md`
- Contribution workflow and commit/branch rules: `CONTRIBUTING.md`
- Docs source: `docs/`
- CI workflows: `.github/workflows/`
