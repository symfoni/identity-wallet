import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useContext } from "react";
import { Icon, IconType } from "./assets/icons/Icon";
import { ColorContext } from "./colorContext";
import { Context } from "./context";
import { SCREEN_BANKID, SCREEN_HOME } from "./hooks/useNavigation";
import { BankId } from "./screens/BankId";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import { ProfileNavigation } from "./screens/Profile/ProfileNavigation";
import RequestAndProposalHandler from "./screens/RequestAndProposalHandler";
import { ScannerScreen } from "./screens/ScannerScreen";

const Stack = createStackNavigator();
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

function Tabs() {
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
                name={HOME_ROUTE.routeId}
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
            {/* <Tab.Screen
                name="Settings"
                component={Settings}
                options={{ title: "Settings" }}
            /> */}
        </Tab.Navigator>
    );
}

export const Navigation = () => {
    const { selectedChain, isTest } = useContext(Context);
    const { colors, toggleDarkMode } = useContext(ColorContext);

    // const { colors } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={SCREEN_HOME}
                component={Tabs}
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
                name={SCREEN_BANKID}
                component={BankId}
                options={{ title: "BankID" }}
            />
            <Stack.Screen
                name="Modal"
                component={RequestAndProposalHandler}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scanner"
                component={ScannerScreen}
                options={{ title: "Scan QR" }}
            />
        </Stack.Navigator>
    );
};
