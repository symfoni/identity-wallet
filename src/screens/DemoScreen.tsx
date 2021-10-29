import React from "react";
import { Button } from "react-native";

// Local
import { useSymfoniContext } from "../context";
import {
    SCREEN_DEMO,
    SCREEN_BANKID,
    SCREEN_VERIFIABLE_PRESENTATION,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import {
    BankIDResult,
    VerifiablePresentationResult,
} from "../types/resultTypes";
import {
    makeBankIDScreenRequest,
    makeCreateCapTableVPScreenRequest,
    makeVerifiablePresentationScreenRequest,
} from "../types/ScreenRequest";
import { ScreenResult } from "../types/ScreenResults";
import { CapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { CapTableVC } from "../verifiableCredentials/CapTableVC";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
} from "../verifiableCredentials/TermsOfUseVC";

export function DemoScreen(props: {
    route: {
        params?:
            | ScreenResult<BankIDResult>
            | ScreenResult<VerifiablePresentationResult>;
    };
}) {
    const { findVCByType } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult(
        props.route.params?.result
    );

    return (
        <>
            <Button
                title="Demo: Generic VP Screen"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        "demo_requestVerifiablePresentation",
                        {
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoNationalIdentityVC,
                                demoTermsOfUseForvaltVC,
                                demoTermsOfUseSymfoniVC,
                            ],
                        }
                    );

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );

                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Opprett aksjeeierbok"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        "demo_createCapTableVP",
                        {
                            verifier: demoVerifier,

                            verifiableCredentials: [
                                demoCapTableVC,
                                demoNationalIdentityVC,
                                demoTermsOfUseForvaltVC,
                                demoTermsOfUseSymfoniVC,
                            ],
                        }
                    );

                    console.info({ request });

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Opprett aksjeeierbok (med gjenbruk)"
                onPress={async () => {
                    const termsOfUseForvaltVC =
                        ((await findVCByType(
                            demoTermsOfUseForvaltVC.type
                        )) as TermsOfUseForvaltVC) ?? demoTermsOfUseForvaltVC;

                    const termsOfUseSymfoniVC =
                        ((await findVCByType(
                            demoTermsOfUseSymfoniVC.type
                        )) as TermsOfUseSymfoniVC) ?? demoTermsOfUseSymfoniVC;

                    const nationalIdentityVC =
                        ((await findVCByType(
                            demoNationalIdentityVC.type
                        )) as NationalIdentityVC) ?? demoNationalIdentityVC;

                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        "demo_createCapTableVP-reuseable",
                        {
                            verifier: demoVerifier,

                            verifiableCredentials: [
                                demoCapTableVC,
                                nationalIdentityVC,
                                termsOfUseForvaltVC,
                                termsOfUseSymfoniVC,
                            ],
                        }
                    );

                    console.info({ request });

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Overføre Aksjer"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        "demo_capTablePrivateTokenTransferVP",
                        {
                            verifier: demoVerifier,

                            verifiableCredentials: [
                                demoCapTablePrivateTransferTokenVC,
                                demoNationalIdentityVC,
                                demoTermsOfUseForvaltVC,
                                demoTermsOfUseSymfoniVC,
                            ],
                        }
                    );

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Overføre Aksjer (med gjenbruk)"
                onPress={async () => {
                    const termsOfUseForvaltVC =
                        ((await findVCByType(
                            demoTermsOfUseForvaltVC.type
                        )) as TermsOfUseForvaltVC) ?? demoTermsOfUseForvaltVC;

                    const termsOfUseSymfoniVC =
                        ((await findVCByType(
                            demoTermsOfUseSymfoniVC.type
                        )) as TermsOfUseSymfoniVC) ?? demoTermsOfUseSymfoniVC;

                    const nationalIdentityVC =
                        ((await findVCByType(
                            demoNationalIdentityVC.type
                        )) as NationalIdentityVC) ?? demoNationalIdentityVC;

                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        "demo_capTablePrivateTokenTransferVP",
                        {
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTablePrivateTransferTokenVC,
                                nationalIdentityVC,
                                termsOfUseForvaltVC,
                                termsOfUseSymfoniVC,
                            ],
                        }
                    );

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: BankID"
                onPress={async () => {
                    const request = makeBankIDScreenRequest(
                        SCREEN_DEMO,
                        "Demo_bankIDRequest",
                        {}
                    );

                    const result = await navigateWithResult(
                        SCREEN_BANKID,
                        request
                    );

                    console.info({ result });
                }}
            />
        </>
    );
}

const demoVerifier = {
    id: "https://www.example.com",
    name: "Demo skjerm",
    reason: "Demonstrere generisk VPskjerm",
};

const demoNationalIdentityVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "NationalIdentityVC"],
} as NationalIdentityVC;

const demoTermsOfUseForvaltVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseForvaltVC"],
    credentialSubject: {
        readAndAccepted: {
            id: "https://forvalt.no/TOA",
        },
    },
} as TermsOfUseForvaltVC;

const demoTermsOfUseSymfoniVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseSymfoniVC"],
    credentialSubject: {
        readAndAccepted: {
            id: "https://symfoni.id/TOA",
        },
    },
} as TermsOfUseSymfoniVC;

const demoCapTableVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "CapTableVC"],
    credentialSubject: {
        capTable: {
            organizationNumber: "demo",
            shareholders: [],
        },
    },
} as CapTableVC;

const demoCapTablePrivateTransferTokenVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "CapTablePrivateTokenTransferVC"],
    credentialSubject: {
        toShareholder: {
            name: "Jon Ramvi",
            amount: "22",
        },
    },
} as CapTablePrivateTokenTransferVC;
