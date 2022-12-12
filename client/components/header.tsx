import { FC } from 'react';
import { CurrentUserResult } from '../types/user';
import NextLink from 'next/link';
import { Box, Flex, Heading, Link, Spinner } from '@chakra-ui/react';
import { ACCENT_COLOR, BG_COLOR_DARKER, TEXT_COLOR } from '../consts';
import useSWR from 'swr';
import axios from 'axios';

const fetchCurrentUserRequest = async (url: string) => {
    return axios.get<CurrentUserResult>(url);
};

const Header: FC = () => {
    const { data, error, isLoading } = useSWR(
        '/api/users/currentuser',
        fetchCurrentUserRequest
    );
    const currentUser = data?.data?.currentUser;

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    ];

    const loadingState = <Spinner color={TEXT_COLOR} />;

    const errorState = <Box color={TEXT_COLOR}>{error?.response.data}</Box>;

    const successState = links.map((link) => {
        if (!link) return null;
        return (
            <Box key={link.label} mx='3' color={TEXT_COLOR}>
                <Link fontSize={['sm', 'md', 'lg']} href={link.href}>
                    {link.label}
                </Link>
            </Box>
        );
    });

    const renderState = () => {
        if (isLoading) return loadingState;
        if (error) return errorState;
        return successState;
    };

    return (
        <Box
            w={'full'}
            h={'16'}
            bg={BG_COLOR_DARKER}
            maxW={'97%'}
            my={'23px'}
            mx='auto'
            boxShadow={'md'}
            border={'0px'}
            borderRadius={'lg'}>
            <Flex
                justifyContent={'space-between'}
                alignItems='baseline'
                p={'2.5'}>
                <Heading color={ACCENT_COLOR} size={'lg'}>
                    <NextLink href={'/'}>GitTix</NextLink>
                </Heading>

                <Flex
                    justifyContent={'space-between'}
                    alignItems='baseline'
                    maxW={['40%', '30%', '20%', '15%']}>
                    {renderState()}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
