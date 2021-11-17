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
                    <DescriptionText>
                        Symfoni ID kan svare på ID-forespørsler fra digitale
                        tjenester.
                    </DescriptionText>
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

const Description = styled.View`
    flex: 1;
    font-size: 16px;
    text-align: center;
    justify-content: center;
`;
const DescriptionText = styled.Text``;
