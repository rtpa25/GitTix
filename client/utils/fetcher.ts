import axios from 'axios';

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const sendRequest = async (url: string, method: string, body?: {}) => {
    const res = await axios({
        url,
        method,
        data: body,
    });
    return res.data;
};
