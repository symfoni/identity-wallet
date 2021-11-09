import React, { useContext } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";
import { Icon, IconType } from "../../../assets/icons/Icon";
import { ColorContext, ColorSystem } from "../../../colorContext";
import { Buttons, Colors } from "../../../styles";
import { layout } from "../../../styles/sizing";

interface Props {
    style?: StyleProp<ViewStyle> | undefined;
    icon?: IconType;
    text?: string;
    type: "primary" | "secondary" | "success" | "danger";
    onPress?: () => void;
    onLongPress?: () => void;
}

export const SymfoniButton: React.FC<Props> = ({ ...props }) => {
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);
    let buttonStyle;
    switch (props.type) {
        case "primary":
            buttonStyle = styles.primary;
            break;
        case "secondary":
            buttonStyle = styles.secondary;
            break;
        case "success":
            buttonStyle = styles.success;
            break;
        case "danger":
            buttonStyle = styles.danger;
            break;
    }
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={[props.style, buttonStyle]}>
            <View style={styles.content}>
                {props.icon && (
                    <Icon
                        style={styles.iconStyle}
                        size={layout.x30}
                        type={props.icon}
                        color={Colors.neutral.white}
                    />
                )}
                {props.text && (
                    <Text style={styles.buttonText}>{props.text}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const makeStyles = (colors: ColorSystem) => {
    return StyleSheet.create({
        primary: {
            backgroundColor: colors.primary.main,
            ...Buttons.bar.primary,
        },
        secondary: {
            backgroundColor: colors.secondary.main,
            ...Buttons.bar.secondary,
        },
        success: {
            ...Buttons.bar.primary,
            backgroundColor: Colors.success.s400,
        },
        danger: {
            ...Buttons.bar.primary,
            backgroundColor: Colors.danger.s400,
        },
        content: {
            flexDirection: "row",
            alignItems: "center",
        },
        buttonText: {
            ...Buttons.barText.primary,
            color: colors.onPrimary,
        },
        iconStyle: {
            marginRight: 5,
        },
    });
};
