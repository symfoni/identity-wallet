import React, { ReactNode, useEffect, useState } from "react";
import styled from "styled-components/native";
import useAsyncEffect from "use-async-effect";
import { useSymfoniContext } from "../../context";
import { useDeviceAuthentication } from "../../hooks/useDeviceAuthentication";

// Local
import { useLocalNavigation } from "../../hooks/useLocalNavigation";
import { SupportedVerifiableCredential } from "../../verifiableCredentials/SupportedVerifiableCredentials";
import {
    TermsOfUseSymfoniVC,
    TermsOfUseVC,
} from "../../verifiableCredentials/TermsOfUseVC";
import { makeTermsOfUseSymfoniVC } from "../../verifiableCredentials/TermsOfUseVC";
import { TermsOfUseVCCard } from "../../verifiableCredentials/TermsOfUseVCCard";
import { OnboardingContent } from "./components/OnboardingContent";

export function OnboardingCScreen() {
    const { navigateToOnboardingB, navigateHome } = useLocalNavigation();
    const { checkDeviceAuthentication } = useDeviceAuthentication();
    const { createVC, findVCByType } = useSymfoniContext();
    const [next, setNext] = useState<(() => void) | undefined>(undefined);
    const [declined, setDeclined] = useState(false);
    const [vc, setVC] = useState<SupportedVerifiableCredential | undefined>();
    const signed = !!vc?.proof;

    /** Async effect - Load VC */
    useAsyncEffect(async () => {
        let termsOfUseSymfoniVC = makeTermsOfUseSymfoniVC();
        try {
            termsOfUseSymfoniVC =
                ((await findVCByType(
                    makeTermsOfUseSymfoniVC().type
                )) as TermsOfUseSymfoniVC) ?? makeTermsOfUseSymfoniVC();
        } catch (err) {
            console.warn(
                "ERROR OnboardingCScreen.tsx",
                "await findVCByType(makeTermsOfUseSymfoniVC().type)",
                err
            );
            return;
        }
        setVC(termsOfUseSymfoniVC);
    }, []);

    /** Callback - On press sign terms of use */
    async function onPressSignTermsOfUse(
        _vc: TermsOfUseVC,
        expirationDate: string
    ) {
        const authenticated = await checkDeviceAuthentication();
        if (!authenticated) {
            console.warn(
                "useVerifiableCredentialCards.tsx: onPressSignCard(): !authenticated "
            );
            return;
        }
        try {
            const signedVC = (await createVC({
                credential: {
                    ..._vc,
                    expirationDate,
                },
            })) as SupportedVerifiableCredential;
            setVC(signedVC);
        } catch (err) {
            console.warn(
                "useVerifiableCredentialCards.tsx: : onPressSignCard(): await veramo.createVC() -> error: ",
                err
            );
        }
    }

    function onDecline() {
        setDeclined(true);
    }

    function onAnswer() {
        setNext(() => navigateHome);
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
                            onPress={onDecline}
                        />
                        <FingerCancel hidden={!signed || declined}>
                            {"👈"}
                        </FingerCancel>
                    </ExplainCancel>
                    <ExplainSignature>
                        {vc && (
                            <TermsOfUseVCCard
                                vc={vc as TermsOfUseVC}
                                onPressSign={(_vc) =>
                                    onPressSignTermsOfUse(
                                        _vc,
                                        expiresIn50Years()
                                    )
                                }
                                flex={1}
                            />
                        )}
                        <FingerSignature hidden={!!next || signed}>
                            {"👈"}
                        </FingerSignature>
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
                <Description>
                    <HighlightText highlight={!signed}>
                        1. Signer brukervilkårene til Symfoni ID.
                    </HighlightText>
                    <HighlightText highlight={signed && !next}>
                        2. Avslå eller Svar på forespørsler fra tilkoblede
                        tjenester.
                    </HighlightText>
                    <HighlightText highlight={!!next}>
                        3. Forespørsel besvart! 🎉
                    </HighlightText>
                </Description>
            </>
        </OnboardingContent>
    );
}

function expiresIn50Years() {
    return new Date(
        new Date().setFullYear(new Date().getFullYear() + 50)
    ).toISOString();
}

const Figure = styled.View`
    flex: 3;
    align-self: stretch;
    justify-content: center;
`;

const Description = styled.View`
    flex: 1;
    font-size: 16px;
    text-align: center;
`;

const Title = styled.Text`
    font-size: 22px;
    font-weight: 500;
    flex: 1;
`;

const HighlightText = styled.Text`
    padding-bottom: 5px;
    ${({ highlight }: { highlight: boolean }) =>
        highlight ? "opacity: 1;" : "opacity: 0.1;"};
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
