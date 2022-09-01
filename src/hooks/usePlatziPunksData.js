import { useCallback, useEffect, useState } from 'react'
import usePlatziPunks from './usePlatziPunks'

const getPunkData = async ({platziPunks, tokenId}) => {
  const [
    tokenURI, 
    dna, 
    owner, 
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
    platziPunks.methods.tokenURI(tokenId).call(),
    platziPunks.methods.tokenDNA(tokenId).call(),
    platziPunks.methods.ownerOf(tokenId).call(),
    platziPunks.methods._getAccessoriesType(tokenId).call(),
    platziPunks.methods._getClotheColor(tokenId).call(),
    platziPunks.methods._getClotheType(tokenId).call(),
    platziPunks.methods._getEyeType(tokenId).call(),
    platziPunks.methods._getEyeBrowType(tokenId).call(),
    platziPunks.methods._getFacialHairColor(tokenId).call(),
    platziPunks.methods._getFacialHairType(tokenId).call(),
    platziPunks.methods._getHairColor(tokenId).call(),
    platziPunks.methods._getHatColor(tokenId).call(),
    platziPunks.methods._getGraphicType(tokenId).call(),
    platziPunks.methods._getMouthType(tokenId).call(),
    platziPunks.methods._getSkinColor(tokenId).call(),
    platziPunks.methods._getTopType(tokenId).call(),
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

const usePlatziPunksData = () => {
  const [punks, setPunks] = useState([])
  const [loading, setLoading] = useState(true)
  const platziPunks = usePlatziPunks()

  const update = useCallback(async () => {
    if(platziPunks){
      setLoading(true)

      let tokensIds;

      const totalSupply = await platziPunks.methods.totalSupply().call()
      tokensIds = new Array(Number(totalSupply)).fill().map((_, index) => index)

      const punksPromise = tokensIds.map((tokenId) => getPunkData({tokenId, platziPunks})) 

      const punks = await Promise.all(punksPromise)

      setPunks(punks)
      setLoading(false)
    }
  }, [platziPunks])

  useEffect(() => {
    update()
  }, [update])

  return {
    loading,
    punks,
    update
  }
}

export { usePlatziPunksData }