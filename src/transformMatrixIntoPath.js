export default (matrix, size, isCircle, border) => {
  if (!isCircle) {
    let path = ''
    const cellSize = size / matrix.length
    const startingPoint = 0
    matrix.forEach((row, i) => {
      row.forEach((column, j) => {
        if (column) {
          path += `M${cellSize * j + startingPoint} ${cellSize / 2 + cellSize * i + startingPoint} `
          path += `L${cellSize * (j + 1) + startingPoint} ${cellSize / 2 + cellSize * i + startingPoint} `
        }
      })
    })
    return {
      cellSize,
      path,
      startingPoint
    }
  } else {
    let path = ''
    const codeLength = (size - border * 2) * Math.cos(Math.PI / 4)
    const tempCellSize = codeLength / matrix.length
    let fillerCount = Math.round((size - codeLength) / tempCellSize)
    if (fillerCount % 2 !== 0) {
      fillerCount += 1
    }
    const startingPoint = fillerCount / 2
    const numberOfCell = fillerCount + matrix.length
    const cellSize = size / (fillerCount + matrix.length)

    let i = 0
    let j = 0
    while (j <= numberOfCell) {
      i += 1
      if (i >= numberOfCell) {
        i = 0
        j += 1
      }
      if (i === startingPoint - 1 || j === startingPoint - 1 || i === startingPoint + matrix.length || j === startingPoint + matrix.length) {

      } else if (i < startingPoint || i >= startingPoint + matrix.length) {
        const shouldDraw = Math.round(Math.random()) === 1
        if (shouldDraw) {
          path += `M${cellSize * j} ${cellSize + cellSize * i} `
          path += `L${cellSize * (j + 1)} ${cellSize + cellSize * i} `
        }
      } else if (j < startingPoint || j >= startingPoint + matrix.length) {
        const shouldDraw = Math.round(Math.random()) === 1
        if (shouldDraw) {
          path += `M${cellSize * j} ${cellSize + cellSize * i} `
          path += `L${cellSize * (j + 1)} ${cellSize + cellSize * i} `
        }
      } else {
        const column = matrix[i - startingPoint][j - startingPoint]
        if (column) {
          path += `M${cellSize * j} ${cellSize + cellSize * i} `
          path += `L${cellSize * (j + 1)} ${cellSize + cellSize * i} `
        }
      }
    }
    return {
      cellSize,
      path,
      startingPoint: startingPoint * cellSize
    }
  }
}
