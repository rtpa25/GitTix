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
import { TEXT_COLOR } from '../consts';

const Home = () => {
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

export default Home;
