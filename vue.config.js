const production = process.env.NODE_ENV === 'production';

module.exports = {
    publicPath: production
        ? '/vue-holiday-planner/'
        : '/',
    outputDir: 'dist',
}