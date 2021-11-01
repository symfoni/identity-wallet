/* eslint-disable no-undef */
import { JsonRpcResponse } from "@json-rpc-tools/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { useCallback, useEffect, useRef, useState } from "react";

import {
    DEFAULT_APP_METADATA,
    DEFAULT_EIP155_METHODS,
    DEFAULT_RELAY_PROVIDER,
} from "./../constants/default";
import { useVeramoInterface } from "./useVeramo";

export const useWalletconnect = (
    supportedChains: string[],
    veramo: useVeramoInterface
) => {
    const [client, setClient] = useState<Client | undefined>(undefined);

    // Handle requests
    const requestResolvers = useRef(
        new Map<string, (event: SessionTypes.RequestEvent) => void>()
    );

    const consumeEvent = (method: string) => {
        console.info(`useWalletConnect.ts: Subscribed to request: ${method}`);
        return new Promise<SessionTypes.RequestEvent>((resolve) => {
            requestResolvers.current.set(method, resolve);
        });
    };

    const handleRequest = useCallback((event: SessionTypes.RequestEvent) => {
        console.info(
            "useWalletConnect.ts: handleRequest(): ",
            event.request.method
        );
        requestResolvers.current.get(event.request.method)?.(event);
        requestResolvers.current.delete(event.request.method);
    }, []);

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
                console.warn(e);
            }
        };
        initClient();
        return () => {
            console.log("Destroyed client");
        };
    }, []);

    const pair = async (uri: string) => {
        console.log(`pair(): Uri: ${uri}`);
        const pairResult = await client?.pair({ uri: uri });
        console.log("pari", pairResult);
        console.log("PairResult", pairResult);
    };

    const sendResponse = (topic: string, response: JsonRpcResponse<any>) => {
        if (!client) {
            console.warn("useWalletConnect(): sendResponse: !client");
            return;
        }
        client?.respond({ topic, response });
    };

    /**
     * ## handleProposal()
     *
     * Handles a proposal to connect the wallet to a Dapp (example: Forvatlt)
     * The proposal is usually initiated by using the wallet-app to scan a QR code presented by the Dapp.
     * The connection is established once this function responds by running the `client.approve(response)`.
     */
    const handlePruposal = useCallback(
        async (proposal: SessionTypes.Proposal) => {
            console.log("Received PROPOSAL: ", proposal);

            // 1. Check if client exists
            if (typeof client === "undefined") {
                console.warn(`handleProposal: typeof client === "undefined"`);
                return;
            }

            // 2. Check if proposal has unsupportedChains
            const unsupportedChains =
                proposal.permissions.blockchain.chains.filter(
                    (chainId) => !supportedChains.includes(chainId)
                );
            if (unsupportedChains.length > 0) {
                console.warn(`handleProposal: unsupportedChains.length > 0`);
                return client.reject({ proposal });
            }

            // 3. Check if proposal has unsupportedMethods
            const unsupportedMethods =
                proposal.permissions.jsonrpc.methods.filter(
                    (method) => !DEFAULT_EIP155_METHODS.includes(method)
                );
            if (unsupportedMethods.length) {
                console.warn(`handleProposal: unsupportedMethods.length > 0`);
                return client.reject({ proposal: proposal });
            }

            // 4. Get accounts from veramo
            const _accounts = veramo.accounts.filter((account) => {
                const [namespace, reference] = account.split(":");
                return proposal.permissions.blockchain.chains.includes(
                    `${namespace}:${reference}`
                );
            });

            // 5. Approve proposal with accounts
            const response = {
                state: { accounts: _accounts },
            };
            try {
                await client.approve({ proposal, response });
            } catch (err) {
                console.warn(
                    "handleProposal: await client.approve({ proposal, response }); failed with error: ",
                    err
                );
            }
        },
        [supportedChains, client, veramo.accounts]
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

    // Subscribe / Unsubscribe Walletconnect
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
                console.warn(e);
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
        closeSession,
        pair,
        consumeEvent,
        sendResponse,
    };
};
