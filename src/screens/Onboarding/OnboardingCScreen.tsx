import React, { useState } from "react";
import styled from "styled-components/native";
// Local
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import {
    makeNationalIdentityVC,
    NationalIdentityVC,
} from "../../verifiableCredentials/NationalIdentityVC";
import { NationalIdentityVCCard } from "../../verifiableCredentials/NationalIdentityVCCard";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingCScreen() {
    const { navigateToOnboardingB, navigateToOnboardingD } =
        useLocalNavigation();

    const [dummyVC] = useState<NationalIdentityVC>(() => {
        const _vc = makeNationalIdentityVC();
        _vc.credentialSubject.nationalIdentityNumber = "123456 98765";
        _vc.proof = { jwt: "hey", type: "onboarding" };
        return _vc;
    });

    return (
        <OnboardingContent
            prev={navigateToOnboardingB}
            next={navigateToOnboardingD}
            index={3}>
            <>
                <Figure>
                    <ExplainCancel>
                        <Title>Forespørsel</Title>
                        <DeclineButton title="Avslå" onPress={() => {}} />
                        <FingerCancel>👈</FingerCancel>
                    </ExplainCancel>
                    <ExplainSignature>
                        <NationalIdentityVCCard
                            vc={dummyVC}
                            onPressSign={(_vc) => {}}
                            flex={1}
                        />
                        <FingerSignature hidden={true}>👈</FingerSignature>
                    </ExplainSignature>
                    <ExplainPresent>
                        <PresentButtonView>
                            <PresentButtonText>Svar</PresentButtonText>
                        </PresentButtonView>
                        <FingerPresent>👈</FingerPresent>
                    </ExplainPresent>
                </Figure>
                <Description>
                    <DescriptionText>
                        Svar på, eller avslå, forespørsler.
                    </DescriptionText>
                </Description>
            </>
        </OnboardingContent>
    );
}

const Figure = styled.View`
    flex: 1;
    align-self: stretch;
    justify-content: center;
`;

const Description = styled.View`
    font-size: 16px;
    text-align: left;
    justify-content: center;
`;
const DescriptionText = styled.Text``;

const Title = styled.Text`
    font-size: 22px;
    font-weight: 500;
    flex: 1;
`;

// Explains
const ExplainCancel = styled.View`
    display: flex;
    flex-direction: row;
    align-items: baseline;
`;

const ExplainSignature = styled.View`
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 20px;
`;

const ExplainPresent = styled.View`
    flex-direction: row;
    justify-content: flex-end;
`;

// Fingers
const FingerCancel = styled.Text`
    font-size: 18px;
    margin-left: 5px;
`;
const FingerSignature = styled.Text`
    font-size: 18px;
    margin-left: 5px;
    margin-bottom: 15px;
    ${({ hidden }: { hidden: boolean }) => (hidden ? "opacity: 0;" : "")}
`;
const FingerPresent = styled.Text`
    font-size: 18px;
    margin-top: 6px;
    margin-left: 10px;
`;

// Things
const DeclineButton = styled.Button``;

const PresentButtonView = styled.TouchableOpacity`
    background-color: rgb(52, 199, 89);

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
