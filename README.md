<br />
<div align="center" style="margin:auto;">
    <img src="logo-wide.png?raw=true" width='150px' />
</div>

Fast, opinionated, starter kit for making web applications with [node.js](http://nodejs.org).
Why choose longtrail? Because it takes the best of many frameworks and features within different libraries and brings each of them into one simple to use solution.

Two of our favorite pieces of prior art are **Rails** (Ruby), and **OTP** (Elixir).
We have used rails as a guide to pick and choose libraries and wrap them in an attempt to build out a kit that uses the basic concepts of simple associations, serialization, prototyping and a simple to use console that rails is well known for.
We have also done what we can to make the processing of data act more like a recursive loop so as to keep clean logical code that can span across many servers.

**Rails** is fantastic at rappid development, people try to always compare their applications to rails even if they're just saying "rails is slow and our solution isn't like that". The fact that rails is such a well known framework shows that there are or were many developers who see strong value in certain concepts it uses.

**OTP** A fantastic tool for storing, sharing, and processing data. 

## Downloading and Installation
```
git clone git@github.com:next-in-line/longtrail.git your-app-name
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

### Migrate Database
```
yarn db:migrate
```

### Seed Database
```
yarn db:seed
```

### Generate Migration
```
yarn generate migration createOrganizations
```

Goals
* Full Testing test suite for all Core Components (Tests were removed to help secure Next In Line's Intelectual Property)
* Full Controller support instead of Actions
* Socket support
* Multi Service support
* Core Libraries for import
* Upgrade to node 12
* Provide better Documentation
