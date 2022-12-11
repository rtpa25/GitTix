import { FC } from 'react';
import { CurrentUserResult } from '../types/user';
import NextLink from 'next/link';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import { ACCENT_COLOR, BG_COLOR_DARKER, TEXT_COLOR } from '../consts';

interface HeaderProps extends CurrentUserResult {}

const Header: FC<HeaderProps> = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    ];

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
                    {links.map((link) => {
                        if (!link) return null;
                        return (
                            <Box key={link.label} mx='3' color={TEXT_COLOR}>
                                <Link
                                    fontSize={['sm', 'md', 'lg']}
                                    href={link.href}>
                                    {link.label}
                                </Link>
                            </Box>
                        );
                    })}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
