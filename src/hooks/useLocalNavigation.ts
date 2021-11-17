import { useNavigation } from "@react-navigation/native";
import { CreateCapTableVPResponse } from "../types/requestTypes";

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

export const SCREEN_ONBOARDING_A = "OnboardingA";
export const SCREEN_ONBOARDING_B = "OnboardingB";
export const SCREEN_ONBOARDING_C = "OnboardingC";
export const SCREEN_ONBOARDING_D = "OnboardingD";

export function useLocalNavigation() {
    const navigation = useNavigation();

    const navigateHome = (params?: CreateCapTableVPResponse) =>
        navigation.navigate(NAVIGATOR_TABS, {
            screen: SCREEN_HOME,
            params,
        });
    const navigateScanner = () => navigation.navigate(SCREEN_SCANNER);
    const navigateDemo = () => navigation.navigate(SCREEN_DEMO);

    // Onboarding
    const resetToOnboardingA = () =>
        navigation.reset({
            index: 0,
            routes: [{ name: SCREEN_ONBOARDING_A }],
        });

    const navigateToOnboardingA = () =>
        navigation.navigate({ name: SCREEN_ONBOARDING_A });
    const navigateToOnboardingB = () =>
        navigation.navigate(SCREEN_ONBOARDING_B);
    const navigateToOnboardingC = () =>
        navigation.navigate(SCREEN_ONBOARDING_C);
    const navigateToOnboardingD = () =>
        navigation.navigate(SCREEN_ONBOARDING_D);

    return {
        navigateHome,
        navigateScanner,
        navigateDemo,
        resetToOnboardingA,
        navigateToOnboardingA,
        navigateToOnboardingB,
        navigateToOnboardingC,
        navigateToOnboardingD,
    };
}
