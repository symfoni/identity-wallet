import { useNavigation } from "@react-navigation/core";

export const SCREEN_BANKID = "Bankid";
export const SCREEN_HOME = "Main";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateBankID = () => navigation.navigate(SCREEN_BANKID);
    const navigateHome = () => navigation.navigate(SCREEN_HOME);

    return {
        navigateBankID,
        navigateHome,
    };
}
