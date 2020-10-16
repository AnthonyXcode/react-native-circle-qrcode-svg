export default (matrix, size, isCircle) => {
  const cellSize = size / matrix.length
  let path = ''
  matrix.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column) {
        path += `M${cellSize * j} ${cellSize / 2 + cellSize * i} `
        path += `L${cellSize * (j + 1)} ${cellSize / 2 + cellSize * i} `
      }
    })
  })
  return {
    cellSize,
    path
  }
}
