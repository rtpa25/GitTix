import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Link,
    Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Form, Formik, FormikErrors } from 'formik';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { v4 } from 'uuid';
import InputField from '../../../components/input-field';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BG_COLOR_DARKER,
    TEXT_COLOR,
} from '../../../consts';
import { Ticket } from '../../../types/ticket';
import { buildClient } from '../../../utils/build-client';
import { storage } from '../../../utils/firebase';
import { toErrorMap } from '../../../utils/to-error-map';

interface EditTicketRequestBody {
    arg: {
        title: string;
        price: number;
        imageUrl: string;
        description: string;
    };
}

const updateTicketRequest = async (
    url: string,
    { arg }: EditTicketRequestBody
) => {
    return axios<Ticket>({
        method: 'put',
        url: url,
        data: arg,
    });
};

const EditTicket: NextPage<{ ticket: Ticket }> = ({ ticket }) => {
    const { description, price, title } = ticket;

    const [imageUrl, setImageUrl] = useState<string>('');

    const router = useRouter();

    const ticketId = router.query.ticketId as string;

    const { trigger } = useSWRMutation(
        `/api/tickets/${ticketId}`,
        updateTicketRequest
    );

    const submitHandler = async (
        values: { title: string; price: number; description: string },
        {
            setErrors,
        }: {
            setErrors: (
                errors: FormikErrors<{
                    title: string;
                    price: number;
                    description: string;
                }>
            ) => void;
        }
    ) => {
        const { title, price, description } = values;
        try {
            await trigger({ title, price, imageUrl, description });
            router.push('/');
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
                UPDATE TICKET
            </Heading>

            <Formik
                initialValues={{ title: '', price: 0, description: '' }}
                onSubmit={submitHandler}>
                {({ isSubmitting }) => (
                    <Box mx={'10%'}>
                        <Form>
                            <Box mt={4}>
                                <InputField
                                    name={'title'}
                                    label={'Title'}
                                    type={'text'}
                                    isPassword={false}
                                    showFormLabel={true}
                                    placeholder={title}
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    placeholder={description}
                                    name={'description'}
                                    label={'Description'}
                                    type={'text'}
                                    isPassword={false}
                                    textArea={true}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name={'price'}
                                    label={'Price'}
                                    type={'number'}
                                    isPassword={false}
                                    showFormLabel={true}
                                    placeholder={price.toString()}
                                />
                            </Box>
                            <Box mt={'10'} w='full'>
                                <Input
                                    type={'file'}
                                    variant='flushed'
                                    bgColor={'transparent'}
                                    color={ACCENT_COLOR}
                                    onChange={(e) => {
                                        const imageRef = ref(
                                            storage,
                                            `images/${
                                                e.target.files![0].name + v4()
                                            }`
                                        );
                                        uploadBytes(
                                            imageRef,
                                            e.target.files![0]
                                        ).then((snapshot) => {
                                            getDownloadURL(snapshot.ref).then(
                                                (url) => {
                                                    setImageUrl(url);
                                                }
                                            );
                                        });
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
                                    Update
                                </Button>
                                <Text color={'gray.400'}>
                                    Changed your mind?{' '}
                                    <Link color={TEXT_COLOR} href={'/'}>
                                        Home
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

export const getServerSideProps = async ({ req, query }: NextPageContext) => {
    const { ticketId } = query;

    const axiosClient = buildClient(req);

    const { data } = await axiosClient.get<Ticket>(`/api/tickets/${ticketId}`);

    data.createdAt = new Date(data.createdAt).toLocaleDateString();

    return {
        props: {
            ticket: data,
        },
    };
};
export default EditTicket;
