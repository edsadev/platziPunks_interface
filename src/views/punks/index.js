import { useWeb3React } from "@web3-react/core"
import { Grid } from "@chakra-ui/react"
import Loading from "../../components/Loading"
import RequestAccess from "../../components/RequestAccess"
import PunkCard from "../../components/PunkCard"
import { usePlatziPunksData } from "../../hooks/usePlatziPunksData"

const Punks = () => {
  const { active } = useWeb3React()
  const { punks, loading } = usePlatziPunksData()

  if(!active) return <RequestAccess />

  return (
    <>
      {loading 
        ? <Loading /> 
        : (
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {
              punks.map(({name, image, tokenId}) => (
                <PunkCard image={image} name={name} key={tokenId}/>
              ))
            }
          </Grid>
        )
      }
    </>
  )
}

export default Punks