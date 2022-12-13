import {
    Box,
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    Link,
} from '@chakra-ui/react';
import { ACCENT_COLOR, ACCENT_COLOR_DARK, BASE_TEXT_COLOR } from '../../consts';
import { useGetCurrentUser } from '../../hooks/use-get-current-user';
import useSWR from 'swr';
import axios from 'axios';
import { Order } from '../../types/order';
import { OrderStatus } from '@rp-gittix/common';
import { Ticket } from '../../types/ticket';

const fetchOrderOfLoggedInUser = async (url: string) => {
    return axios<Order[]>({
        method: 'get',
        url: url,
    });
};

const fetchTicketsOfLoggedInUser = async (url: string) => {
    return axios<Ticket[]>({
        method: 'get',
        url: url,
    });
};

const Profile = () => {
    const { currentUser } = useGetCurrentUser();

    const {
        data: ordersData,
        error: ordersError,
        isLoading: ordersIsLoading,
    } = useSWR('/api/orders', fetchOrderOfLoggedInUser);

    const {
        data: ticketsData,
        error: ticketsError,
        isLoading: ticketsIsLoading,
    } = useSWR(
        `/api/tickets?userId=${currentUser?.id}&forProfilePage=true`,
        fetchTicketsOfLoggedInUser
    );

    if (ordersIsLoading || ticketsIsLoading) {
        return <div>Loading...</div>;
    }

    if (ordersError || ticketsError) {
        return <div>Error</div>;
    }

    const orders = ordersData!.data;
    const tickets = ticketsData!.data;

    const orderList = orders.map((order) => {
        return (
            <Tr key={order.id}>
                <Td>{order.ticket.title}</Td>
                <Td
                    color={
                        order.status === OrderStatus.Complete
                            ? 'green.500'
                            : 'red.500'
                    }>
                    {order.status}
                </Td>
                <Td>{order.creator}</Td>
                <Td isNumeric color={'yellow.500'}>
                    {order.ticket.price}
                </Td>
            </Tr>
        );
    });

    const ticketList = tickets.map((ticket) => {
        return (
            <Tr key={ticket.id}>
                <Td>{ticket.title}</Td>
                <Td>{ticket.creator}</Td>
                <Td isNumeric color={'yellow.500'}>
                    {ticket.price}
                </Td>
                <Td>
                    <Link
                        href={`/tickets/${ticket.id}`}
                        color={ACCENT_COLOR_DARK}>
                        View
                    </Link>
                </Td>
            </Tr>
        );
    });

    return (
        <Box m={7}>
            <Box mt={5}>
                <Heading color={ACCENT_COLOR} fontSize='4xl'>
                    Orders
                </Heading>
                <TableContainer mt={10} color={BASE_TEXT_COLOR}>
                    <Table variant='simple'>
                        <TableCaption>
                            Orders made by {currentUser?.username} in the last
                            30 days
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Status</Th>
                                <Th>Creator</Th>
                                <Th isNumeric>Price</Th>
                            </Tr>
                        </Thead>
                        <Tbody>{orderList}</Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Status</Th>
                                <Th>Creator</Th>
                                <Th isNumeric>Price</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
            <Box mt={5}>
                <Heading color={ACCENT_COLOR} fontSize='4xl' mt={5}>
                    Tickets
                </Heading>
                <TableContainer mt={10} color={BASE_TEXT_COLOR}>
                    <Table variant='simple'>
                        <TableCaption>
                            Tickets being sold by {currentUser?.username} on the
                            app
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Creator</Th>
                                <Th isNumeric>Price</Th>
                                <Th>Check</Th>
                            </Tr>
                        </Thead>
                        <Tbody>{ticketList}</Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Creator</Th>
                                <Th isNumeric>Price</Th>
                                <Th>Check</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Profile;
