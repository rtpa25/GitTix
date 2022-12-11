import { Box, ChakraProvider } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { buildClient } from '../api/build-client';
import Header from '../components/header';
import { BG_COLOR_DARKEST } from '../consts';
import { store } from '../store';
import { CurrentUserResult } from '../types/user';

type AppComponentProps = AppProps & CurrentUserResult;

const AppComponent = ({
    Component,
    pageProps,
    currentUser,
}: AppComponentProps) => {
    return (
        <ChakraProvider>
            <Provider store={store}>
                <Box
                    overflow={'scroll'}
                    bgColor={BG_COLOR_DARKEST}
                    height={'100vh'}>
                    <Header currentUser={currentUser} />
                    <Component {...pageProps} />
                </Box>
            </Provider>
        </ChakraProvider>
    );
};

export const getServerSideProps = async ({
    req,
}: NextPageContext): Promise<CurrentUserResult> => {
    const axiosClient = buildClient(req);
    const { data } = await axiosClient.get('/api/users/currentuser');
    console.log(data);

    return {
        currentUser: data.currentUser,
    };
};

export default AppComponent;
