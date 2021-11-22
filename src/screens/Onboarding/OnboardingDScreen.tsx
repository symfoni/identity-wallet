import React, { ReactNode, useState } from "react";
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

export function OnboardingDScreen() {
    const { navigateToOnboardingC, navigateHome } = useLocalNavigation();
    const { checkDeviceAuthentication } = useDeviceAuthentication();
    const { createVC, findVCByType } = useSymfoniContext();
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
                "ERROR OnboardingDScreen.tsx",
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

    return (
        <OnboardingContent
            prev={navigateToOnboardingC}
            next={signed ? navigateHome : undefined}
            index={4}>
            <>
                <Figure>
                    <TermsOfUseTitle>
                        <Title>Brukervilkår</Title>
                    </TermsOfUseTitle>
                    <TermsOfUseBody>
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
                    </TermsOfUseBody>
                </Figure>
                <Description>
                    <DescriptionText>
                        {!signed
                            ? "Godta brukervilkårene, for å komme i gang."
                            : "Brukervilkår godtatt 🎉"}
                    </DescriptionText>
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
    flex: 1;
    align-self: stretch;
    justify-content: center;
`;

const Description = styled.View`
    font-size: 16px;
    text-align: center;
    justify-content: center;
`;
const DescriptionText = styled.Text``;

const Title = styled.Text`
    font-size: 22px;
    font-weight: 500;
    flex: 1;
`;

// Explains
const TermsOfUseTitle = styled.View`
    display: flex;
    flex-direction: row;
    align-items: baseline;
`;

const TermsOfUseBody = styled.View`
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 20px;
`;
