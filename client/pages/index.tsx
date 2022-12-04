import { NextPage, NextPageContext } from 'next';
import { buildClient } from '../api/build-client';
import { CurrentUserResult } from '../types/user';

const Home: NextPage<CurrentUserResult> = ({ currentUser }) => {
    return currentUser ? (
        <h1>You are signed {currentUser.email}</h1>
    ) : (
        <h1>You are NOT signed in</h1>
    );
};

Home.getInitialProps = async ({
    req,
}: NextPageContext): Promise<CurrentUserResult> => {
    const axiosInstance = buildClient(req);

    const { data } = await axiosInstance.get<CurrentUserResult>(
        '/api/users/currentuser'
    );

    return data;
};

export default Home;
