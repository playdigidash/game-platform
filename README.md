# Lidvizion

## Cloud-Driven Open Source Version

This open source version of the game-platform app is designed to use cloud-hosted versions of the following libraries by default:
- `@lidvizion/commonlib`
- `@lidvizion/login`
- `@lidvizion/obstacle-pool-wasm`

**Cloud Switch:**
- By default, the app will use the cloud version of these libraries/services for a seamless experience and to drive cloud adoption.
- If you wish to self-host or develop these libraries locally, set the environment variable `USE_CLOUD_LIBS=false` in your environment or `.env` file. Otherwise, leave it unset or set to `true` to use the cloud.

**Example:**
```
USE_CLOUD_LIBS=true # (default, uses cloud)
# USE_CLOUD_LIBS=false # (uncomment to use local/self-hosted libs if available)
```

---

## Running application

git clone <clone url>

cd to project root directory

yarn

add env variables: 

- NX_GOOGLE_API_CLIENT_ID
- NX_GOOGLE_CALENDAR_API_KEY
- NX_MS_TRANSLATE_API_KEY
- NX_MS_TRANSLATE_SERVER_REGION
- NX_DB
- NX_DEFAULT_ORG_ID

yarn start

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `yarn add --save-dev @nrwl/react`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@lidvizion/mylib`.

## Run model server locally

- download model and unzip: https://drive.google.com/file/d/17dt_-1xA0U15Qv_KgDbUfEyyFOT27k_N/view?usp=share_link
- place model folder under lvwebapp > src > app
- install http server based on operating system: https://www.npmjs.com/package/http-server
- run `http-server -cl --cors .` from model folder

## Development server

Run `yarn start my-app-name` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### UI Theme for LVWebApp

The theme (dark or light) can be controlled through the NX_LV_THEME environment variable. If not set,
the code currently defaults to a light theme. Valid values are 'dark' and 'light'. Any other non-empty
value will result in dark theme.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
