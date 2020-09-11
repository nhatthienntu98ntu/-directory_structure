# Platfox OTB Fulfillment version 2

## *Created and developed by Platfox Dev Team*

&nbsp;

## How to development
> - Clone code from git@gitlab.com:shopiaz.net/otb-ver2.git


### Install dependencies
> Remember that you are installing dependencies at project root path.

```bash
cd /path/to/project/root/
yarn # Or yarn install
```


### Add or remove dependencies

```bash
yarn workspace {WORKSPACE_NAME} [add][remove] {PACKAGE_NAME}
```

Ex:

```bash
yarn workspace @app/backend add express
```

#### Backend

```bash
yarn start
```

#### Frontend

```bash
yarn serve
```