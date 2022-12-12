import { Box, ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import { BG_COLOR_DARKEST } from '../consts';

const AppComponent = ({ Component, pageProps }: AppProps) => {
    return (
        <ChakraProvider>
            <Box
                overflow={'scroll'}
                bgColor={BG_COLOR_DARKEST}
                height={'100vh'}>
                <Header />
                <Box>
                    <Component {...pageProps} />
                </Box>
            </Box>
        </ChakraProvider>
    );
};

export default AppComponent;
