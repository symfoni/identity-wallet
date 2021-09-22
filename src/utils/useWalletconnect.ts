/* eslint-disable no-undef */
import { BROK_HELPERS_VERIFIER } from "@env";
import {
    formatJsonRpcError,
    formatJsonRpcResult,
    JsonRpcError,
    JsonRpcResponse,
} from "@json-rpc-tools/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VerifiableCredential, VerifiablePresentation } from "@veramo/core";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { useCallback, useEffect, useState } from "react";
import { ForvaltRepositoryImpl } from "../domain/ForvaltRepository";
import {
    DEFAULT_APP_METADATA,
    DEFAULT_EIP155_METHODS,
    DEFAULT_RELAY_PROVIDER,
} from "./../constants/default";
import { goBack, navigate } from "./../navigation";
import { useVeramoInterface } from "./useVeramo";
import { normalizePresentation } from "did-jwt-vc";
import { CachedPairing } from "../types/CachedPairing";

export const useWalletconnect = (
    supportedChains: string[],
    veramo: useVeramoInterface,
    hasTrustedIdentity: boolean
) => {
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [proposals, setProposals] = useState<SessionTypes.Proposal[]>([]);
    const [requests, setRequests] = useState<SessionTypes.RequestEvent[]>([]);
    const [cachedPairing, setCachedPairing] = useState<CachedPairing>();


    // Init Walletconnect client
    useEffect(() => {
        const initClient = async () => {
            try {
                console.log(`Starting Client...`);
                const _client = await Client.init({
                    controller: true,
                    relayProvider: DEFAULT_RELAY_PROVIDER,
                    metadata: DEFAULT_APP_METADATA,
                    storageOptions: {
                        asyncStorage: AsyncStorage as any,
                    },
                });
                console.log("Client started!");
                setClient(_client);
            } catch (e) {
                console.log("Failed to start Client!");
                console.error(e);
            }
        };
        initClient();
        return () => {
            console.log("Destroyed client");
        };
    }, []);

    // Navigate modal if you have requests or proposals
    useEffect(() => {
        if (requests.length > 0) {
            navigate("Modal");
        }
        if (proposals.length > 0) {
            navigate("Modal");
        }
    }, [requests, proposals]);

    const pair = async (uri: string, requireTrustedIdentity: boolean) => {
        console.log(`In pair. Uri: ${uri}, requireTrustedIdentity: ${requireTrustedIdentity}`)
        console.log(`Has trusted identity: ${hasTrustedIdentity}`)
        if (requireTrustedIdentity) {
            if (!hasTrustedIdentity) {
                const initiatedTime = Date.now()
                const cachedPairing: CachedPairing = {
                    uri: uri,
                    timeInitiated: initiatedTime
                }

                setCachedPairing(cachedPairing)
                console.log("In Pair and cachedPairing is set")
                console.log(cachedPairing)
                navigate("Bankid")
            }
        } else {
            const pairResult = await client?.pair({ uri: uri })
            console.log("PairResult", pairResult)
        }
    }

    const handleRequest = useCallback(
        (_requestEvent: SessionTypes.RequestEvent) => {
            console.log("Received REQUEST: ", _requestEvent.request.params);
            setRequests((old) => [...old, _requestEvent]);
        },
        []
    );

    const handlePruposal = useCallback(
        (_proposal: SessionTypes.Proposal) => {
            console.log("Received PROPOSAL: ", _proposal);
            if (typeof client === "undefined") {
                return;
            }
            const unsupportedChains = [];
            _proposal.permissions.blockchain.chains.forEach((chainId) => {
                if (supportedChains.includes(chainId)) {
                    return;
                }
                unsupportedChains.push(chainId);
            });
            if (unsupportedChains.length) {
                return client.reject({ proposal: _proposal });
            }
            const unsupportedMethods: string[] = [];
            _proposal.permissions.jsonrpc.methods.forEach((method) => {
                if (DEFAULT_EIP155_METHODS.includes(method)) {
                    return;
                }
                unsupportedMethods.push(method);
            });
            if (unsupportedMethods.length) {
                return client.reject({ proposal: _proposal });
            }
            setProposals((old) => [...old, _proposal]);
        },
        [supportedChains, client]
    );

    const closeSession = async (topic: string) => {
        if (!client) {
            throw new Error("Client is not initialized");
        }
        client.disconnect({
            topic: topic,
            reason: {
                message: "User closed session from app.",
                code: 123,
            },
        });
    };

    const onApprove = async (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => {
        if ("proposer" in event) {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                const _accounts = veramo.accounts.filter((account) => {
                    const [namespace, reference] = account.split(":");
                    return event.permissions.blockchain.chains.includes(
                        `${namespace}:${reference}`
                    );
                });
                const response = {
                    state: { accounts: _accounts },
                };
                await client.approve({ proposal: event, response });
            } catch (e) {
                console.error(e);
            }
            setProposals(proposals.length > 1 ? proposals.slice(1) : []);
        } else if ("request" in event) {
            try {
                if (typeof client === "undefined") {
                    throw Error("Client not initialized on requst.");
                }

                //Default error
                let response: JsonRpcError | JsonRpcResponse =
                    formatJsonRpcError(
                        event.request.id,
                        "Unrecognised method not supported " +
                        event.request.method
                    );

                if (event.request.method === "eth_signTransaction") {
                    const result = await veramo.signEthTreansaction(
                        event.request.params[0]
                    );
                    response = formatJsonRpcResult(event.request.id, result);
                }
                if (event.request.method === "did_createVerifiableCredential") {
                    if (!event.request.params[0].payload) {
                        throw Error("Requires payload parameter");
                    }
                    if (!event.request.params[0].verifier) {
                        throw Error("Requires verifier parameter");
                    }
                    const vc = await veramo.createVC(
                        event.request.params[0].payload
                    );
                    const vp = await veramo.createVP(
                        event.request.params[0].verifier,
                        [vc]
                    );
                    // TODO @Asbjørn - Put the VP through User auth
                    response = formatJsonRpcResult(
                        event.request.id,
                        vp.proof.jwt
                    );
                }
                if (
                    event.request.method === "did_requestVerifiableCredential"
                ) {
                    const params = event.request.params[0];
                    console.log(
                        "did_createVerifiableCredential params =>",
                        params
                    );
                    if (params.type === "CapTableBoardDirector") {
                        if (!params.orgnr) {
                            throw Error("Requires orgnr parameter");
                        }
                        if (!params.verifier) {
                            throw Error("Requires verifier parameter");
                        }
                        const vc = await veramo.createVC({
                            orgnr: params.orgnr,
                        });
                        const vp = await veramo.createVP(
                            BROK_HELPERS_VERIFIER,
                            [vc]
                        );
                        const forvaltRepository = new ForvaltRepositoryImpl();
                        const res =
                            await forvaltRepository.requestBoardDirectorVerifiableCredential(
                                vp
                            );
                        veramo.saveVP(res.data);

                        const reqVP = normalizePresentation(res.data);
                        if (!reqVP.verifiableCredential) {
                            throw Error("No VC in response");
                        }

                        const approveVP = await veramo.createVP(
                            params.verifier,
                            reqVP.verifiableCredential?.map(
                                (vc) => vc.proof.jwt as string
                            )
                        );

                        response = formatJsonRpcResult(
                            event.request.id,
                            approveVP.proof.jwt
                        );
                    }
                }

                await client.respond({
                    topic: event.topic,
                    response,
                });
            } catch (e) {
                console.error(e);
            }

            setRequests(requests.length > 1 ? requests.slice(1) : []);
        }
        goBack();
    };

    const onReject = async (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => {
        if ("proposer" in event) {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                await client.reject({ proposal: event });
            } catch (e) {
                console.error(e);
            }
            setProposals(proposals.length > 1 ? proposals.slice(1) : []);
        } else if ("request" in event) {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                const response = formatJsonRpcError(
                    event.request.id,
                    "User Rejected Request"
                );
                await client.respond({
                    topic: event.topic,
                    response,
                });
            } catch (e) {
                console.error(e);
            }
            setRequests(requests.length > 1 ? requests.slice(1) : []);
        }
        goBack();
    };

    // Subscribe Walletconnect
    useEffect(() => {
        const subscribeClient = async () => {
            try {
                if (!client) {
                    return;
                }
                console.log("Subscribiing Client...");
                client.on(CLIENT_EVENTS.session.proposal, handlePruposal);
                client.on(CLIENT_EVENTS.session.request, handleRequest);
                console.log("Subscribed pruposal");
                console.log("Subscribed request");
            } catch (e) {
                console.log("Failed to subscribe Client!");
                console.error(e);
            }
        };
        subscribeClient();
        return () => {
            if (client) {
                client.removeListener(
                    CLIENT_EVENTS.session.proposal,
                    handlePruposal
                );
                client.removeListener(
                    CLIENT_EVENTS.session.request,
                    handleRequest
                );
            }
            console.log("Destroyed subscribe");
        };
    }, [client, handlePruposal, handleRequest]);

    return {
        client,
        proposals,
        requests,
        closeSession,
        onApprove,
        onReject,
        setProposals,
        setRequests,
        cachedPairing,
        pair
    };
};

