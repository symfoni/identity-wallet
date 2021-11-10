import React, { ReactNode, useState } from "react";
import styled from "styled-components/native";

// Local
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { makeNationalIdentityVC } from "../../verifiableCredentials/NationalIdentityVC";
import { NationalIdentityVCCard } from "../../verifiableCredentials/NationalIdentityVCCard";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingCScreen() {
    const { navigateToOnboardingB, navigateToOnboardingD } =
        useLocalNavigation();

    const [vc, setVC] = useState(makeNationalIdentityVC());

    vc.credentialSubject.nationalIdentityNumber = "123456 98765";
    vc.expirationDate = expiresIn24Hours();
    function onSign() {
        setVC({
            ...vc,
            proof: { type: "www.example.com", jwt: "jwt.example.jwt" },
        });
    }
    function onDecline() {
        setVC({
            ...vc,
            proof: undefined,
        });
    }

    return (
        <OnboardingContent
            prev={navigateToOnboardingB}
            next={navigateToOnboardingD}>
            <>
                <Figure>
                    <ExplainCancel>
                        <Title>Vis legitimasjon</Title>
                        <DeclineButton title="Avslå" onPress={onDecline} />
                        <FingerCancel>{"(1)"}</FingerCancel>
                    </ExplainCancel>
                    <ExplainSignature>
                        <NationalIdentityVCCard vc={vc} onPressSign={onSign} />
                        <FingerSignature>{"(2)"}</FingerSignature>
                    </ExplainSignature>
                    <ExplainPresent>
                        <PresentButton disabled={!vc.proof} onPress={() => {}}>
                            Svar
                        </PresentButton>
                        <FingerPresent>{"(3)"}</FingerPresent>
                    </ExplainPresent>
                </Figure>
                <Description>
                    {" "}
                    Når en tjeneste ber om legitimasjon, kan du velge avslå (1)
                    eller svar (3).
                </Description>
            </>
        </OnboardingContent>
    );
}

function expiresIn24Hours() {
    return new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
}

const Figure = styled.View`
    flex: 3;
    justify-content: center;
    align-items: center;
    margin-left: 30px;
    width: 285px;
`;

const Description = styled.Text`
    flex: 1;
    font-size: 16px;
    text-align: center;
`;

const Title = styled.Text`
    font-size: 22px;
    font-weight: 500;
    margin-right: 20px;
`;

// Explains
const ExplainCancel = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: baseline;
    width: 100%;
    margin-right: 50px;
`;

const ExplainSignature = styled.View`
    flex-direction: row;
    align-items: flex-end;
    width: 100%;
    margin-bottom: 20px;
`;

const ExplainPresent = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 50px;
    width: 100%;
`;

// Fingers
const FingerCancel = styled.Text`
    margin-left: 5px;
    font-size: 18px;
`;
const FingerSignature = styled.Text`
    font-size: 18px;
    margin-left: 5px;
    margin-bottom: 15px;
`;
const FingerPresent = styled.Text`
    font-size: 18px;
    margin-top: 6px;
    margin-left: 10px;
`;

// Things
const DeclineButton = styled.Button``;

export function PresentButton({
    children,
    onPress,
    disabled,
}: {
    disabled: boolean;
    children: ReactNode;
    onPress: () => void;
}) {
    return (
        <PresentButtonView disabled={disabled} onPress={onPress}>
            <PresentButtonText>{children}</PresentButtonText>
        </PresentButtonView>
    );
}

const PresentButtonView = styled.TouchableOpacity`
    background-color: ${(props: { disabled: boolean }) =>
        !props.disabled ? "rgb(52, 199, 89)" : "rgb(209, 209, 214)"}
    
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 40px;
    border-radius: 10px;
    width: 150px;
    align-self: center;
`;
const PresentButtonText = styled.Text`
    color: rgb(255, 255, 255);
    font-weight: 500;
    font-size: 15px;
`;
