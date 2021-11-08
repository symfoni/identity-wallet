import { Colors } from "react-native/Libraries/NewAppScreen";
import { lineHeight } from "./styles/typography";
import React, {
    createContext,
    SetStateAction,
    useContext,
    useState,
} from "react";
import { createConnection } from "typeorm";

export interface ColorSystem {
    primary: {
        light: string;
        main: string;
        dark: string;
    };
    secondary: {
        light: string;
        main: string;
        dark: string;
    };
    background: string;
    surface: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
}

export interface IColorContext {
    isDarkMode: boolean;
    colors: ColorSystem;
    toggleDarkMode: () => void;
    updatePalette: (colorSystem: ColorSystem) => void;
    setDefaultColors: () => void;
}

const DEFAULT_DARKMODE_COLORS: ColorSystem = {
    primary: {
        light: "#6f74dd",
        main: "#3949ab",
        dark: "#00227b",
    },
    secondary: {
        light: "#ffaf4c",
        main: "#f47e17",
        dark: "#bb5000",
    },
    background: "#000000",
    onBackground: "#FFFFFF",
    surface: "#121212",
    onPrimary: "#FFFFFF",
    onSecondary: "#000000",
    onSurface: "#FFFFFF",
};
const DEFAULT_LIGHT_COLORS: ColorSystem = {
    primary: {
        light: "#6f74dd",
        main: "#3949ab",
        dark: "#00227b",
    },
    secondary: {
        light: "#ffaf4c",
        main: "#f47e17",
        dark: "#bb5000",
    },
    background: "#FFFFFF",
    onBackground: "#000000",
    surface: "#FFFFFF",
    onPrimary: "#FFFFFF",
    onSecondary: "#000000",
    onSurface: "#FFFFFF",
};

export const ColorContext = createContext<IColorContext>(undefined!);
export function useColorContext() {
    return useContext(ColorContext);
}

export const ColorContextProvider = (props: any) => {
    const deriveCurrentColorScheme = (isDarkMode: boolean) => {
        if (isDarkMode) {
            return darkModeColors;
        } else {
            return lightColors;
        }
    };

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [lightColors, setLightColors] =
        useState<ColorSystem>(DEFAULT_LIGHT_COLORS);
    const [darkModeColors, setDarkModeColors] = useState<ColorSystem>(
        DEFAULT_DARKMODE_COLORS
    );
    const colors: ColorSystem = deriveCurrentColorScheme(isDarkMode);

    const updatePalette = (newPalette: ColorSystem) => {
        if (isDarkMode) {
            setDarkModeColors(newPalette);
        } else {
            setLightColors(newPalette);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const setDefaultColors = () => {
        setDarkModeColors(DEFAULT_DARKMODE_COLORS);
        setLightColors(DEFAULT_LIGHT_COLORS);
    };

    const context: IColorContext = {
        isDarkMode,
        colors,
        toggleDarkMode,
        updatePalette,
        setDefaultColors,
    };

    return (
        <ColorContext.Provider value={context}>
            {props.children}
        </ColorContext.Provider>
    );
};
