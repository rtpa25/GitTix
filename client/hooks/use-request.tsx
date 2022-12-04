import axios from 'axios';
import { useState } from 'react';
import { Error } from '../types/error';

interface UseRequestProps {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
    body?: {};
    onSuccess?: () => void;
}

export const useRequest = ({
    method,
    url,
    body,
    onSuccess,
}: UseRequestProps) => {
    const [errors, setErrors] = useState<any>();

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess();
            }
            return response.data;
        } catch (error: any) {
            setErrors(
                <ul className='alert alert-danger'>
                    {error.response.data.errors.map((error: Error) => {
                        return <li key={error.message}>{error.message}</li>;
                    })}
                </ul>
            );
        }
    };

    return { doRequest, errors };
};
