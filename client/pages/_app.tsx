import { Box, ChakraProvider } from '@chakra-ui/react';
import type { AppContext, AppProps } from 'next/app';
import { buildClient } from '../api/build-client';
import Header from '../components/header';
import { BG_COLOR_DARKEST } from '../consts';
import { CurrentUserResult } from '../types/user';

type AppComponentProps = AppProps & CurrentUserResult;

const AppComponent = ({
    Component,
    pageProps,
    currentUser,
}: AppComponentProps) => {
    return (
        <ChakraProvider>
            <Box
                overflow={'scroll'}
                bgColor={BG_COLOR_DARKEST}
                height={'100vh'}>
                <Header currentUser={currentUser} />
                <div className='container'>
                    <Component currentUser={currentUser} {...pageProps} />
                </div>
            </Box>
        </ChakraProvider>
    );
};

AppComponent.getInitialProps = async (appContext: AppContext) => {
    const axiosClient = buildClient(appContext.ctx.req);
    const { data } = await axiosClient.get<CurrentUserResult>(
        '/api/users/currentuser'
    );

    let pageProps = {};

    //if child component has getInitialProps, call it
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps?.(
            appContext.ctx,
            //@ts-ignore
            axiosClient,
            data.currentUser
        );
    }

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;
