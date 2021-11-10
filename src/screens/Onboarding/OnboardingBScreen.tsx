import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { Icon } from "../../assets/icons/Icon";
import { SymfoniButton } from "../../components/ui/button";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { layout } from "../../styles/sizing";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingBScreen() {
    const { navigateToOnboardingA, navigateToOnboardingC } =
        useLocalNavigation();

    return (
        <OnboardingContent
            prev={navigateToOnboardingA}
            next={navigateToOnboardingC}>
            <>
                <Figure>
                    <QrIcon type="qr" size={layout.x100} color="black" />
                    <FingerText>{"👆"}</FingerText>
                    <QrButton
                        icon="qr"
                        type="primary"
                        text="Scan QR"
                        onPress={() => {}}
                    />
                </Figure>
                <Description>
                    Bruk QR-leseren i Symfoni ID for å koble til tjenester som
                    støtter dette.
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

const QrIcon = styled(Icon)``;

const QrButton = styled(SymfoniButton)`
    margin-bottom: 30px;
`;

const FingerText = styled.Text`
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 30px;
`;

const Description = styled.Text`
    flex: 1;
    font-size: 16px;
    text-align: center;
`;
