import React from "react";
import { Button } from "react-native";
import { SCREEN_DEMO, useLocalNavigation } from "../hooks/useLocalNavigation";

export function DemoScreen() {
    const { navigateSendVerifiedPersonnummer, navigateGetBankID } =
        useLocalNavigation();

    return (
        <>
            <Button
                title="Demo: Vis legitimasjon"
                onPress={navigateSendVerifiedPersonnummer}
            />
            <Button
                title="Demo: Hent BankID"
                onPress={() => navigateGetBankID(SCREEN_DEMO)}
            />
        </>
    );
}
