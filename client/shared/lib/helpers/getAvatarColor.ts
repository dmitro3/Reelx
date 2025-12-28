const colors = [
    '#F7F6CF',
    '#B6D8F2',
    '#F4CFDF',
    '#5784BA',
    '#9AC8EB',
    '#CCD4BF',
    '#E7CBA9'
  ]

  const getAvatarColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  export { getAvatarColor }