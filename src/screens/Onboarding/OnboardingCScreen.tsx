import React from "react";
import styled from "styled-components/native";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingCScreen() {
    const { navigateToOnboardingB, navigateToOnboardingD } =
        useLocalNavigation();

    return (
        <OnboardingContent
            prev={navigateToOnboardingB}
            next={navigateToOnboardingD}
        />
    );
}
