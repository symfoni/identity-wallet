// import axios from "axios";
// import Wallet from "caip-wallet";
// import Client from "@walletconnect/client";
// import { SessionTypes } from "@walletconnect/types";

// import KeyValueStorage from "keyvaluestorage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";

import { Wallet } from "caip-wallet";
import { KeyValueStorage } from "keyvaluestorage";
import React, { createContext, useEffect, useState } from "react";
import {
    DEFAULT_APP_METADATA,
    DEFAULT_RELAY_PROVIDER,
} from "./constants/default";

export type Dispatch<T = any> = React.Dispatch<React.SetStateAction<T>>;

export interface IContext {
    loading: boolean;
    chains: string[];
    accounts: string[];
    wallet: Wallet | undefined;
    // client: Client | undefined;
    // proposal: SessionTypes.Proposal | undefined;
    // setProposal: Dispatch<SessionTypes.Proposal | undefined>;
    // request: SessionTypes.RequestEvent | undefined;
    // setRequest: Dispatch<SessionTypes.RequestEvent | undefined>;
    // onApprove: () => Promise<void>;
    // onReject: () => Promise<void>;
}

export const INITIAL_CONTEXT: IContext = {
    loading: false,
    chains: [],
    accounts: [],
    wallet: undefined,
    // client: undefined,
    // proposal: undefined,
    // setProposal: () => {},
    // request: undefined,
    // setRequest: () => {},
    // onApprove: async () => {},
    // onReject: async () => {},
};
export const Context = createContext<IContext>(INITIAL_CONTEXT);

export const ContextProvider = (props: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [chains] = useState<string[]>(["eip155:421611"]);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [client, setClient] = useState<Client | undefined>(undefined);
    // const [proposal, setProposal] = useState<SessionTypes.Proposal | undefined>(
    //     undefined,
    // );
    // const [request, setRequest] = useState<
    //     SessionTypes.RequestEvent | undefined
    // >(undefined);

    useEffect(() => {
        const initWallet = async () => {
            console.log(`Starting Wallet...`);
            const storage = new KeyValueStorage({
                asyncStorage: AsyncStorage as any,
            });
            const _wallet = await Wallet.init({
                chains,
                storage,
            });
            const _accounts = await _wallet.getAccounts();
            setAccounts(_accounts);
            setWallet(_wallet);
            console.log(_accounts);
            // todo only test
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
        initWallet();
    }, [chains]);

    useEffect(() => {
        const initClient = async () => {
            console.log(`Starting Client...`);
            try {
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
                setLoading(false);
            } catch (e) {
                console.log("Failed to start Client!");
                console.error(e);
            }
        };
        initClient();
    }, [wallet]);

    // Make the context object:
    const context: IContext = {
        loading,
        chains,
        accounts,
        wallet,
        // client,
        // proposal,
        // setProposal,
        // request,
        // setRequest,
        // onApprove,
        // onReject,
    };

    // pass the value in provider and return
    return (
        <Context.Provider value={context}>{props.children}</Context.Provider>
    );
};

export const { Consumer } = Context;
