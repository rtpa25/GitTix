import axios from 'axios';
import { useState } from 'react';
import { toErrorMap } from '../utils/to-error-map';

interface UseRequestProps {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
    body?: {};
    onSuccess?: () => void;
}

export const useRequest = <T>({
    method,
    url,
    body,
    onSuccess,
}: UseRequestProps) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const doRequest = async (): Promise<T | undefined> => {
        try {
            const response = await axios[method]<T>(url, body);
            if (onSuccess) {
                onSuccess();
            }
            return response.data;
        } catch (error: any) {
            const errors = error.response.data.errors;
            const formattedErrors = toErrorMap(errors);
            setErrors(formattedErrors);
        }
    };

    return { doRequest, errors };
};
