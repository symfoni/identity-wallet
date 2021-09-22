/* eslint-disable no-undef */
import {
    APP_ENV,
    BANKID_CLIENT_ID,
    BROK_HELPERS_VERIFIER,
    IS_TEST,
} from "@env";
import {
    IDataStore,
    IDIDManager,
    IIdentifier,
    IKeyManager,
    IResolver,
    TAgent,
    VerifiableCredential,
    VerifiablePresentation,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
import {
    FindArgs,
    IDataStoreORM,
    TCredentialColumns,
    UniqueVerifiableCredential,
} from "@veramo/data-store";
import Client from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { ethers } from "ethers";
import React, {
    createContext,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import {
    DEFAULT_MAIN_CHAINS,
    DEFAULT_RPC_PROVIDER_MAIN,
    DEFAULT_RPC_PROVIDER_TEST,
    DEFAULT_TEST_CHAINS,
} from "./constants/default";
import { navigate } from "./navigation";
import { CachedPairing } from "./types/CachedPairing";
import { useVeramo } from "./utils/useVeramo";
import { useWalletconnect } from "./utils/useWalletconnect";

export type Agent = TAgent<
    IDIDManager &
        IKeyManager &
        IDataStore &
        IDataStoreORM &
        IResolver &
        ICredentialIssuer
>;
export type Dispatch<T = any> = React.Dispatch<React.SetStateAction<T>>;

export interface IContext {
    isTest: boolean;
    loading: boolean;
    chains: string[];
    accounts: string[];
    client: Client | undefined;
    proposals: SessionTypes.Proposal[];
    setProposals: Dispatch<SessionTypes.Proposal[]>;
    requests: SessionTypes.RequestEvent[];
    cachedPairing: CachedPairing | undefined;
    setRequests: Dispatch<SessionTypes.RequestEvent[]>;
    closeSession: (topic: string) => Promise<void>;
    onApprove: (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => Promise<void>;
    onReject: (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => Promise<void>;
    selectedChain: string;
    provider: ethers.providers.Provider;
    identity?: IIdentifier;
    deleteVeramoData: () => void;
    createVC: (data: Record<string, any>) => Promise<VerifiableCredential>;
    createVP: (
        verifier: string,
        verifiableCredentials: VerifiableCredential[] | string[]
    ) => Promise<VerifiablePresentation>;
    decodeJWT: (
        jwt: string,
        verifyOptions?: Partial<VerifyOptions> | undefined
    ) => Promise<JwtPayload>;
    findVC: (
        args: FindArgs<TCredentialColumns>
    ) => Promise<UniqueVerifiableCredential[]>;
    saveVP: (vp: VerifiablePresentation | string) => Promise<string>;
    pair: (uri: string, requireTrustedIdentity: boolean) => Promise<void>;
}

export const Context = createContext<IContext>(undefined!);

console.log("APP_ENV:", APP_ENV);

export const ContextProvider = (props: any) => {
    const [isTest] = useState(IS_TEST ? true : false);
    const [loading, setLoading] = useState<boolean>(true);
    const [chains] = useState<string[]>(
        isTest ? DEFAULT_TEST_CHAINS : DEFAULT_MAIN_CHAINS
    );
    const [selectedChain, setSelectedChain] = useState(
        isTest ? DEFAULT_TEST_CHAINS[0] : DEFAULT_MAIN_CHAINS[0]
    );
    const [provider] = useState(
        () =>
            new ethers.providers.JsonRpcProvider({
                url: isTest
                    ? DEFAULT_RPC_PROVIDER_TEST
                    : DEFAULT_RPC_PROVIDER_MAIN,
            })
    );
    const veramo = useVeramo(selectedChain);
    const [hasTrustedIndentity, setHasTrustedIndentity] =
        useState<boolean>(false);
    const walletconnect = useWalletconnect(chains, veramo, hasTrustedIndentity);

    // Loading
    useEffect(() => {
        if (veramo.accounts.length > 0) {
            setLoading(false);
        }
    }, [veramo.accounts]);

    // Check if user got indetifier
    useEffect(() => {
        let subscribed = true;
        const doAsync = async () => {
            if (veramo.accounts.length > 0) {
                const address = veramo.accounts[0].split(":").pop();
                if (address) {
                    const vc = await veramo
                        .findVC({
                            where: [
                                {
                                    column: "issuer",
                                    value: [BROK_HELPERS_VERIFIER],
                                },
                                // {
                                //     column: "subject",
                                //     value: [veramo.identity?.did],
                                // },
                            ],
                        })
                        .catch((err) => {
                            console.error(err.message);
                            throw err;
                        });
                    const hasRegistered = vc.find((vc) => {
                        return (
                            "brregRegistered" in
                            vc.verifiableCredential.credentialSubject
                        );
                    });
                    console.info("hasTrustedIndentity", !!hasRegistered);
                    if (subscribed) {
                        setHasTrustedIndentity(!!hasRegistered);
                    }
                }
            }
        };
        doAsync();
        return () => {
            subscribed = false;
        };
    }, [veramo, veramo.accounts]);

    // Make the context object:
    const context: IContext = {
        isTest,
        loading,
        chains,
        provider,
        selectedChain,
        ...walletconnect,
        ...veramo,
    };

    // pass the value in provider and return
    return (
        <Context.Provider value={context}>{props.children}</Context.Provider>
    );
};

export const { Consumer } = Context;
export interface VerifyOptions {
    audience: string;
    complete: boolean;
    issuer: string | string[];
    ignoreExpiration: boolean;
    ignoreNotBefore: boolean;
    subject: string;
    decodeCredentials: boolean;
    requireVerifiablePresentation: boolean;
}

export interface JwtPayload {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
}
