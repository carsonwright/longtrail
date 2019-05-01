<br />
<div align="center" style="margin:auto;">
    <img src="logo-wide.png?raw=true" width='150px' />
</div>

Fast, opinionated, starter kit for making web applications with [node](http://nodejs.org).

## Downloading and Installation
```
git clone git@github.com:next-in-line/longtrail.git
mv longtrail your-app-name
cd your-app-name
yarn install
```

## Configure Database
config/database.js
```
module.exports = {
    production: {
        client: 'pg',
        // version: '7.2',
        asyncStackTraces: true,
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: true
        }
    },
    development: {
        client: 'pg',
        asyncStackTraces: true,
        // version: '7.2',
        connection: {
            database: 'your_application_development'
        }
    },
    test: {
        client: 'pg',
        asyncStackTraces: true,
        // version: '7.2',
        connection: {
            database: 'your_application_test'
        }
    }
}
```

## Common Commands
### Start Development Server
```
yarn dev
```

### Load Console
```
yarn c
```

### Log into development Database
```
yarn db
```

Goals
* Full Testing test suite for all Core Components (Tests were removed to help secure Next In Line's Intelectual Property)
* Full Controller support instead of Actions
* Socket support
* Multi Service support
* Core Libraries for import
* Upgrade to node 12
* Provide better Documentation
