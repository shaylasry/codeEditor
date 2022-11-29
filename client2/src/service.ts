import axios from "axios";

export const login = (userId: string, password: string) => {
    return axios.post(
        "/login",{
            userId,
            password
        },
    );
}

export const getType = (userId: string) => {
    return axios.post(
        "/get-type",{
            userId,
        },
    );
}

export const studentLogin = (userId: string, password: string, uuid: string) => {
    return axios.post(
        "/student-login",{
            userId,
            password,
            uuid
        },
    );
}

export const checkUUID = (userId: string, uuid: string) => {
    return axios.post(
        "/check-uuid",{
            userId,
            uuid
        },
    );
}

export const getStudents = () => {
    return axios.get("/students");
}

export const getSessionsLink = () => {
    return axios.get("/sessions-links");
}

export const getCodeBlocks = () => {
    return axios.get("/code-blocks");
}

export const createSession = (userId, codeBlockId) => {
    return axios.post("/create-session", {
        userId,
        codeBlockId
    },);
}
export const getTemplateCode = (uuid) => {
    return axios.post("/get-template-code", {uuid});
}

export const updateCode = (uuid, code) => {
    return axios.post("/update-code", {code, uuid});
}
