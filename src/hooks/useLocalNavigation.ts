import { useNavigation } from "@react-navigation/native";
import { ParamPresentCredentialDemo } from "../types/paramTypes";

export const SCREEN_BANKID = "Bankid";
export const SCREEN_HOME = "Main";
export const SCREEN_SCANNER = "Scanner";
export const SCREEN_PRESENT_CREDENTIAL = "PresentCredential";
export const SCREEN_DEMO = "Demo";
export const SCREEN_GET_BANKID = "GetBankID";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateBankID = () => navigation.navigate(SCREEN_BANKID);
    const navigateHome = () => navigation.navigate(SCREEN_HOME);
    const navigatePresentCredential = (params?: ParamPresentCredentialDemo) => {
        navigation.navigate(SCREEN_PRESENT_CREDENTIAL, params);
    };
    const navigateScanner = () => navigation.navigate(SCREEN_SCANNER);
    const navigateDemo = () => navigation.navigate(SCREEN_DEMO);
    const navigateGetBankID = (resultScreen: string) =>
        navigation.navigate(SCREEN_GET_BANKID, { resultScreen });

    return {
        navigateBankID,
        navigateHome,
        navigateScanner,
        navigateDemo,
        navigatePresentCredential,
        navigateGetBankID,
    };
}
