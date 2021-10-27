module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
        minifierPath: "metro-minify-terser",
        minifierConfig: {
            ecma: 8,
            keep_classnames: true,
            keep_fnames: true,
            module: true,
            mangle: {
                module: true,
                keep_classnames: true,
                keep_fnames: true,
            },
        },
    },
};
