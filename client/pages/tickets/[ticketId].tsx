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
import { useRouter } from 'next/router';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BG_COLOR_DARKER,
    TEXT_COLOR,
} from '../../consts';

const IndividualTicket = () => {
    const router = useRouter();

    // const { doRequest, errors } = useRequest({
    //     method: 'post',
    //     url: '/api/orders',
    //     body: {
    //         ticketId: ticket.id,
    //     },
    // });

    const purchaseTicket = async () => {
        try {
            // const data = await doRequest();
            // console.log(data);

            router.push(`/orders/asdsd`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Flex justifyContent={'center'} alignItems='center' py={10}>
            <Card maxW='lg' textColor={'gray.300'} bgColor={BG_COLOR_DARKER}>
                <CardBody>
                    <Image
                        src='https://images.unsplash.com/photo-1609391061565-622f94e736e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1375&q=80'
                        alt='Dua Lipa Concert'
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md' color={ACCENT_COLOR}>
                            Dua Lipa Concert
                        </Heading>
                        <Text>
                            This is a ticket to the best event in town. You will
                            have a great time. Lorem ipsum dolor sit amet
                            consectetur adipisicing elit. Quisquam, quod. Dua
                            Lipa Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Quisquam, quod. Dua Lipa
                        </Text>
                        <Text color={TEXT_COLOR} fontSize='2xl'>
                            $450
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Button
                        onClick={purchaseTicket}
                        color='gray.300'
                        bgColor={ACCENT_COLOR_DARK}
                        variant='solid'
                        _hover={{ bgColor: ACCENT_COLOR }}>
                        Purchase
                    </Button>
                </CardFooter>
            </Card>
        </Flex>
    );
};

// IndividualTicket.getInitialProps = async (
//     context: NextPageContext,
//     client: any
// ) => {
//     const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
//     return { ticket: data };
// };

export default IndividualTicket;
