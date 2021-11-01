import { useNavigation } from "@react-navigation/native";

export const NAVIGATOR_TABS = "Tabs";
export const NAVIGATOR_ROOT = "Root";

export const SCREEN_HOME = "Home";
export const SCREEN_SCANNER = "Scanner";
export const SCREEN_DEMO = "Demo";
export const SCREEN_BANKID = "BankIDScreen";
export const SCREEN_CREATE_CAP_TABLE_VP = "CreateCapTableVPScreen";
export const SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP =
    "CreateCapTablePrivateTokenTransferVP";
export const SCREEN_VERIFIABLE_PRESENTATION = "VerifiablePresentationScreen";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateHome = (params?: CreateCapTableVPResponse) =>
        navigation.navigate(NAVIGATOR_TABS, {
            screen: SCREEN_HOME,
            params,
        });

    const navigateScanner = () => navigation.navigate(SCREEN_SCANNER);

    const navigateDemo = () => navigation.navigate(SCREEN_DEMO);

    return {
        navigateHome,
        navigateScanner,
        navigateDemo,
    };
}
