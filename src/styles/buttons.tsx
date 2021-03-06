import {
    TextStyle,
    ViewStyle,
    PressableStateCallbackType,
    Platform,
} from "react-native";

import * as Colors from "./colors";
import * as Outlines from "./outlines";
import * as Sizing from "./sizing";
import * as Typography from "./typography";

type Bar = "primary" | "secondary";
export const bar: Record<Bar, ViewStyle> = {
    primary: {
        alignItems: "center",
        justifyContent: "center",
        padding: Sizing.layout.x10,
        borderRadius: Outlines.borderRadius.base,
    },
    secondary: {
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        padding: Sizing.layout.x10,
        borderRadius: Outlines.borderRadius.base,
    },
};

type BarText = "primary" | "secondary";
export const barText: Record<BarText, TextStyle> = {
    primary: {
        ...Typography.fontSize.x30,
        ...Typography.fontWeight.semibold,
    },
    secondary: {
        ...Typography.fontSize.x10,
        ...Typography.fontWeight.regular,
    },
};

type Circular = "primary";
export const circular: Record<Circular, ViewStyle> = {
    primary: {
        height: Sizing.layout.x30,
        width: Sizing.layout.x30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Outlines.borderRadius.max,
    },
};

const opacity = (state: PressableStateCallbackType): ViewStyle => {
    const opacity = state.pressed ? 0.65 : 1;
    return { opacity };
};

export const applyOpacity = (style: ViewStyle) => {
    return (state: PressableStateCallbackType): ViewStyle => {
        return {
            ...style,
            ...opacity(state),
        };
    };
};
