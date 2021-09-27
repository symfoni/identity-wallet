declare module "@env" {
    export const API_BASE: string;
    export const BANKID_CALLBACK_URL: string;
    export const BANKID_CLIENT_ID: string;
    export const BANKID_ACR_VALUES_WEB: string;
    export const BANKID_ACR_VALUES_MOBILE: string;
    export const BANKID_URL: string;
    export const BROK_HELPERS_URL: string;
    export const BROK_HELPERS_VERIFIER: string;
    export const USE_LOCAL_ENVIROMENT: boolean;
    export const USE_TEST_DATA: boolean;
    export const IS_TEST: boolean;
    export const APP_ENV: "development" | "production" | "staging" | "test";
}
