import {
    createNavigationContainerRef,
    NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { ColorContext } from "../../colorContext";
import { Profile } from "./Profile";
import { PROFILE_ROUTES, ProfileMenuRoute, isDivider } from "./ProfileRoutes";

const ProfileStack = createStackNavigator();
export const profileNavigationRef = createNavigationContainerRef();

export const ProfileNavigation = () => {
    const { colors } = useContext(ColorContext);
    console.log(colors.surface);

    return (
        <NavigationContainer ref={profileNavigationRef} independent={true}>
            <ProfileStack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false,
                    headerTintColor: colors.onBackground,
                    headerStyle: { backgroundColor: colors.surface },
                }}>
                <ProfileStack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ headerShown: false }}
                />
                {PROFILE_ROUTES.map((item) => {
                    if (!isDivider(item)) {
                        // is not divider
                        let route = item as ProfileMenuRoute;
                        return (
                            <ProfileStack.Screen
                                key={route.routeId}
                                name={route.routeId}
                                component={route.component}
                                options={{
                                    headerShown: true,
                                    headerStyle: {
                                        backgroundColor: colors.surface,
                                    },
                                }}
                            />
                        );
                    }
                })}
            </ProfileStack.Navigator>
        </NavigationContainer>
    );
};
