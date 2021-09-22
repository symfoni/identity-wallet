import { BROK_HELPERS_URL, USE_LOCAL_ENVIROMENT, USE_TEST_DATA } from "@env";
import { VerifiablePresentation } from "@veramo/core";
import axios, { AxiosResponse } from "axios";
export interface ForvaltRepository {
    registerWithBankId(
        vp: VerifiablePresentation
    ): Promise<AxiosResponse<string>>;
}
export class ForvaltRepositoryImpl implements ForvaltRepository {
    registerWithBankId(
        vp: VerifiablePresentation
    ): Promise<AxiosResponse<string>> {
        const url = USE_LOCAL_ENVIROMENT
            ? "http://localhost:3004"
            : BROK_HELPERS_URL;
        console.log(url)
        return axios.post<string>(`${url}/brreg/entity/register`, {
            jwt: vp.proof.jwt,
            skipBlockchain: USE_TEST_DATA ? true : false,
            skipBankidVerify: USE_TEST_DATA ? true : false,
        });
    }
    requestBoardDirectorVerifiableCredential(vp: VerifiablePresentation) {
        const url = USE_LOCAL_ENVIROMENT
            ? "http://localhost:3004"
            : BROK_HELPERS_URL;
        return axios.post<string>(`${url}/brreg/credential/board-director`, {
            jwt: vp.proof.jwt,
            test: USE_TEST_DATA ? true : false,
        });
    }
    approveCaptable(
        vp: VerifiablePresentation,
        options: { test?: false } = {}
    ) {
        const url = USE_LOCAL_ENVIROMENT
            ? "http://localhost:3004"
            : BROK_HELPERS_URL;
        return axios.post<string>(`${url}/brreg/captable/approve`, {
            jwt: vp.proof.jwt,
            test: USE_TEST_DATA ? true : false,
        });
    }
}