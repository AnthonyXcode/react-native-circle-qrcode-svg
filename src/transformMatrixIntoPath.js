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
    const backgroundCellSize = size / matrix.length
    path += 'M0 0'
    matrix.forEach((row, i) => {
      row.forEach((column, j) => {
        const shouldDraw = Math.round(Math.random()) === 1
        const isOutside = (backgroundCellSize * (j + 1) < startingPoint || backgroundCellSize * j > size - startingPoint) ||
          (cellSize / 2 + backgroundCellSize * i < startingPoint || cellSize / 2 + backgroundCellSize * i > size - startingPoint)
        if (shouldDraw && isOutside) {
          path += `M${backgroundCellSize * j} ${cellSize / 2 + backgroundCellSize * i} `
          path += `L${backgroundCellSize * (j + 1)} ${cellSize / 2 + backgroundCellSize * i} `
        }
      })
    })
  }
  return {
    cellSize,
    path,
    startingPoint
  }
}
