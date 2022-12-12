import {
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
import { NextPage, NextPageContext } from 'next';
import { buildClient } from '../api/build-client';
import { TEXT_COLOR } from '../consts';
import { Ticket } from '../types/ticket';

const Home: NextPage<{ tickets: Ticket[] }> = ({ tickets }) => {
    console.log(tickets);

    const ticketList = tickets.map((ticket) => {
        return (
            <Tr key={ticket.id}>
                <Td>{ticket.title}</Td>
                <Td>${ticket.price}</Td>
                <Td>{ticket.username}</Td>
                <Td color={TEXT_COLOR}>
                    <Link href={`/tickets/${ticket.id}`}>View</Link>
                </Td>
            </Tr>
        );
    });

    return (
        <TableContainer m={['0', '3', '6', '10']}>
            <Table textColor={'white'}>
                <TableCaption>
                    List of all available tickets by users
                </TableCaption>
                <Thead>
                    <Tr>
                        <Th>Ticket Name</Th>
                        <Th>Price</Th>
                        <Th>Username</Th>
                        <Th>View Ticket</Th>
                    </Tr>
                </Thead>
                <Tbody>{ticketList}</Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Ticket Name</Th>
                        <Th>Price</Th>
                        <Th>Username</Th>
                        <Th>View Ticket</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};

export const getServerSideProps = async ({ req }: NextPageContext) => {
    const axiosClient = buildClient(req);
    const { data } = await axiosClient.get('/api/tickets');

    return {
        props: {
            tickets: data,
        },
    };
};

export default Home;
