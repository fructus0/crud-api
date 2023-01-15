# CRUD API

## Install

```bash
git clone git@github.com:fructus0/crud-api.git
git checkout development
npm install
```

## Run the application

First things first: you should create `.env` file and copy content from `.env.dist` to it.


1. Run the application in development mode:

   ```bash
   npm run start:dev
   ```

   This command will run the application in development mode on a port from `.env`.

   By default, it will run on `http://localhost:5000/api/users`.


2. Run the application in production mode:

   ```bash
   npm run start:prod
   ```

   This command will build the application using `webpack` to a single file in `dist` directory and run it.

   By default, it will run on `http://localhost:5000/api/users`.


3. Run the application in multi port mode:

   ```bash
   npm run start:multi
   ```
   This command will run the application in multi ports mode. Number of ports(workers) depends on result `os.cpus()` execution    

## Test the application

```bash
npm run tests
```

This command will run the application tests.

## Lint the application

```bash
npm run lint:check
```

This command will run the code style linter only for checking.

```bash
npm run lint:fix
```

This command will run the code style linter and will try to fix problems with code style.
