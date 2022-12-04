import axios from 'axios';
import { IncomingMessage } from 'node:http';

export const buildClient = (req: IncomingMessage | undefined) => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL:
                'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req!.headers,
        });
    } else {
        return axios.create({
            baseURL: '/',
        });
    }
};
