import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { buildClient } from '../utils/build-client';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_DARK,
    BASE_TEXT_COLOR,
    BG_COLOR_DARKER,
    TEXT_COLOR,
    TEXT_COLOR_DARK,
} from '../consts';
import { Ticket } from '../types/ticket';

const Home: NextPage<{ tickets: Ticket[] }> = ({ tickets }) => {
    const router = useRouter();
    const ticketList = tickets.map((ticket) => {
        return (
            <Card key={ticket.id} backgroundColor={BG_COLOR_DARKER}>
                <CardHeader>
                    <Heading size='md' color={ACCENT_COLOR}>
                        {ticket.title}
                    </Heading>
                </CardHeader>
                <CardBody>
                    <Text color={BASE_TEXT_COLOR}>
                        {ticket.description.slice(0, 170) + '....'}
                    </Text>
                    <Flex mt={5} alignItems='baseline'>
                        <Text color={BASE_TEXT_COLOR} mr='2'>
                            Creator:
                        </Text>{' '}
                        <Text color={TEXT_COLOR_DARK}>{ticket.creator}</Text>
                    </Flex>

                    <Flex mt={2} alignItems='baseline'>
                        <Text color={BASE_TEXT_COLOR} mr='2'>
                            Price:
                        </Text>{' '}
                        <Text color={TEXT_COLOR_DARK}>${ticket.price}</Text>
                    </Flex>
                </CardBody>
                <CardFooter>
                    <Button
                        onClick={() => {
                            router.push(`/tickets/${ticket.id}`);
                        }}
                        variant={'outline'}
                        textColor={ACCENT_COLOR_DARK}
                        borderColor={ACCENT_COLOR_DARK}
                        _hover={{
                            backgroundColor: ACCENT_COLOR_DARK,
                            color: 'black',
                        }}>
                        View Details
                    </Button>
                </CardFooter>
            </Card>
        );
    });

    return (
        <>
            <Flex w={'full'} textAlign='right' justifyContent={'flex-end'}>
                <Button
                    mr={7}
                    onClick={() => {
                        router.push('/tickets/new');
                    }}
                    borderColor={TEXT_COLOR}
                    variant='outline'
                    textColor={TEXT_COLOR}
                    _hover={{
                        backgroundColor: TEXT_COLOR,
                        color: 'black',
                    }}>
                    Sell Ticket
                </Button>
            </Flex>
            <SimpleGrid
                m={['0', '3', '6', '7']}
                spacing={'16'}
                templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {ticketList}
            </SimpleGrid>
        </>
    );
};

export const getServerSideProps = async ({ req }: NextPageContext) => {
    const axiosClient = buildClient(req);
    const { data } = await axiosClient.get<Ticket[]>('/api/tickets');

    return {
        props: {
            tickets: data,
        },
    };
};

export default Home;
