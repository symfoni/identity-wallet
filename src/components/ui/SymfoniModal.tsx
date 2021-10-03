import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { color } from "react-native-reanimated";
import { ColorContext, ColorSystem } from "../../colorContext";
import { Buttons, Colors, Sizing, Typography } from "../../styles";
import { borderRadius } from "../../styles/outlines";

interface ModalProps {
    onRequestClose?: () => void;
    onDismissClick?: () => void;
    content: React.ReactFragment;
    onConfirmClick: () => void;
}

export const SymfoniModal = (props: ModalProps) => {
    // const { colors } = useTheme();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);

    return (
        <View style={styles.centeredView}>
            <Modal animationType="none" transparent={true}>
                <TouchableOpacity
                    style={styles.centeredView}
                    onPressOut={() =>
                        props.onRequestClose && props.onRequestClose()
                    }>
                    <View style={styles.modalView}>
                        {props.content}
                        {/* {props.icon && props.icon}
                        <Text style={styles.title}>{props.title}</Text>
                        {props.description && (
                            <Text style={styles.body}>{props.description}</Text>
                        )} */}
                        <View style={styles.buttons}>
                            {props.onDismissClick && (
                                <Pressable
                                    style={styles.dismissButton}
                                    onPress={props.onDismissClick}>
                                    <Text style={styles.buttonText}>Avslå</Text>
                                </Pressable>
                            )}
                            <Pressable
                                style={Buttons.applyOpacity(
                                    styles.confirmButton
                                )}
                                onPress={props.onConfirmClick}>
                                <Text style={styles.buttonText}>Godkjenn</Text>
                            </Pressable>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const makeStyles = (colors: ColorSystem) =>
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
        buttons: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: Sizing.layout.x20,
        },
        buttonText: {
            ...Buttons.barText.primary,
            color: colors.onBackground,
        },
        confirmButton: {
            ...Buttons.bar.primary,
            backgroundColor: Colors.success.s400,
            flexShrink: 1,
            marginBottom: Sizing.x10,
        },
        dismissButton: {
            ...Buttons.bar.primary,
            backgroundColor: Colors.danger.s400,
            flexShrink: 1,
            marginBottom: Sizing.x10,
            marginEnd: 20,
        },
        title: {
            ...Typography.header.x50,
            marginBottom: Sizing.x10,
            color: colors.onBackground,
        },
        body: {
            ...Typography.body.x40,
            color: colors.onBackground,
        },
    });
