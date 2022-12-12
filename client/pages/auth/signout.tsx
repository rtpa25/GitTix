import { Box, Flex, Link, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { TEXT_COLOR } from '../../consts';

const signoutRequest = async (url: string) => {
    return axios({
        method: 'post',
        url: url,
    });
};

const Signout = () => {
    const router = useRouter();

    const { mutate } = useSWRConfig();

    const { trigger, error, isMutating } = useSWRMutation(
        '/api/users/signout',
        signoutRequest
    );

    useEffect(() => {
        const logout = async () => {
            try {
                await trigger();
                router.push('/');
                mutate('/api/users/currentuser');
            } catch (error: any) {
                console.error(error);
            }
        };
        logout();
    }, [mutate, router, trigger]);

    const loadingState = (
        <Flex
            direction={'column'}
            justifyContent='center'
            alignItems={'center'}>
            <Spinner />
            <Box color={TEXT_COLOR}>Signing you out.....</Box>
        </Flex>
    );

    const errorState = (
        <Flex
            direction={'column'}
            justifyContent='center'
            alignItems={'center'}>
            <Box color={TEXT_COLOR}>
                Something went wrong. Please try again.
            </Box>
            <Text>
                Go back to{' '}
                <Link href='/' color={TEXT_COLOR}>
                    Home
                </Link>
            </Text>
        </Flex>
    );

    if (isMutating) return loadingState;
    if (error) return errorState;
};

export default Signout;
