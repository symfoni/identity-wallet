import React, { useState } from "react";
import { Linking, Text } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import styled from "styled-components/native";
import { Icon } from "../../assets/icons/Icon";
import { useColorContext } from "../../colorContext";
import { SymfoniButton } from "../../components/ui/button";
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { layout } from "../../styles/sizing";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingBScreen() {
    const { navigateToOnboardingA, navigateToOnboardingC } =
        useLocalNavigation();
    const { colors } = useColorContext();

    const [visible, setVisible] = useState(false);
    const [next, setNext] = useState<(() => void) | undefined>(undefined);

    return (
        <OnboardingContent prev={navigateToOnboardingA} next={next} index={2}>
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
                    {!visible && (
                        <QrButton
                            icon="qr"
                            type="primary"
                            text={"Åpne QR"}
                            onPress={() => {
                                setVisible(true);
                                setNext(() => navigateToOnboardingC);
                            }}
                        />
                    )}
                </Figure>
                <Description>
                    <DescriptionText>
                        Koble til{" "}
                        <Hyperlink
                            color={colors.primary.light}
                            onPress={() =>
                                Linking.openURL("https://symfoni.dev/apps")
                            }>
                            tjenester
                        </Hyperlink>{" "}
                        med QR-leseren.
                    </DescriptionText>
                </Description>
            </>
        </OnboardingContent>
    );
}

const Figure = styled.View`
    flex: 1;
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

const Description = styled.View`
    font-size: 16px;
    text-align: center;
    justify-content: center;
`;
const DescriptionText = styled.Text``;

const Hyperlink = styled.Text`
    color: ${(props: { color: string }) => props.color};
    text-decoration-line: underline;
`;
