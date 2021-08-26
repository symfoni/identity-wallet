import { BROK_HELPERS_VERIFIER } from "@env";
import { VerifiablePresentation } from "@veramo/core";
import { AxiosError } from "axios";
import { decodeJWT as decodeJWT2 } from "did-jwt";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { BankidWebview } from "../components/bankid/BankidWebview";
import { registerForvalt } from "../components/presenter/ForvaltPresenter";
import { VPApprovalView } from "../components/VPApprovalView";
import { Context } from "../context";
import { goBack } from "../navigation";
import { BankidJWTPayload } from "./../types/bankid";

export const BankId = () => {
    const { createVC, createVP, decodeJWT, identity, findVC, saveVP, isTest } =
        useContext(Context);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState();
    const [errors, setErrors] = useState<string[]>([]);
    const [bankidToken, setBankidToken] = useState<string>(() => {
        return isTest
            ? "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlFMkUzN0M1MTVGRTc5MkNBQUI4NDg3REJGNkE4NTlBMEZCOEE4NEQifQ.eyJpc3MiOiJodHRwczovL2Jsb2NrY2hhbmdlcnMuY3JpaXB0by5pZCIsImF1ZCI6InVybjpteTphcHBsaWNhdGlvbjppZGVudGlmaWVyOjgwNjAiLCJpZGVudGl0eXNjaGVtZSI6Im5vYmFua2lkIiwiYXV0aGVudGljYXRpb250eXBlIjoidXJuOmdybjphdXRobjpubzpiYW5raWQ6Y2VudHJhbCIsImF1dGhlbnRpY2F0aW9ubWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6U29mdHdhcmVQS0kiLCJhdXRoZW50aWNhdGlvbmluc3RhbnQiOiIyMDIxLTA4LTI2VDA4OjE0OjE5LjQwNloiLCJuYW1laWRlbnRpZmllciI6IjYxMmJjODI5NDFkNDRjYzZhMzdkMmI5YTcyNTAxNzIwIiwic3ViIjoiezYxMmJjODI5LTQxZDQtNGNjNi1hMzdkLTJiOWE3MjUwMTcyMH0iLCJzZXNzaW9uaW5kZXgiOiJiNjRjNmU2YS02OGM5LTRkNWEtYmE5YS1hNjQwZjI5YTc0OWYiLCJ1bmlxdWVtZXJjaGFudGlkIjoiMTIzNDU2Nzg5IiwidW5pcXVldXNlcmlkIjoiOTU3OC02MDAwLTQtNDY0NzUxIiwiY2VydHN1YmplY3QiOiJDTj1cIkxvLCBNb3J0ZW5cIiwgTz1UZXN0QmFuazEgQVMsIEM9Tk8sIFNFUklBTE5VTUJFUj05NTc4LTYwMDAtNC00NjQ3NTEiLCJjZXJ0aXNzdWVyIjoiQ049QmFua0lEIC0gVGVzdEJhbmsxIC0gQmFuayBDQSAzLCBPVT0xMjM0NTY3ODksIE89VGVzdEJhbmsxIEFTLCBDPU5PIiwiaXNzdWVyIjoiQ049QmFua0lEIC0gVGVzdEJhbmsxIC0gQmFuayBDQSAzLCBPVT0xMjM0NTY3ODksIE89VGVzdEJhbmsxIEFTLCBDPU5PIiwiZGF0ZW9mYmlydGgiOiIxOTIxMTAxNCIsImJpcnRoZGF0ZSI6IjE5MjEtMTAtMTQiLCJzb2NpYWxubyI6IjE0MTAyMTIzOTczIiwic2VyaWFsbnVtYmVyIjoiOTU3OC02MDAwLTQtNDY0NzUxIiwiY291bnRyeSI6Ik5PIiwiaXNzdWluZ2JhbmsiOiJUZXN0QmFuazEgQVMiLCJuYW1lIjoiTG8sIE1vcnRlbiIsImlhdCI6MTYyOTk2NTY1OSwibmJmIjoxNjI5OTY1NjU5LCJleHAiOjE2MzAwNTE5OTl9.x9Qo-Tzy8dNPDMaYkR5THlKsjy0YC3EOf_0mvYG8uviHtdvam69aQOg5NbogUQnIYqIxlUhaCF4TrtwpeJc9xj9VoY1EEH3svyduadRAMbk9J9h-XZGx5H5o-zQqq80C9AW58SFLWf-Fz_rBnMpLtp-5ASfMbuIIhHNi9Tq7hRMZw989YyBZH3hRrSkoZiRrXkPhvY6lmbR0D8FQrGtq65FrNeGPOD_H1wvL_fkrXRDKCTQAXfGg7Xs0lLQ9Affc5I9QSnbSJk8HWV0dEzSc0nXEHPj00fAKgOufZKj6tIM7d13LHBcTMwYG9XXWuXHATg3lk_vjZpa_g1jCp1WRXA"
            : "";
    });
    const [bankidTokenDecoded, setBankidTokenDecoded] =
        useState<BankidJWTPayload>();
    const [email, setEmail] = useState(isTest ? "test@email.com" : "");
    const [streetAddress, setstreetAddress] = useState(
        isTest ? "Testveien 123" : ""
    );
    const [postcode, setPostcode] = useState(isTest ? "0556" : "");
    const [pendingApprovalVp, setPendingApprovalVp] = useState<
        VerifiablePresentation | undefined
    >();

    useEffect(() => {
        if (!bankidToken) {
            return;
        }
        setBankidTokenDecoded(
            decodeJWT2(bankidToken).payload as BankidJWTPayload
        );
    }, [bankidToken]);

    useEffect(() => {
        if (errors.length > 0) {
            Toast.show({
                type: "error",
                text1: "Something went wrong",
                text2: errors.join(","),
                topOffset: 100,
                position: "top",
            });
            setErrors((old) => []);
        }
    }, [errors]);

    const registerInForvaltAndSaveVP = (vp: VerifiablePresentation) => {
        registerForvalt(vp)
            .then((result) => {
                console.log("RESULT register vp", result);
                saveVP(result.data);
                setPendingApprovalVp(undefined);
                setLoading(false);
                goBack();
            })
            .catch((error: AxiosError) => {
                setErrors((old) => [...old, error.response?.data.message]);
            });
    };

    // Use authVC to register
    const handleConfirmUserInput = async () => {
        try {
            if (!email || !streetAddress || !postcode) {
                let errorMessage = "";
                if (!email) {
                    errorMessage += "email, ";
                }
                if (!streetAddress) {
                    errorMessage += "address, ";
                }
                if (!postcode) {
                    errorMessage += "postcode";
                }
                throw Error(`Missing input: ${errorMessage}`);
            }
            setLoading(true);
            const vc = await createVC({
                epost: email,
                veiadresse: streetAddress,
                postnummer: postcode,
                identityProof: bankidToken,
            });

            const vp = await createVP(BROK_HELPERS_VERIFIER, [vc.proof.jwt]);
            setPendingApprovalVp(vp);
        } catch (error) {
            setLoading(false);
            setErrors((old) => [...old, error.message]);
        }
    };
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.bankidContainer}>
                    {/* Step view */}
                    <View>
                        {!!bankidToken && (
                            <Text style={{ textAlign: "center" }}>
                                Verifisert bankid
                            </Text>
                        )}
                    </View>

                    {/* show loading */}
                    {loading && (
                        <View>
                            <ActivityIndicator />
                        </View>
                    )}
                    {pendingApprovalVp && (
                        <VPApprovalView
                            vp={pendingApprovalVp.proof.jwt}
                            onApprove={() =>
                                registerInForvaltAndSaveVP(pendingApprovalVp)
                            }
                            onReject={() => {
                                setLoading(false);
                                setPendingApprovalVp(undefined);
                                console.log("rejected");
                            }}
                        />
                    )}
                    {/* Show bankidWebview */}
                    {!bankidToken && (
                        <BankidWebview
                            onSuccess={setBankidToken}
                            onError={(error) => {
                                setErrors((old) => [...old, error]);
                                console.log("BankidWebview", error);
                            }}
                        />
                    )}
                    {/* Show register email and addresss */}
                    {!!bankidToken && !loading && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center" }}>
                                Registrer følgende informasjon med Brreg for å
                                administrere dine aksjer
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={bankidTokenDecoded?.name}
                                editable={false}
                            />
                            <TextInput
                                style={styles.input}
                                value={bankidTokenDecoded?.dateofbirth}
                                editable={false}
                            />
                            <TextInput
                                style={styles.input}
                                value={bankidTokenDecoded?.socialno}
                                editable={false}
                            />
                            <TextInput
                                placeholder={"Epost..."}
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                            />
                            <TextInput
                                placeholder={"Veiadresse"}
                                style={styles.input}
                                onChangeText={setstreetAddress}
                                value={streetAddress}
                            />
                            <TextInput
                                placeholder={"Postkode"}
                                style={styles.input}
                                onChangeText={setPostcode}
                                value={postcode}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                onPress={() => handleConfirmUserInput()}
                                style={styles.button}>
                                <Text style={{}}>Registrer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        backgroundColor: "lightblue",
        padding: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    bankidContainer: {
        padding: 10,
        flex: 1,
    },
    actionContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
});
