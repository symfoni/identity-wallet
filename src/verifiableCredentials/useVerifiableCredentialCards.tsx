// React
import React, { useMemo } from "react";
import { Text } from "react-native";

// Local
import { NationalIdentityVC } from "./NationalIdentityVC";
import { NationalIdentityVCCard } from "./NationalIdentityVCCard";
import { TermsOfUseForvaltVC, TermsOfUseSymfoniVC } from "./TermsOfUseVC";
import { SupportedVerifiableCredential } from "./SupportedVerifiableCredentials";
import { TermsOfUseVCCard } from "./TermsOfUseVCCard";

// Hook
export function useVerifiableCredentialCards(
    verifiableCredentials: SupportedVerifiableCredential[],
    onSigned: (vc: SupportedVerifiableCredential) => void
) {
    const cards = useMemo(
        () =>
            verifiableCredentials.map((vc) => {
                switch (vc["@context"][0]) {
                    case "https://www.w3.org/2018/credentials/v1": {
                        switch (vc["@context"][1]) {
                            case "https://www.symfoni.id/credentials/v1": {
                                switch (vc.type[0]) {
                                    case "VerifiableCredential": {
                                        switch (vc.type[1]) {
                                            case "NationalIdentityVC": {
                                                return (
                                                    <NationalIdentityVCCard
                                                        vc={
                                                            vc as NationalIdentityVC
                                                        }
                                                        onSigned={onSigned}
                                                    />
                                                );
                                            }
                                            case "TermsOfUseForvaltVC": {
                                                return (
                                                    <TermsOfUseVCCard
                                                        vc={
                                                            vc as TermsOfUseForvaltVC
                                                        }
                                                        VCType="TermsOfUseForvaltVC"
                                                        termsOfUseID="https://forvalt.no/TOA"
                                                        onSigned={onSigned}
                                                    />
                                                );
                                            }
                                            case "TermsOfUseSymfoniVC": {
                                                return (
                                                    <TermsOfUseVCCard
                                                        vc={
                                                            vc as TermsOfUseSymfoniVC
                                                        }
                                                        VCType="TermsOfUseSymfoniVC"
                                                        termsOfUseID="https://symfoni.id/TOA"
                                                        onSigned={onSigned}
                                                    />
                                                );
                                            }
                                            //
                                            // The rest is default fallback cases
                                            //
                                            default: {
                                                console.warn(
                                                    `useVerifiableCredentialCards.tsx: Unknown vc.type[1]: ${vc.type[1]}`
                                                );
                                                return (
                                                    <Text>
                                                        Unknown VC Type{" "}
                                                        {vc.type[1]}
                                                    </Text>
                                                );
                                            }
                                        }
                                    }
                                    default: {
                                        console.warn(
                                            `useVerifiableCredentialCards.tsx: Unknown vc.type[0]: ${vc.type[0]}`
                                        );
                                        return (
                                            <Text>
                                                Unknown VC Type {vc.type[0]}
                                            </Text>
                                        );
                                    }
                                }
                            }
                            default: {
                                console.warn(
                                    `useVerifiableCredentialCards.tsx: Unknown vc["@context"][1]: ${vc["@context"][1]}`
                                );
                                return (
                                    <Text>
                                        Unknown VC Context {vc["@context"][1]}
                                    </Text>
                                );
                            }
                        }
                    }
                    default: {
                        console.warn(
                            `useVerifiableCredentialCards.tsx: Unknown vc["@context"][0]: ${vc["@context"][0]}`
                        );
                        return (
                            <Text>Unknown VC Context {vc["@context"][0]}</Text>
                        );
                    }
                }
            }),

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [verifiableCredentials]
    );

    return cards;
}
