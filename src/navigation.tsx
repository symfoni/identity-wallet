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
} from "./hooks/useLocalNavigation";
import { DemoScreen } from "./screens/DemoScreen";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import { ProfileNavigation } from "./screens/Profile/ProfileNavigation";
import { BankIDScreen } from "./screens/BankIDScreen";
import { VerifiablePresentationScreen } from "./verifiablePresentations/VerifiablePresentationScreen";
import { VerifiablePresentationParams } from "./types/paramTypes";
import { ScreenRequest } from "./types/ScreenRequest";

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
            <Stack.Screen
                name={SCREEN_VERIFIABLE_PRESENTATION}
                component={VerifiablePresentationScreen}
                options={({ route }) => ({
                    title:
                        (
                            route.params as ScreenRequest<VerifiablePresentationParams>
                        ).request?.params?.title ?? "Missing title",
                    presentation: "modal",
                })}
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
        </Stack.Navigator>
    );
};
