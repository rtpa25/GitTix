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
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TEXT_COLOR } from '../consts';

const Home = ({ tickets }: any) => {
    const router = useRouter();

    const ticketList = tickets.map((ticket: any) => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href={`/tickets/${ticket.id}`}>View</Link>
                </td>
            </tr>
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
                <Tbody>
                    <Tr>
                        <Td>Concert01</Td>
                        <Td>$20</Td>
                        <Td>Ronit</Td>
                        <Td color={TEXT_COLOR}>
                            <Link href={`/tickets/asdsd`}>View</Link>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Concert02</Td>
                        <Td>$30</Td>
                        <Td>Vansita</Td>
                        <Td color={TEXT_COLOR}>
                            <Link href={`/tickets/asdsd`}>View</Link>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Concert03</Td>
                        <Td>$10</Td>
                        <Td>Nikhil</Td>
                        <Td color={TEXT_COLOR}>
                            <Link href={`/tickets/asdsd`}>View</Link>
                        </Td>
                    </Tr>
                </Tbody>
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

Home.getInitialProps = async (
    context: NextPageContext,
    client: any,
    currentUser: any
): Promise<any> => {
    const { data } = await client.get('/api/tickets');

    return { tickets: data };
};

export default Home;
