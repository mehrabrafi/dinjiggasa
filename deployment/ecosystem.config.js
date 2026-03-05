module.exports = {
    apps: [
        {
            name: 'dinjiggasa-backend',
            script: 'npm',
            args: 'run start:prod',
            cwd: './backend',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            watch: false,
        },
        {
            name: 'dinjiggasa-frontend',
            script: 'npm',
            args: 'run start',
            cwd: './frontend',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            watch: false,
        },
    ],
};
