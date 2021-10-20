import { useState } from "react";
import * as RNKeychain from "react-native-keychain";
import useAsyncEffect from "use-async-effect";

export function useDeviceAuthentication() {
    const [hasDeviceAuthentication, setHasDeviceAuthentication] =
        useState(false);

    useAsyncEffect(async () => {
        try {
            const res = await RNKeychain.setGenericPassword("test", "test", {
                authenticationType: RNKeychain.AUTHENTICATION_TYPE.BIOMETRICS,
                accessControl:
                    RNKeychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
                service: "SymfoniID",
            });
            console.info(
                "useDeviceAuthentication.ts: setHasDeviceAuthentication(true): "
            );
            setHasDeviceAuthentication(true);
        } catch (err) {
            console.warn(
                "useDeviceAuthentication.ts: setGenericPassword -> ERROR:",
                { err }
            );
        }
    }, []);

    const checkDeviceAuthentication = async (): Promise<boolean> => {
        try {
            const res = await RNKeychain.getGenericPassword({
                authenticationType: RNKeychain.AUTHENTICATION_TYPE.BIOMETRICS,
                accessControl:
                    RNKeychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
                service: "SymfoniID",
            });
            console.info(
                "useDeviceAuthentication.ts: checkDeviceAuthentication -> OK:",
                { res }
            );
            return true;
        } catch (err) {
            console.warn(
                "useDeviceAuthentication.ts: checkDeviceAuthentication -> ERROR:",
                { err }
            );
            return false;
        }
    };

    return {
        hasDeviceAuthentication,
        checkDeviceAuthentication,
    };
}
