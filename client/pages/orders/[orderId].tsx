import {
    Box,
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
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BG_COLOR_DARKER,
    TEXT_COLOR,
} from '../../consts';

const IndividualOrder = () => {
    // const [timeLeft, setTimeLeft] = useState(0);

    // useEffect(() => {
    //     const findTimeLeft = () => {
    //         const dateNow = new Date(
    //             new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    //         );

    //         const msLeft =
    //             new Date(order.expiresAt).getTime() - dateNow.getTime();

    //         setTimeLeft(Math.round(msLeft / 1000));
    //     };
    //     findTimeLeft();
    //     const timerId = setInterval(findTimeLeft, 1000);
    //     return () => {
    //         clearInterval(timerId);
    //     };
    // }, [order.expiresAt]);

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
                <CardFooter
                    justifyContent={'space-between'}
                    alignItems='baseline'>
                    <Button
                        color='gray.300'
                        bgColor={ACCENT_COLOR_DARK}
                        variant='solid'
                        _hover={{ bgColor: ACCENT_COLOR }}>
                        Pay Now
                    </Button>
                    <Box>
                        <Text color={TEXT_COLOR} fontSize='lg'>
                            Time Left: 30 sec
                        </Text>
                    </Box>
                </CardFooter>
            </Card>
        </Flex>
    );
};

// IndividualOrder.getInitialProps = async (
//     context: NextPageContext,
//     client: AxiosInstance
// ) => {
//     const { orderId } = context.query;
//     const { data } = await client.get(`/api/orders/${orderId}`);

//     return { order: data };
// };

export default IndividualOrder;
