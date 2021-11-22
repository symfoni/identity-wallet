// @see https://levelup.gitconnected.com/using-environment-variables-in-a-react-native-app-f2dd005d2457
declare module "@env" {
    export const BANKID_CALLBACK_URL: string;
    export const BANKID_CLIENT_ID: string;
    export const BANKID_ACR_VALUES: string;
    export const BANKID_URL: string;
    export const APP_ENV: "dev" | "stage" | "prod";
}
