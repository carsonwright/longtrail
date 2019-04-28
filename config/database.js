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