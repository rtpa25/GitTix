import { Box, ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Header from '../components/header';
import { BG_COLOR_DARKEST } from '../consts';
import { store } from '../store';

const AppComponent = ({ Component, pageProps }: AppProps) => {
    return (
        <ChakraProvider>
            <Provider store={store}>
                <Box
                    overflow={'scroll'}
                    bgColor={BG_COLOR_DARKEST}
                    height={'100vh'}>
                    <Header />
                    <Box>
                        <Component {...pageProps} />
                    </Box>
                </Box>
            </Provider>
        </ChakraProvider>
    );
};

export default AppComponent;
