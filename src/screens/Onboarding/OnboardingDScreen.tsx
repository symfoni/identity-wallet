import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingDScreen() {
    const { navigateToOnboardingC } = useLocalNavigation();

    return <OnboardingContent prev={navigateToOnboardingC} />;
}
