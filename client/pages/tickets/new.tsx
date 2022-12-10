import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Link,
    Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
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

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const router = useRouter();

    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/tickets',
        body: {
            title,
            price,
        },
        onSuccess() {
            router.push('/');
        },
    });

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const data = await doRequest();
            console.log(data);
            setPrice('');
            setTitle('');
        } catch (error) {
            console.error(error);
        }
    };

    const blurHandler = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
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
                CREATE TICKET
            </Heading>

            <Formik
                initialValues={{ title: '', price: 0, imageUrl: '' }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values);
                }}>
                {({ isSubmitting }) => (
                    <Box mx={'10%'}>
                        <Form>
                            <Box mt={4}>
                                <InputField
                                    name={'title'}
                                    placeholder={'title'}
                                    label={'Title'}
                                    type={'text'}
                                    isPassword={false}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name={'price'}
                                    placeholder={'10'}
                                    label={'Price'}
                                    type={'number'}
                                    isPassword={false}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Box mt={'10'} w='full'>
                                <Input
                                    name='imageUrl'
                                    type={'file'}
                                    variant='flushed'
                                    bgColor={'transparent'}
                                    color={ACCENT_COLOR}
                                    onChange={(e) => {
                                        console.log(e.target.files);
                                        //TODO process the selected file and host it in firebase cloud storage and convert it into an url and use that in the post request to the ticket server
                                    }}
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
                                    Create
                                </Button>
                                <Text color={'gray.400'}>
                                    Changed your mind?{' '}
                                    <NextLink href={'/'}>
                                        <Link color={TEXT_COLOR}>Home</Link>
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

export default NewTicket;
