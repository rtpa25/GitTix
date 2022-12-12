import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react';
import { NextPage, NextPageContext } from 'next';
import { buildClient } from '../../api/build-client';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BASE_TEXT_COLOR,
    BG_COLOR_DARKER,
    TEXT_COLOR_DARK,
} from '../../consts';
import { Ticket } from '../../types/ticket';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { Order } from '../../types/order';
import { useRouter } from 'next/router';

interface IndividualTicketRequestBody {
    arg: {
        ticketId: string;
    };
}

const individualTicketRequest = async (
    url: string,
    { arg }: IndividualTicketRequestBody
) => {
    return axios<Order>({
        method: 'post',
        url: url,
        data: arg,
    });
};
const IndividualTicket: NextPage<{ ticket: Ticket }> = ({ ticket }) => {
    const router = useRouter();

    const { createdAt, creator, description, imageUrl, price, title, id } =
        ticket;

    const { trigger, isMutating, error } = useSWRMutation(
        `/api/orders`,
        individualTicketRequest
    );

    const createOrder = async () => {
        try {
            const res = await trigger({ ticketId: id });
            router.push(`/orders/${res?.data.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    const errorState = error ? (
        <Text color='red.500' fontSize='lg'>
            {error.message}
        </Text>
    ) : null;

    return (
        <Flex justifyContent={'center'} alignItems='center' py={10}>
            <Card maxW='lg' textColor={'gray.300'} bgColor={BG_COLOR_DARKER}>
                <CardBody>
                    <Image src={imageUrl} alt={title} borderRadius='lg' />
                    <Stack mt='6' spacing='3'>
                        <Heading size='xl' color={ACCENT_COLOR}>
                            {title}
                        </Heading>
                        <Text>{description}</Text>
                        <Flex mt={5} alignItems='baseline' fontSize={'lg'}>
                            <Text color={BASE_TEXT_COLOR} mr='2'>
                                Creator:
                            </Text>{' '}
                            <Text color={TEXT_COLOR_DARK}>${creator}</Text>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                            <Flex mt={2} alignItems='baseline' fontSize={'lg'}>
                                <Text color={BASE_TEXT_COLOR} mr='2'>
                                    Price:
                                </Text>{' '}
                                <Text color={TEXT_COLOR_DARK}>${price}</Text>
                            </Flex>
                            <Flex mt={2} alignItems='baseline' fontSize={'lg'}>
                                <Text color={BASE_TEXT_COLOR} mr='2'>
                                    CreatedAt:
                                </Text>{' '}
                                <Text color={TEXT_COLOR_DARK}>
                                    {new Date(createdAt).toLocaleDateString()}
                                </Text>
                            </Flex>
                        </Flex>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Button
                        onClick={createOrder}
                        color='gray.300'
                        isLoading={isMutating}
                        bgColor={ACCENT_COLOR_DARK}
                        variant='solid'
                        _hover={{ bgColor: ACCENT_COLOR }}>
                        Purchase
                    </Button>
                    {errorState}
                </CardFooter>
            </Card>
        </Flex>
    );
};

export const getServerSideProps = async ({ req, query }: NextPageContext) => {
    const { ticketId } = query;

    const axiosClient = buildClient(req);

    const { data } = await axiosClient.get(`/api/tickets/${ticketId}`);

    return {
        props: {
            ticket: data,
        },
    };
};

export default IndividualTicket;
