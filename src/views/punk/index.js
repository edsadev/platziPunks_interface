import { useState } from "react";
import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/RequestAccess";
import PunkCard from "../../components/PunkCard";
import { usePlatziPunkData } from "../../hooks/usePlatziPunksData";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, punk, update } = usePlatziPunkData(tokenId);
  const toast = useToast()
  const platziPunks = usePlatziPunks()
  const [transfering, setTransfering] = useState(false);

  const transfer = () => {
    setTransfering(true)
    const address = prompt("Ingresa el dirección: ")
    const isAddress = library.utils.isAddress(address)

    if(!isAddress){
      toast({
        title: "Dirección invalida",
        description: "La dirección ingresada no es una dirección de Ethereum",
        status: "error"
      })
      setTransfering(false)
    } else {
      platziPunks.methods.safeTransferFrom(
        punk.owner,
        address,
        punk.tokenId
      ).send({
        from: account,
      })
      .on('error', (e) => {
        toast({
          title: "Error",
          description: e.message,
          status: "error"
        })
        setTransfering(false)
      })
      .on('transactionHash', (txHash) => {
        toast({
          title: 'Transacción enviada',
          description: txHash,
          status: 'info',
        })
      })
      .on('receipt', () => {
        setTransfering(false)
        toast({
          title: 'Transacción confirmarda',
          description: `Punk ahora pertenece a ${address}`,
          status: 'success'
        })
        update()
      })
    }

  }

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={punk.name}
          image={punk.image}
        />
        <Button 
          disabled={account !== punk.owner} 
          colorScheme="green"
          onClick={transfer}
          isLoading={transfering}
        >
          {account !== punk.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;