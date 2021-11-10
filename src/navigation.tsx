import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useContext } from "react";
import { Icon, IconType } from "./assets/icons/Icon";
import { ColorContext } from "./colorContext";
import { Context } from "./context";
import {
    SCREEN_BANKID,
    SCREEN_DEMO,
    NAVIGATOR_TABS,
    SCREEN_HOME,
    SCREEN_VERIFIABLE_PRESENTATION,
    SCREEN_ONBOARDING_A,
    SCREEN_ONBOARDING_B,
    SCREEN_ONBOARDING_C,
    SCREEN_ONBOARDING_D,
} from "./hooks/useLocalNavigation";
import { DemoScreen } from "./screens/DemoScreen";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import { ProfileNavigation } from "./screens/Profile/ProfileNavigation";
import { BankIDScreen } from "./screens/BankIDScreen";
import { VerifiablePresentationScreen } from "./verifiablePresentations/VerifiablePresentationScreen";
import { OnboardingAScreen } from "./screens/Onboarding/OnboardingAScreen";
import { OnboardingBScreen } from "./screens/Onboarding/OnboardingBScreen";
import { OnboardingCScreen } from "./screens/Onboarding/OnboardingCScreen";
import { OnboardingDScreen } from "./screens/Onboarding/OnboardingDScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
interface Route {
    routeId: string;
    title: string;
    icon: IconType;
}

const HOME_ROUTE: Route = {
    routeId: "Home",
    title: "Hjem",
    icon: "home",
};

const PROFILE_ROUTE: Route = {
    routeId: "Profile",
    title: "Profil",
    icon: "account",
};

function TabNavigator() {
    const { colors } = useContext(ColorContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: IconType;
                    if (route.name === HOME_ROUTE.routeId) {
                        iconName = HOME_ROUTE.icon;
                    } else if (route.name === PROFILE_ROUTE.routeId) {
                        iconName = PROFILE_ROUTE.icon;
                    } else {
                        iconName = "person";
                    }
                    return <Icon type={iconName} color={color} size={30} />;
                },
                tabBarActiveTintColor: colors.primary.main,
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { backgroundColor: colors.surface },
            })}>
            <Tab.Screen
                name={SCREEN_HOME}
                component={Home}
                options={{
                    title: HOME_ROUTE.title,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name={PROFILE_ROUTE.routeId}
                component={ProfileNavigation}
                options={{ title: PROFILE_ROUTE.title, headerShown: false }}
            />
            {__DEV__ && (
                <Tab.Screen
                    name={SCREEN_DEMO}
                    component={DemoScreen}
                    options={{ title: "Demo" }}
                />
            )}
        </Tab.Navigator>
    );
}

export const Navigation = () => {
    const { colors } = useContext(ColorContext);

    // const { colors } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={NAVIGATOR_TABS}
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Identity"
                component={Identity}
                options={{
                    title: "Identitet",
                    headerTitleStyle: {
                        color: colors.onPrimary,
                    },
                }}
            />

            {/** Modal screens */}
            <Stack.Screen
                name={SCREEN_VERIFIABLE_PRESENTATION}
                component={VerifiablePresentationScreen}
                options={{
                    title: "Vis legitimasjon",
                    headerLargeTitle: true,
                    presentation: "modal",
                }}
            />
            <Stack.Screen
                name={SCREEN_BANKID}
                component={BankIDScreen}
                options={{
                    title: "Hent BankID",
                    headerLargeTitle: true,
                    presentation: "modal",
                }}
            />

            {/** Onboarding screens */}
            <Stack.Screen
                name={SCREEN_ONBOARDING_A}
                component={OnboardingAScreen}
                options={{
                    title: "Velkommen til SymfoniID",
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name={SCREEN_ONBOARDING_B}
                component={OnboardingBScreen}
                options={{
                    title: "Koble til",
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name={SCREEN_ONBOARDING_C}
                component={OnboardingCScreen}
                options={{
                    title: "Hvordan vise legitimasjon?",
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name={SCREEN_ONBOARDING_D}
                component={OnboardingDScreen}
                options={{
                    title: "Brukervilkår",
                    headerBackVisible: false,
                }}
            />
        </Stack.Navigator>
    );
};
