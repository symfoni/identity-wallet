import React from "react";
import { Button } from "react-native";
// Local
import { useSymfoniContext } from "../context";
import {
    NAVIGATOR_ROOT,
    SCREEN_BANKID,
    SCREEN_DEMO,
    SCREEN_VERIFIABLE_PRESENTATION,
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
import { ScreenError, ScreenResult } from "../types/ScreenResults";
import { makeAccessVC } from "../verifiableCredentials/AccessVC";
import { makeCapTableClaimTokenVC } from "../verifiableCredentials/CapTableClaimTokenVC";
import { makeCapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { makeCapTableUpdateShareholderVC } from "../verifiableCredentials/CapTableUpdateShareholderVC";
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
            | ScreenResult<VerifiablePresentationResult>
            | ScreenError;
    };
}) {
    const { findVCByType } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult(props.route.params);

    return (
        <>
            <Button
                title="Demo: Generic VP Screen"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_requestVerifiablePresentation",
                        params: {
                            title: "Del",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoNationalIdentityVC,
                                demoTermsOfUseForvaltVC,
                                demoTermsOfUseSymfoniVC,
                            ],
                        },
                    });

                    const { result, error } = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );

                    console.info({ result, error });
                }}
            />
            <Button
                title="Demo: Opprett aksjeeierbok"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_createCapTableVP",
                        params: {
                            title: "Godkjenn",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTableVC,
                                demoNationalIdentityVC,
                                demoTermsOfUseForvaltVC,
                                demoTermsOfUseSymfoniVC,
                            ],
                        },
                    });

                    console.info({ request });

                    const screenResult = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );

                    console.info({ screenResult });
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

                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_createCapTableVP-reuseable",
                        params: {
                            title: "Godkjenn",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTableVC,
                                nationalIdentityVC,
                                termsOfUseForvaltVC,
                                termsOfUseSymfoniVC,
                            ],
                        },
                    });

                    console.info({ request });

                    const { result, error } = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result, error });
                }}
            />
            <Button
                title="Demo: Overføre Aksjer"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_capTablePrivateTokenTransferVP",
                        params: {
                            title: "Tillat",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTablePrivateTransferTokenVC,
                                demoNationalIdentityVC,
                                demoTermsOfUseForvaltVC,
                                demoTermsOfUseSymfoniVC,
                            ],
                        },
                    });

                    const { result, error } = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result, error });
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

                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_capTablePrivateTokenTransferVP",
                        params: {
                            title: "Tillat",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTablePrivateTransferTokenVC,
                                nationalIdentityVC,
                                termsOfUseForvaltVC,
                                termsOfUseSymfoniVC,
                            ],
                        },
                    });

                    const { result, error } = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result, error });
                }}
            />
            <Button
                title="Demo: Gjør krav på aksjer"
                onPress={async () => {
                    const nationalIdentityVC =
                        ((await findVCByType(
                            demoNationalIdentityVC.type
                        )) as NationalIdentityVC) ?? demoNationalIdentityVC;

                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_capTableClaimToken",
                        params: {
                            title: "Godkjenn",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTableClaimTokenVC,
                                nationalIdentityVC,
                            ],
                        },
                    });

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Endre shareholder brukerdata"
                onPress={async () => {
                    const nationalIdentityVC =
                        ((await findVCByType(
                            demoNationalIdentityVC.type
                        )) as NationalIdentityVC) ?? demoNationalIdentityVC;

                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_capTableUpdateShareholder",
                        params: {
                            title: "Godkjenn",
                            verifier: demoVerifier,
                            verifiableCredentials: [
                                demoCapTableUpdateShareholderVC,
                                nationalIdentityVC,
                            ],
                        },
                    });

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

                    const request = makeVerifiablePresentationScreenRequest({
                        fromScreen: SCREEN_DEMO,
                        method: "demo_accessVP",
                        params: {
                            title: "Tillat",
                            verifier: {
                                id: "https://www.example.com",
                                name: "Brønnøysundregisteret",
                                reason: "Dele dine data",
                            },
                            verifiableCredentials: [
                                makeAccessVC({
                                    delegatedTo: {
                                        id: "Forvalt.no",
                                        name: "Brønnøysundregistrene Aksjeeierbok",
                                    },
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
                        },
                    });

                    const { result, error } = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );
                    console.info({ result, error });
                }}
            />
            <Button
                title="Demo: BankID"
                onPress={async () => {
                    const request = makeBankIDScreenRequest(
                        SCREEN_DEMO,
                        undefined,
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

const demoCapTableClaimTokenVC = makeCapTableClaimTokenVC(["0x1234556"]);

const demoCapTableUpdateShareholderVC = makeCapTableUpdateShareholderVC(
    "0x1234",
    "0x565654Adddress",
    {
        name: "Fredrik Olsberg",
        email: undefined,
        birthdate: "1980-02-08 09Z 09:30",
        postcode: "2609",
        city: "Lillehammer",
    }
);
