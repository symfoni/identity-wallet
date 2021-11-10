import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingAScreen() {
    const { navigateHome, navigateToOnboardingB } = useLocalNavigation();

    return (
        <OnboardingContent next={navigateToOnboardingB}>
            <>
                <Figure>
                    <Image
                        source={require("../../../icons/SymfoniID-prod-512.png")}
                        height={10}
                        width={10}
                        resizeMode="center"
                    />
                </Figure>
                <Description>
                    Bruk Symfoni ID til å utføre oppgaver i digitale tjenester
                    som krever legitimasjon.
                </Description>
            </>
        </OnboardingContent>
    );
}

const Figure = styled.View`
    flex: 3;
    justify-content: center;
    align-items: center;
`;

const Description = styled.Text`
    flex: 1;
    font-size: 16px;
    text-align: center;
`;
