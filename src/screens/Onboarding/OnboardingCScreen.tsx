import React, { ReactNode, useState } from "react";
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
    const [next, setNext] = useState<(() => void) | undefined>(undefined);
    const [vc] = useState<NationalIdentityVC>(() => {
        const _vc = makeNationalIdentityVC();
        _vc.credentialSubject.nationalIdentityNumber = "123456 98765";
        _vc.proof = { jwt: "hey", type: "onboarding" };
        return _vc;
    });
    const signed = !!vc?.proof;

    function onAnswer() {
        setNext(() => (next ? undefined : navigateToOnboardingD));
    }

    return (
        <OnboardingContent prev={navigateToOnboardingB} next={next}>
            <>
                <Figure>
                    <ExplainCancel>
                        <Title>Forespørsel</Title>
                        <DeclineButton
                            disabled={!signed}
                            title="Avslå"
                            onPress={onAnswer}
                        />
                        <FingerCancel hidden={!!next}>{"👈"}</FingerCancel>
                    </ExplainCancel>
                    <ExplainSignature>
                        {vc && (
                            <NationalIdentityVCCard
                                vc={vc}
                                onPressSign={(_vc) => setNext(undefined)}
                                flex={1}
                            />
                        )}
                        <FingerSignature hidden={true}>{"👈"}</FingerSignature>
                    </ExplainSignature>
                    <ExplainPresent>
                        <PresentButton disabled={!signed} onPress={onAnswer}>
                            Svar
                        </PresentButton>
                        <FingerPresent hidden={!!next || !signed}>
                            {"👈"}
                        </FingerPresent>
                    </ExplainPresent>
                </Figure>
                <Description>Svar eller avslå forespørsler.</Description>
            </>
        </OnboardingContent>
    );
}

const Figure = styled.View`
    flex: 3;
    align-self: stretch;
    justify-content: center;
`;

const Description = styled.Text`
    flex: 1;
    font-size: 16px;
    text-align: center;
`;

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
    ${({ hidden }: { hidden: boolean }) => (hidden ? "opacity: 0;" : "")}
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
    ${({ hidden }: { hidden: boolean }) => (hidden ? "opacity: 0;" : "")}
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
        <PresentButtonView color={disabled} onPress={onPress}>
            <PresentButtonText>{children}</PresentButtonText>
        </PresentButtonView>
    );
}

const PresentButtonView = styled.TouchableOpacity`
    background-color: ${(props: { color: boolean }) =>
        !props.color ? "rgb(52, 199, 89)" : "rgb(209, 209, 214)"}
    
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
