export default (matrix, size, isCircle) => {
  const cellSize = (isCircle ? (size * Math.cos(Math.PI / 4) - 10) : size) / matrix.length
  const startingPoint = isCircle ? (size - size * Math.cos(Math.PI / 4) + 10) / 2 : 0
  let path = ''
  matrix.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column) {
        path += `M${cellSize * j + startingPoint} ${cellSize / 2 + cellSize * i + startingPoint} `
        path += `L${cellSize * (j + 1) + startingPoint} ${cellSize / 2 + cellSize * i + startingPoint} `
      }
    })
  })
  if (isCircle) {
    let i = 0
    let j = 0
    while (j * cellSize < size) {
      i += 1
      if (i * cellSize > size) {
        i = 0
        j += 1
      }
      const shouldDraw = Math.round(Math.random()) === 1
      const isOutsideX = (i * cellSize < startingPoint)
      const isOutsideY = (j * cellSize < startingPoint) || (j * cellSize > size - startingPoint)
      if (shouldDraw && isOutsideX) {
        path += `M${i * cellSize} ${cellSize / 2 + j * cellSize} `
        path += `L${(i + 1) * cellSize} ${cellSize / 2 + j * cellSize} `
        path += `M${size - i * cellSize} ${cellSize / 2 + j * cellSize} `
        path += `L${size - (i + 1) * cellSize} ${cellSize / 2 + j * cellSize} `
      } else if (shouldDraw && isOutsideY) {
        path += `M${i * cellSize} ${cellSize / 2 + j * cellSize} `
        path += `L${(i + 1) * cellSize} ${cellSize / 2 + j * cellSize} `
      }
    }
  }
  return {
    cellSize,
    path,
    startingPoint
  }
}
