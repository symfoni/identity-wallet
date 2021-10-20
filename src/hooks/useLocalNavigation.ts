import { useNavigation } from "@react-navigation/native";
import { ParamPresentCredentialDemo } from "../types/paramTypes";

export const NAVIGATOR_TABS = "Tabs";

export const SCREEN_HOME = "Home";
export const SCREEN_SCANNER = "Scanner";
export const SCREEN_DEMO = "Demo";
export const SCREEN_BANKID = "BankIDScreen";
export const SCREEN_CREATE_CAP_TABLE_VP = "CreateCapTableVPScreen";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateHome = (params?: CreateCapTableVPResponse) =>
        navigation.navigate(NAVIGATOR_TABS, {
            screen: SCREEN_HOME,
            params,
        });

    const navigateCreateCapTableVP = (
        params?: ParamPresentCredentialDemo | CreateCapTableVPRequest
    ) => navigation.navigate(SCREEN_CREATE_CAP_TABLE_VP, params);

    const navigateScanner = () => navigation.navigate(SCREEN_SCANNER);

    const navigateDemo = () => navigation.navigate(SCREEN_DEMO);

    return {
        navigateHome,
        navigateScanner,
        navigateDemo,
        navigateCreateCapTableVP,
    };
}
