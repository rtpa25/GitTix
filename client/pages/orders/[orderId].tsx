import {
    Flex,
    Card,
    CardBody,
    Spinner,
    Text,
    Box,
    Button,
    CardFooter,
    Divider,
    Heading,
    Stack,
    Image,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BG_COLOR_DARKER,
    TEXT_COLOR,
} from '../../consts';
import { Order } from '../../types/order';
import StripeCheckout from 'react-stripe-checkout';
import { useGetCurrentUser } from '../../hooks/use-get-current-user';
import { publicStripeKey } from '../../utils/public-stripe-key';

const fetchIndividualOrderRequest = async (url: string) => {
    return axios<Order>({
        method: 'get',
        url: url,
    });
};

interface NewPaymentRequestBody {
    arg: {
        orderId: string;
        token: string;
    };
}

const newPaymentRequest = async (
    url: string,
    { arg }: NewPaymentRequestBody
) => {
    return axios({
        method: 'post',
        url: url,
        data: arg,
    });
};

const IndividualOrder = () => {
    const router = useRouter();

    const [timeLeft, setTimeLeft] = useState(0);

    const orderId = router.query.orderId;

    const { currentUser } = useGetCurrentUser();

    const { data, error, isLoading } = useSWR(
        `/api/orders/${orderId}`,
        fetchIndividualOrderRequest
    );

    const { trigger } = useSWRMutation('/api/payments', newPaymentRequest);

    useEffect(() => {
        if (!data) return;
        const findTimeLeft = () => {
            const msLeft =
                new Date(data.data.expiresAt).getTime() - new Date().getTime();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, [data]);

    if (timeLeft < 0) {
        <Flex justifyContent={'center'} alignItems='center' py={10}>
            <Card maxW='lg' textColor={'gray.300'} bgColor={BG_COLOR_DARKER}>
                <CardBody>
                    <Text>
                        Order Cancelled. Payment window of 15minutes is closed
                    </Text>
                    <Text>
                        Set a new order, if you still want to purchase the
                        ticket
                    </Text>
                </CardBody>
                <CardFooter>
                    <Button
                        color='gray.300'
                        bgColor={ACCENT_COLOR_DARK}
                        variant='solid'
                        onClick={() => {
                            router.push('/');
                        }}
                        _hover={{ bgColor: ACCENT_COLOR }}>
                        Go Back To Home
                    </Button>
                </CardFooter>
            </Card>
        </Flex>;
    }

    const renderState = () => {
        if (isLoading) {
            return (
                <CardBody>
                    <Spinner />
                </CardBody>
            );
        }
        if (error) {
            return (
                <CardBody>
                    <Text>{error?.response.data.errors[0].message}</Text>
                </CardBody>
            );
        }
        if (data) {
            const { ticket } = data.data;
            return (
                <>
                    <CardBody>
                        <Image
                            src={ticket.imageUrl}
                            alt={ticket.title}
                            borderRadius='lg'
                        />
                        <Stack mt='6' spacing='3'>
                            <Heading size='md' color={ACCENT_COLOR}>
                                {ticket.title}
                            </Heading>
                            <Text>{ticket.description}</Text>
                            <Text color={TEXT_COLOR} fontSize='2xl'>
                                ${ticket.price}
                            </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter
                        justifyContent={'space-between'}
                        alignItems='baseline'>
                        {/*@ts-ignore */}
                        <StripeCheckout
                            token={async ({ id }) => {
                                const res = await trigger({
                                    orderId: data!.data.id,
                                    token: id,
                                });
                                console.log(res?.data);
                            }}
                            stripeKey={publicStripeKey}
                            amount={data!.data.ticket.price * 100}
                            email={currentUser?.email}>
                            <Button
                                color='gray.300'
                                bgColor={ACCENT_COLOR_DARK}
                                variant='solid'
                                _hover={{ bgColor: ACCENT_COLOR }}>
                                Pay Now
                            </Button>
                        </StripeCheckout>

                        <Box>
                            <Text color={TEXT_COLOR} fontSize='lg'>
                                Time Left: {timeLeft} sec
                            </Text>
                        </Box>
                    </CardFooter>
                </>
            );
        }
    };

    return (
        <Flex justifyContent={'center'} alignItems='center' py={10}>
            <Card maxW='lg' textColor={'gray.300'} bgColor={BG_COLOR_DARKER}>
                {renderState()}
            </Card>
        </Flex>
    );
};

export default IndividualOrder;
