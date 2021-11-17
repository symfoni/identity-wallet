import React, { useState } from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import styled from "styled-components/native";
import { Icon } from "../../assets/icons/Icon";
import { SymfoniButton } from "../../components/ui/button";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { layout } from "../../styles/sizing";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingBScreen() {
    const { navigateToOnboardingA, navigateToOnboardingC } =
        useLocalNavigation();

    const [visible, setVisible] = useState(false);
    const [next, setNext] = useState<(() => void) | undefined>(undefined);

    return (
        <OnboardingContent prev={navigateToOnboardingA} next={next}>
            <>
                <Figure>
                    {!visible ? (
                        <QrIcon type="qr" size={layout.x100} color="black" />
                    ) : (
                        <QRCodeScanner
                            onRead={() => setVisible(false)}
                            fadeIn={false}
                            showMarker={true}
                        />
                    )}
                    {!visible && <FingerText>{!next ? "👆" : ""}</FingerText>}
                    <QrButton
                        icon="qr"
                        type="primary"
                        text={visible ? "Lukk QR" : "Åpne QR"}
                        onPress={() => {
                            setVisible(!visible);
                            setNext(() => navigateToOnboardingC);
                        }}
                    />
                </Figure>
                <Description>
                    Åpne QR-leseren i Symfoni ID for å koble til tjenester.
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
