import { BROK_HELPERS_URL, USE_LOCAL_ENVIROMENT, USE_TEST_DATA } from "@env";
import { VerifiablePresentation } from "@veramo/core";
import axios, { AxiosResponse } from "axios";

export const registerWithBankId = (
    vp: VerifiablePresentation
): Promise<AxiosResponse<string>> => {
    const url = !USE_LOCAL_ENVIROMENT
        ? "http://localhost:3004"
        : BROK_HELPERS_URL;
    console.log("registerBankIdUrl", url);
    return axios.post<string>(`${url}/brreg/entity/register`, {
        jwt: vp.proof.jwt,
        skipBlockchain: USE_TEST_DATA ? true : false,
        skipBankidVerify: USE_TEST_DATA ? true : false,
    });
};

export const requestBoardDirectorVerifiableCredential = (
    vp: VerifiablePresentation
) => {
    const url = !USE_LOCAL_ENVIROMENT
        ? "http://localhost:3004"
        : BROK_HELPERS_URL;
    return axios.post<string>(`${url}/brreg/credential/board-director`, {
        jwt: vp.proof.jwt,
        test: USE_TEST_DATA ? true : false,
    });
};

export const approveCaptable = (
    vp: VerifiablePresentation,
    options: { test?: false } = {}
) => {
    const url = !USE_LOCAL_ENVIROMENT
        ? "http://localhost:3004"
        : BROK_HELPERS_URL;
    return axios.post<string>(`${url}/brreg/captable/approve`, {
        jwt: vp.proof.jwt,
        test: USE_TEST_DATA ? true : false,
    });
};
