import React from "react";
import { Button } from "react-native";
import { useLocalNavigation } from "../hooks/useLocalNavigation";

export function Demo() {
    const { navigateSendVerifiedPersonnummer } = useLocalNavigation();

    return (
        <Button
            title="Demo: Vis legitimasjon"
            onPress={navigateSendVerifiedPersonnummer}
        />
    );
}
