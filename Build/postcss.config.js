/** @type {import('postcss').Config} */
export default {
    plugins: {
        // preset-env
        'postcss-preset-env': {
            browsers: 'last 1 Chrome version, not dead, fully supports es6'
        },

        // pxtorem
        'postcss-pxtorem': {
            rootValue: 16,
            propList: ['*']
        }
    }
};
