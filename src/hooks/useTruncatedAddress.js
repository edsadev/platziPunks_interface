const useTruncatedAddress = (address) => {
  if (address){
    const truncateRegex = /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
    const match = address.match(truncateRegex)
    if (!match) return address
    return `${match[1]}...${match[2]}`  
  } else {
    return ""
  }
}

export default useTruncatedAddress