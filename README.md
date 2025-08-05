# MyApp

MyApp lorem ipsum

## Installation

install at root of project using pnpm

```bash
  pnpm i
```

for the all apps/modules of remotes are in the apps folder `/apps/*`

to adding package of module, go to one of the app that needs it, then install it using `pnpm`

## Run Locally

Start the server dev, go to root of project then

```bash
  pnpm run dev
```

or you can just go to specific app in `./apps`, then run the server.

## Adding remote apps

to adding new remote app, run this on your terminal

```bash
  pnpm run remote:create [PROJECT_NAME] [PROJECT_PORT]
```

this will create new folder on `./apps`, then run `pnpm i` to install package if did not installed yet.

then after this please setup your module route like this in <bold>web-root/src/routes/route.tsx </bold>

```bash
<Route path="module" element={<Load node={<Module1 />} />}>
    <Route path="*" element={<Load node={<Module1 />} />} />
</Route>
```

then after this add .env.development.local and give value like your module 

```bash
APP_PROJECT_NAME="your module name" #change on prompt
APP_PORT=3001 #change accordingly

PUBLIC_PATH_MODULE="your module name"

PUBLIC_API_URL=""
PUBLIC_AUTH_API_URL=""
```

## removing remote app

to remove remote app, run this on your terminal

```bash
  pnpm run remote:remove [PROJECT_NAME]
```

this will create remove app based on `./apps`.

## .env convention

all remote apps will depend on variable from .env [_please refer to .env.[NODE_ENV].example_]

```bash
	APP_PROJECT_NAME=[YOUR PROJECT NAME]
	APP_PORT=[YOUR PORT APP]

	PUBLIC_PATH_MODULE=[YOUR PROJECT PATH, RELATIVE TO SHELL/ROOT]

	PUBLIC_API_URL=[YOUR BACKEND APIs]
	PUBLIC_AUTH_API_URL=[YOUR BACKEND AUTH]
```

.env on the root is for server and global configuration, use:

```bash
	# on the root of projects "/app"
	cp .env.example .env
```

use .env.development.local for local development or .env.production.local for local production

## Basic Tech Stack

- React
- React-router-dom
- Turborepo
- redux
- @tanstack/react-query
