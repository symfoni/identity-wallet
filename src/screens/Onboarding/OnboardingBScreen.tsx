import React from "react";
import styled from "styled-components/native";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingBScreen() {
    const { navigateToOnboardingA, navigateToOnboardingC } =
        useLocalNavigation();

    return (
        <OnboardingContent
            prev={navigateToOnboardingA}
            next={navigateToOnboardingC}
        />
    );
}

const Content = styled.View``;

const NextButton = styled.Button``;
