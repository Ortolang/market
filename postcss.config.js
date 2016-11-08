module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: ['last 1 version', 'Safari >= 3', 'Explorer >= 10', 'iOS >= 6', 'Firefox >= 15']
        })
    ]
};
