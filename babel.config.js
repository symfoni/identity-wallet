module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        [
            "module:react-native-dotenv",
            {
                moduleName: "@env",
                path: ".env.stage",
                blacklist: null,
                whitelist: null,
                safe: true,
                allowUndefined: true,
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
