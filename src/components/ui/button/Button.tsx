import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

interface ButtonProps {
    text: string;
    onPress: any;
    color?: string;
}

export const Button = (props: ButtonProps) => {
    const { onPress, text, color } = props;
    return (
        <TouchableOpacity
            style={
                color
                    ? [styles.button, { backgroundColor: color }]
                    : styles.button
            }
            onPress={() => onPress()}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

export const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#5a70b5",
        margin: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
});
