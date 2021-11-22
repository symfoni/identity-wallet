import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { Config } from "../../config";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingAScreen() {
    const { navigateHome, navigateToOnboardingB } = useLocalNavigation();

    return (
        <OnboardingContent next={navigateToOnboardingB} index={1}>
            <>
                <Figure>
                    <Logo source={Config.APP_ICON} resizeMode="cover" />
                </Figure>
                <Description>
                    <DescriptionText>
                        Symfoni ID hjelper deg å svare på forespørsler knyttet
                        til din identitet.
                    </DescriptionText>
                </Description>
            </>
        </OnboardingContent>
    );
}

const Logo = styled(Image)`
    overflow: hidden;
    width: 140px;
    height: 140px;
    border-radius: 30px;
`;

const Figure = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Description = styled.View`
    font-size: 16px;
    text-align: center;
    justify-content: center;
`;
const DescriptionText = styled.Text`
    text-align: center;
`;
