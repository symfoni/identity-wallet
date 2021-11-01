import React from "react";
import { Button } from "react-native";

// Local
import { useSymfoniContext } from "../context";
import {
    SCREEN_DEMO,
    SCREEN_BANKID,
    SCREEN_VERIFIABLE_PRESENTATION,
    NAVIGATOR_ROOT,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import {
    BankIDResult,
    VerifiablePresentationResult,
} from "../types/resultTypes";
import {
    makeBankIDScreenRequest,
    makeVerifiablePresentationScreenRequest,
} from "../types/ScreenRequest";
import { ScreenResult } from "../types/ScreenResults";
import { makeAccessVC } from "../verifiableCredentials/AccessVC";
import { makeCapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { makeCapTableVC } from "../verifiableCredentials/CapTableVC";
import {
    makeNationalIdentityVC,
    NationalIdentityVC,
} from "../verifiableCredentials/NationalIdentityVC";
import {
    makeTermsOfUseForvaltVC,
    makeTermsOfUseSymfoniVC,
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
                        undefined,
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
                        undefined,
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
                        undefined,
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
                        undefined,
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
                        undefined,
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
                title="Demo: Dele dine data"
                onPress={async () => {
                    const nationalIdentityVC =
                        ((await findVCByType(
                            demoNationalIdentityVC.type
                        )) as NationalIdentityVC) ?? demoNationalIdentityVC;

                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        undefined,
                        "demo_accessVP",
                        {
                            verifier: {
                                id: "https://www.example.com",
                                name: "Brønnøysundregisteret",
                                reason: "Dele dine data",
                            },
                            verifiableCredentials: [
                                makeAccessVC({
                                    delegatedTo: { id: "Forvalt.no" },
                                    scopes: [
                                        {
                                            id: "example.com/age",
                                            name: "Alder",
                                        },
                                        {
                                            id: "example.com/roles",
                                            name: "Rolle i selskapet",
                                        },
                                    ],
                                }),
                                nationalIdentityVC,
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
                        NAVIGATOR_ROOT,
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

const demoNationalIdentityVC = makeNationalIdentityVC();

const demoTermsOfUseForvaltVC = makeTermsOfUseForvaltVC();

const demoTermsOfUseSymfoniVC = makeTermsOfUseSymfoniVC();

const demoCapTableVC = makeCapTableVC({
    organizationNumber: "demo",
    shareholders: [],
});

const demoCapTablePrivateTransferTokenVC = makeCapTablePrivateTokenTransferVC({
    name: "demo",
    amount: "1337",
});
