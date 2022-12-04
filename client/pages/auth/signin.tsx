import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useRequest } from '../../hooks/use-request';

const Signin: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/users/signin',
        body: {
            email,
            password,
        },
        onSuccess: () => router.push('/'),
    });

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        await doRequest();
        setEmail('');
        setPassword('');
    };

    return (
        <form onSubmit={submitHandler}>
            <h1>Sign In</h1>
            <div className='form-group'>
                <label>Email Address</label>
                <input
                    className='form-control'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input
                    type='password'
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {errors}
            <button className='btn btn-primary'>Sign In</button>
        </form>
    );
};

export default Signin;
