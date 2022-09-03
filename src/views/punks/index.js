import { useWeb3React } from "@web3-react/core"
import { 
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import Loading from "../../components/Loading"
import RequestAccess from "../../components/RequestAccess"
import PunkCard from "../../components/PunkCard"
import { usePlatziPunksData } from "../../hooks/usePlatziPunksData"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

const Punks = () => {
  const { search } = useLocation()
  const [ address, setAddress ] = useState(new URLSearchParams(search).get('address'))
  const [ submitted, setSubmitted ] = useState(true)
  const [ validAddress, setValidAddress ] = useState(true)
  const { active, library } = useWeb3React()
  const { punks, loading } = usePlatziPunksData({
    owner: submitted && validAddress ? address : null
  })
  const navigate = useNavigate()

  const handleAddressChange = ({target: { value }}) => {
    setAddress(value)
    setSubmitted(false)
    setValidAddress(false)
  }

  const submit = (event) => {
    event.preventDefault()
    if(address){
      const isValid = library.utils.isAddress(address)
      setValidAddress(isValid)
      setSubmitted(true)
      if(isValid) navigate(`/punks?address=${address}`)
    } else {
      navigate("/punks")
    }
  }

  if(!active) return <RequestAccess />

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement pointerEvents={null} children={<SearchIcon color="gray.3000" />}/>
            <Input 
              isInvalid={false}
              value={address ?? ''}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">Buscar</Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && <FormHelperText>Dirección inválida</FormHelperText>}
        </FormControl>
      </form>
      {loading 
        ? <Loading /> 
        : (
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {
              punks.map(({name, image, tokenId}) => (
                <Link to={`/punks/${tokenId}`} key={tokenId} >
                  <PunkCard image={image} name={name}/>
                </Link>
              ))
            }
          </Grid>
        )
      }
    </>
  )
}

export default Punks