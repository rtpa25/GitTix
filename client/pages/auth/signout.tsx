import { useEffect } from 'react';
import { useRequest } from '../../hooks/use-request';
import { useRouter } from 'next/router';

const Signout = () => {
    const router = useRouter();
    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/users/signout',
        onSuccess: () => router.push('/'),
        body: {},
    });

    useEffect(() => {
        doRequest();
    }, [doRequest]);

    return <div>Signing you out.....</div>;
};

export default Signout;
