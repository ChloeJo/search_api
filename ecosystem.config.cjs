module.exports = {
    apps: [{
        name: 'final-search-pm2',
        script: 'app.js',
        instances: 1,
        ignore_watch: ['node_modules', 'logs'],
        env_development: {
            NODE_ENV: "development",
            NODE_CONFIG_ENV: "development",
            watch: true
        },
        env_production: {
            NODE_ENV: "production",
            NODE_CONFIG_ENV: "production",
            watch: false
        },
        exp_backoff_restart_delay: 100
    }]
}