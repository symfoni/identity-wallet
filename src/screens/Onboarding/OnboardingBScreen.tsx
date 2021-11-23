import React from "react";
import { Linking } from "react-native";
import styled from "styled-components/native";
// Local
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

    return (
        <OnboardingContent
            prev={navigateToOnboardingA}
            next={navigateToOnboardingC}
            index={2}>
            <>
                <Figure>
                    <QrIcon type="qr" size={layout.x100} color="black" />
                    <FingerText>👆</FingerText>
                    <QrButton icon="qr" type="primary" text={"Åpne QR"} />
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
