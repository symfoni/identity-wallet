import React, { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { ColorContext } from "../colorContext";
import { SymfoniModal } from "../components/ui";
import { Metadata } from "../components/wallet/Metadata";
import { Context } from "../context";
import { Sizing, Typography } from "../styles";
import { borderRadius } from "../styles/outlines";

const RequestAndProposalHandler = () => {
    const { proposals, requests, onApprove, onReject } = useContext(Context);
    // const { colors } = useTheme();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);

    useEffect(() => {
        console.log("Request updated", requests.length);
    }, [requests]);

    if (proposals.length > 0) {
        return (
            <SymfoniModal
                content={
                    <>
                        <Text style={styles.title}>Approve proposal</Text>
                        <Metadata metadata={proposals[0].proposer.metadata} />
                        {/* // TODO Show proposed methods */}
                    </>
                }
                onConfirmClick={() => onApprove(proposals[0])}
                onDismissClick={() => onReject(proposals[0])}
            />
        );
    } else if (requests.length > 0) {
        return (
            <SymfoniModal
                content={
                    <>
                        <Text style={styles.title}>Approve request</Text>
                    </>
                }
                onConfirmClick={() => onApprove(requests[0])}
                onDismissClick={() => onReject(requests[0])}
            />
        );
    } else {
        return null;
    }
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: Sizing.x10,
        },
        modalView: {
            margin: Sizing.x20,
            backgroundColor: colors.background,
            borderRadius: borderRadius.large,
            padding: Sizing.x40,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: Sizing.layout.x7,
            elevation: Sizing.layout.x5,
        },
        title: {
            ...Typography.header.x50,
            marginBottom: Sizing.x10,
        },
        body: {
            ...Typography.body.x40,
        },
    });
export default RequestAndProposalHandler;
