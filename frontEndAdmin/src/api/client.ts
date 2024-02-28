import axios from "axios";

const configValue = process.env.REACT_APP_BASE_URL_FOOD as string;

export const apiBase = axios.create({
    baseURL: configValue,
});

export const getDatas = async (url: string) => {
    const respone = await apiBase.get(url);
    return respone.data;
};

export const getData = async (url: string) => {
    const respone = await apiBase.get(url);
    return respone.data;
}; 