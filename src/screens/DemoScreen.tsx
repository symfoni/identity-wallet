import React from "react";
import { Button } from "react-native";
import { SCREEN_DEMO, useLocalNavigation } from "../hooks/useLocalNavigation";
import { ParamPresentCredentialDemo } from "../types/paramTypes";

export function DemoScreen() {
    const { navigatePresentCredential, navigateGetBankID } =
        useLocalNavigation();

    return (
        <>
            <Button
                title="Demo: Vis legitimasjon"
                onPress={() =>
                    navigatePresentCredential({
                        type: "PARAM_PRESENT_CREDENTIAL_DEMO",
                        demoBankIDPersonnummer: "120391 12345",
                        demoEmail: "jonas@symfoni.solutions",
                    } as ParamPresentCredentialDemo)
                }
            />
            <Button
                title="Demo: Vis legitimasjon med demodata"
                onPress={() =>
                    navigatePresentCredential({
                        type: "PARAM_PRESENT_CREDENTIAL_DEMO",
                        demoBankIDPersonnummer: "120391 12345",
                        demoEmail: "jonas@symfoni.solutions",
                    } as ParamPresentCredentialDemo)
                }
            />
            <Button
                title="Demo: Hent BankID"
                onPress={() => navigateGetBankID(SCREEN_DEMO)}
            />
        </>
    );
}
