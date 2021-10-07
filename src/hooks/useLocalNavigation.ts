import { useNavigation } from "@react-navigation/native";

export const SCREEN_BANKID = "Bankid";
export const SCREEN_HOME = "Main";
export const SCREEN_SCANNER = "Scanner";
export const SCREEN_PRESENT_CREDENTIAL = "PresentCredential";
export const SCREEN_DEMO = "Demo";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateBankID = () => navigation.navigate(SCREEN_BANKID);
    const navigateHome = () => navigation.navigate(SCREEN_HOME);
    const navigateSendVerifiedPersonnummer = () =>
        navigation.navigate(SCREEN_PRESENT_CREDENTIAL);
    const navigateScanner = () => navigation.navigate(SCREEN_SCANNER);
    const navigateDemo = () => navigation.navigate(SCREEN_DEMO);

    return {
        navigateBankID,
        navigateHome,
        navigateScanner,
        navigateDemo,
        navigateSendVerifiedPersonnummer,
    };
}
