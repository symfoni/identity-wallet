// @see https://levelup.gitconnected.com/using-environment-variables-in-a-react-native-app-f2dd005d2457
declare module "@env" {
    export const API_BASE: string;
    export const BANKID_CALLBACK_URL: string;
    export const BANKID_CLIENT_ID: string;
    export const BANKID_ACR_VALUES: string;
    export const BANKID_URL: string;
    export const BROK_HELPERS_URL: string;
    export const BROK_HELPERS_VERIFIER: string;
    export const USE_LOCAL_ENVIROMENT: boolean;
    export const USE_TEST_DATA: boolean;
    export const IS_TEST: boolean;
    export const APP_ENV: "dev" | "stage" | "prod";
}
