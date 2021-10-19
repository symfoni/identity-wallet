export const DEFAULT_APP_METADATA = {
    name: "Identity Wallet",
    description: "Identity Wallet from Symfoni",
    url: "https://walletconnect.org/",
    icons: ["https://walletconnect.org/walletconnect-logo.png"],
};

export const DEFAULT_MAIN_CHAINS = ["eip155:42161"];

export const DEFAULT_TEST_CHAINS = ["eip155:421611"];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

export const DEFAULT_RELAY_PROVIDER = "wss://relay.walletconnect.org"; // "wss://localhost:5555"

export const DEFAULT_RPC_PROVIDER_TEST =
    "https://arbitrum-rinkeby.infura.io/v3/0771265f174543dca52bbe282a69397d";
export const DEFAULT_RPC_PROVIDER_MAIN = "SET THIS UP!!!!";

export const DEFAULT_EIP155_METHODS = [
    "eth_sendTransaction",
    "personal_sign",
    "eth_signTypedData",
    "eth_signTransaction",
    "oracle_data",
    "did_createVerifiableCredential",
    "did_requestVerifiableCredential",
    "symfoni_privateTransferByPartition",
    "symfoniID_createCapTableVP",
];

export const DEFAULT_LOGGER = "debug";
