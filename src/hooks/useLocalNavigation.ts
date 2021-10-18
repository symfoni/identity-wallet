import { useNavigation } from "@react-navigation/native";
import { ParamPresentCredentialDemo } from "../types/paramTypes";
import {
    CreateCapTableVPRequest,
    CreateCapTableVPResponse,
} from "../types/createCapTableVPTypes";

export const NAVIGATOR_TABS = "Tabs";

export const SCREEN_BANKID = "Bankid";
export const SCREEN_HOME = "Home";
export const SCREEN_SCANNER = "Scanner";
export const SCREEN_CREATE_CAP_TABLE_VP = "CreateCapTableVP";
export const SCREEN_DEMO = "Demo";
export const SCREEN_GET_BANKID = "GetBankID";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateHome = (params?: CreateCapTableVPResponse) =>
        navigation.navigate(NAVIGATOR_TABS, {
            screen: SCREEN_HOME,
            params,
        });

    const navigateBankID = () => navigation.navigate(SCREEN_BANKID);

    const navigateCreateCapTableVP = (
        params?: ParamPresentCredentialDemo | CreateCapTableVPRequest
    ) => navigation.navigate(SCREEN_CREATE_CAP_TABLE_VP, params);

    const navigateScanner = () => navigation.navigate(SCREEN_SCANNER);

    const navigateDemo = () => navigation.navigate(SCREEN_DEMO);

    const navigateGetBankID = (resultScreen: string) =>
        navigation.navigate(SCREEN_GET_BANKID, { resultScreen });

    return {
        navigateBankID,
        navigateHome,
        navigateScanner,
        navigateDemo,
        navigateCreateCapTableVP,
        navigateGetBankID,
    };
}
