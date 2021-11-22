module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        [
            "module:react-native-dotenv",
            {
                moduleName: "@env",
                path: ".env",
                blacklist: null,
                whitelist: null,
                safe: true,
                allowUndefined: false,
            },
        ],
        [
            "babel-plugin-inline-import",
            {
                extensions: [".svg"],
            },
        ],
    ],
};
