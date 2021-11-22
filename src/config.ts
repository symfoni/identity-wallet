import { APP_ENV } from "@env";
import { ImageSourcePropType } from "react-native";

interface IConfig {
    APP_ICON: ImageSourcePropType;
}

/**
 * Config is loaded on app start, and does not change during run-time. It requires app-restart
 * to be re-configured.
 *
 * Config could change based on:
 * - environment-type ("dev", "stage", "prod")
 * - build-type (debug,release) e.g. (__DEV__, !__DEV__)
 * - device-type (phone,tablet,laptop,desktop)
 */
export const Config = Object.freeze(
    ((): IConfig => {
        let config = {
            APP_ICON:
                require("../icons/SymfoniID-dev-512.png") as ImageSourcePropType,
        };

        switch (APP_ENV) {
            case "stage": {
                config.APP_ICON = require("../icons/SymfoniID-staging-512.png");
                break;
            }
            case "prod": {
                config.APP_ICON = require("../icons/SymfoniID-prod-512.png");
                break;
            }
        }

        return config;
    })()
);
