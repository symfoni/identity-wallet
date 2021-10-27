// React
import React, { useMemo } from "react";
import { ActivityIndicator } from "react-native";

// Third party
import styled from "styled-components/native";

// Component
export function SignButton({
    valid,
    loading,
    signed,
    expirationDate,
    onPress,
}: {
    valid: boolean;
    loading: boolean;
    signed: boolean;
    expirationDate?: string;
    onPress: () => void;
}) {
    const backgroundColor = useMemo(() => {
        if (!valid) {
            return "rgba(255,255,255,0.3)";
        } else if (!signed) {
            return "rgba(0, 122, 255, 0.9)";
        } else {
            return "rgba(52, 199, 89, 0.9)";
        }
    }, [valid, signed]);

    const color = useMemo(() => {
        if (!valid) {
            return "rgba(255,255,255,0.3)";
        } else {
            return "white";
        }
    }, [valid]);

    const text = useMemo(() => {
        if (!loading && !signed) {
            return "Signer";
        } else if (loading) {
            return <ActivityIndicator />;
        } else {
            return "Gyldig";
        }
    }, [loading, signed]);

    const onPressWhenValidAndNotSigned = useMemo(() => {
        if (valid && !signed) {
            return onPress;
        } else {
            return () => {
                console.info("Button disabled");
            };
        }
    }, [onPress, valid, signed]);

    const expirationDateText = useMemo(() => {
        if (!expirationDate) {
            return "--/--/----";
        }
        return `Utløper ${
            new Date(expirationDate).toISOString().split("T")[0]
        }`;
    }, [expirationDate]);

    return (
        <DateView>
            <DateText color={color}>{expirationDateText}</DateText>
            <StatusButtonTouchable
                onPress={onPressWhenValidAndNotSigned}
                backgroundColor={backgroundColor}>
                <StatusButtonText color={color}>{text}</StatusButtonText>
            </StatusButtonTouchable>
        </DateView>
    );
}

const DateView = styled.View`
    display: flex;
    flex-direction: row;
    align-self: flex-end;
    align-items: center;
`;
const DateText = styled.Text`
    margin-right: 10px;
    color: ${(props: { color: string }) => props.color};
`;
const StatusButtonTouchable = styled.TouchableOpacity`
    background-color: ${(props: { backgroundColor: string }) =>
        props.backgroundColor};
    border-radius: 10px;
    height: 26px;
    min-width: 80px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const StatusButtonText = styled.Text`
    color: ${(props: { color: string }) => props.color};
    font-weight: 600;
    font-size: 13px;
`;
