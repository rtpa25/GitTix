import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import InputField from '../../components/input-field';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BG_COLOR_DARKER,
    TEXT_COLOR,
} from '../../consts';
import { useRequest } from '../../hooks/use-request';

const Signup: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/users/signup',
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
        <Box
            h={'full'}
            maxW={['90%', '70%', '50%', '40%']}
            rounded={'lg'}
            mx={'auto'}
            my={'10%'}
            pb={'10'}
            pt={'7.5'}
            boxShadow={'md'}
            textAlign={'center'}
            bgColor={BG_COLOR_DARKER}>
            <Heading
                color={ACCENT_COLOR}
                p='2.5'
                size={'lg'}
                fontWeight='semibold'>
                SIGN UP
            </Heading>
            <Formik
                initialValues={{ password: '', email: '' }}
                onSubmit={async (values, { setErrors }) => {}}>
                {({ isSubmitting }) => (
                    <Box mx={'10%'}>
                        <Form>
                            <Box mt={4}>
                                <InputField
                                    name={'email'}
                                    placeholder={'email'}
                                    label={'Email'}
                                    type={'email'}
                                    isPassword={false}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name={'password'}
                                    placeholder={'password'}
                                    label={'Password'}
                                    type={'password'}
                                    isPassword={true}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Flex
                                justifyContent={'space-between'}
                                alignItems='baseline'>
                                <Button
                                    mt={10}
                                    type='submit'
                                    isLoading={isSubmitting}
                                    color='black'
                                    bgColor={ACCENT_COLOR_DARK}
                                    _hover={{
                                        backgroundColor: 'black',
                                        color: ACCENT_COLOR_DARK,
                                    }}>
                                    Register
                                </Button>
                                <Text color={'gray.400'}>
                                    Have an account?{' '}
                                    <NextLink href={'/auth/signin'}>
                                        <Link color={TEXT_COLOR}>SignIn</Link>
                                    </NextLink>
                                </Text>
                            </Flex>
                        </Form>
                    </Box>
                )}
            </Formik>
        </Box>
    );
};

export default Signup;
