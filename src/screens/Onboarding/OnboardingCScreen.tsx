import React from "react";
import styled from "styled-components/native";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingCScreen() {
    const { navigateToOnboardingB, navigateToOnboardingD } =
        useLocalNavigation();

    return (
        <OnboardingContent
            description={`Tilkoblede tjenester ber om legitimasjon ved behov. Du velger selv om du vil avslå eller bekrefte forespørselen.`}
            prev={navigateToOnboardingB}
            next={navigateToOnboardingD}
        />
    );
}
