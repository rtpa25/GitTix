import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { Form, Formik, FormikErrors } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import InputField from '../../components/input-field';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BG_COLOR_DARKER,
    TEXT_COLOR,
} from '../../consts';
import { User } from '../../types/user';
import axios from 'axios';
import { toErrorMap } from '../../utils/to-error-map';
import { useSWRConfig } from 'swr';

interface SigninRequestBody {
    arg: {
        email: string;
        password: string;
    };
}

const signinRequest = async (url: string, { arg }: SigninRequestBody) => {
    return axios<User>({
        method: 'post',
        url: url,
        data: arg,
    });
};

const Signin: NextPage = () => {
    const router = useRouter();

    const { mutate } = useSWRConfig();

    const { trigger } = useSWRMutation('/api/users/signin', signinRequest);

    const submitHandler = async (
        values: { password: string; email: string },
        setErrors: (
            errors: FormikErrors<{
                password: string;
                email: string;
            }>
        ) => void
    ) => {
        const { email, password } = values;
        try {
            await trigger({ email, password });
            router.push('/');
            mutate('/api/users/currentuser');
        } catch (error: any) {
            setErrors(toErrorMap(error.response.data.errors));
        }
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
                SIGN IN
            </Heading>
            <Formik
                initialValues={{ password: '', email: '' }}
                onSubmit={async (values, { setErrors }) => {
                    await submitHandler(values, setErrors);
                }}>
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
                                    Login
                                </Button>
                                <Text color={'gray.400'}>
                                    {"Don't Have an account?"}{' '}
                                    <Link
                                        color={TEXT_COLOR}
                                        href={'/auth/signup'}>
                                        Signup
                                    </Link>
                                </Text>
                            </Flex>
                        </Form>
                    </Box>
                )}
            </Formik>
        </Box>
    );
};

export default Signin;
