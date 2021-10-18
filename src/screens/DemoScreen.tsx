import React from "react";
import { Button } from "react-native";
import { useSymfoniContext } from "../context";
import { SCREEN_DEMO, useLocalNavigation } from "../hooks/useLocalNavigation";
import { ParamPresentCredentialDemo } from "../types/paramTypes";
import { CreateCapTableVPRequest } from "../types/createCapTableVPTypes";

export function DemoScreen() {
    const { findTermsOfUseVC, findNationalIdentityVC } = useSymfoniContext();
    const { navigateCreateCapTableVP, navigateGetBankID } =
        useLocalNavigation();

    return (
        <>
            <Button
                title="Demo: Lag ny legitimasjon"
                onPress={() => navigateCreateCapTableVP()}
            />
            <Button
                title="Demo: Bruk eksisterende legitimasjon dersom finnes"
                onPress={async () => {
                    const capTableTermsOfUseVC = await findTermsOfUseVC();
                    const nationalIdentityVC = await findNationalIdentityVC();

                    navigateCreateCapTableVP({
                        type: "CREATE_CAP_TABLE_VP_REQUEST",
                        params: {
                            nationalIdentityVC,
                            capTableTermsOfUseVC,
                        },
                    } as CreateCapTableVPRequest);
                }}
            />
            <Button
                title="Demo: Vis legitimasjon med demodata"
                onPress={() =>
                    navigateCreateCapTableVP({
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
