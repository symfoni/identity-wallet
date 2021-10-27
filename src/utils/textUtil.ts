import { Clipboard } from "react-native";
import Toast from "react-native-toast-message";

const shortenString = (string: string, fromIndex: number): string => {
    return (
        string.substr(0, fromIndex) +
        "..." +
        string.substr(string.length - 3, string.length)
    );
};

export const shortenAddress = (address: string): string => {
    if (address.length < 42) {
        console.warn("Address length should be 42");
        return address;
    }
    return shortenString(address, 6);
};

export const shortenDid = (did: string): string => {
    // TODO make this failure proof!
    return shortenString(did, 8);
};
export const copy = (text: string) => {
    // REVIEW - Test react-native-clipboard-plus and @react-native-community/clipboard but both gave errors
    Toast.show({
        type: "info",
        text1: "Copied text to the clipboard",
        text2: text,
        topOffset: 100,
        position: "top",
    });
    Clipboard.setString(text);
    console.info("Copied", text, "to clipboard");
};
