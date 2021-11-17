// React
import React, { useMemo } from "react";
import { ActivityIndicator } from "react-native";

// Third party
import styled from "styled-components/native";

// Button
export function SignButton({
    loading,
    signed,
    expirationDate,
    onPress,
}: {
    loading: boolean;
    signed: boolean;
    expirationDate?: string;
    onPress: () => void;
}) {
    const backgroundColor = useMemo(() => {
        if (!signed) {
            return "rgba(0, 122, 255, 0.9)";
        } else {
            return "rgba(52, 199, 89, 0.9)";
        }
    }, [signed]);

    const text = useMemo(() => {
        if (!loading && !signed) {
            return "Signer";
        } else if (loading) {
            return <ActivityIndicator />;
        } else {
            return "Ja";
        }
    }, [loading, signed]);

    const onPressWhenNotSigned = useMemo(() => {
        if (!signed) {
            return onPress;
        } else {
            return () => {
                console.info("Button disabled");
            };
        }
    }, [onPress, signed]);

    const expirationDateText = useMemo(() => {
        if (!__DEV__) {
            return "";
        }
        if (!expirationDate) {
            return "--/--/----";
        }
        return `Utløper ${
            new Date(expirationDate).toISOString().split("T")[0]
        }`;
    }, [expirationDate]);

    return (
        <DateView>
            <DateText>{expirationDateText}</DateText>
            <StatusButtonTouchable
                onPress={onPressWhenNotSigned}
                backgroundColor={backgroundColor}>
                <StatusButtonText>{text}</StatusButtonText>
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
    color: white;
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
    color: white;
    font-weight: 600;
    font-size: 13px;
`;
