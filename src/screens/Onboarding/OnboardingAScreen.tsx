import React from "react";
import styled from "styled-components/native";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingAScreen() {
    const { navigateHome, navigateToOnboardingB } = useLocalNavigation();

    return (
        <OnboardingContent
            prev={__DEV__ ? navigateHome : undefined}
            next={navigateToOnboardingB}
        />
    );
}
