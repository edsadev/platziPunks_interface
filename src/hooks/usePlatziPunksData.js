import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import usePlatziPunks from './usePlatziPunks'

const getPunkData = async ({platziPunks, tokenId}) => {
  const [
    tokenURI, 
    dna, 
    owner,
  ] = await Promise.all([
    platziPunks.methods.tokenURI(tokenId).call(),
    platziPunks.methods.tokenDNA(tokenId).call(),
    platziPunks.methods.ownerOf(tokenId).call(),
  ])

  const [
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType
  ] = await Promise.all([
    platziPunks.methods._getAccessoriesType(dna).call(),
    platziPunks.methods._getClotheColor(dna).call(),
    platziPunks.methods._getClotheType(dna).call(),
    platziPunks.methods._getEyeType(dna).call(),
    platziPunks.methods._getEyeBrowType(dna).call(),
    platziPunks.methods._getFacialHairColor(dna).call(),
    platziPunks.methods._getFacialHairType(dna).call(),
    platziPunks.methods._getHairColor(dna).call(),
    platziPunks.methods._getHatColor(dna).call(),
    platziPunks.methods._getGraphicType(dna).call(),
    platziPunks.methods._getMouthType(dna).call(),
    platziPunks.methods._getSkinColor(dna).call(),
    platziPunks.methods._getTopType(dna).call(),
  ])

  const responseMetadata = await fetch(tokenURI)
  const metadata = await responseMetadata.json()

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType
    },
    tokenURI,
    dna,
    owner,
    ...metadata
  }
}

const usePlatziPunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([])
  const { library } = useWeb3React()
  const [loading, setLoading] = useState(true)
  const platziPunks = usePlatziPunks()

  const update = useCallback(async () => {
    if(platziPunks){
      setLoading(true)

      let tokensIds;

      if(!library.utils.isAddress(owner)){
        const totalSupply = await platziPunks.methods.totalSupply().call()
        tokensIds = new Array(Number(totalSupply)).fill().map((_, index) => index)
      } else {
        const balanceOf = await platziPunks.methods.balanceOf(owner).call( )

        const tokensIdsOfOwner = new Array(Number(balanceOf)).fill().map((_, index) => {
          return platziPunks.methods.tokenOfOwnerByIndex(owner, index).call()
        })

        tokensIds = await Promise.all(tokensIdsOfOwner)
      }

      const punksPromise = tokensIds.map((tokenId) => getPunkData({tokenId, platziPunks})) 

      const punks = await Promise.all(punksPromise)

      setPunks(punks)
      setLoading(false)
    }
  }, [platziPunks, owner, library.utils])

  useEffect(() => {
    update()
  }, [update])

  return {
    loading,
    punks,
    update
  }
}

const usePlatziPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({})
  const [loading, setLoading] = useState(true)
  const platziPunks = usePlatziPunks()

  const update = useCallback(async () => {
    if(platziPunks && tokenId != null){
      setLoading(true)
      
      const toSet = await getPunkData({tokenId, platziPunks})
      setPunk(toSet)

      setLoading(false)
    }
  }, [platziPunks, tokenId])

  useEffect(() => {
    update()
  }, [update])

  return {
    loading,
    punk,
    update
  }
}

export { usePlatziPunksData, usePlatziPunkData }