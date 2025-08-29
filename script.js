const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// initialize variables for the game
let player = 'O'
let isPauseGame = false
let isGameStart = false

// Array to track the state of each cell
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

// Array of win conditions
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
]

// Utils
function updateActiveIndicator () {
  if (player === 'X') {
    xPlayerDisplay.classList.add('player-active')
    oPlayerDisplay.classList.remove('player-active')
  } else {
    xPlayerDisplay.classList.remove('player-active')
    oPlayerDisplay.classList.add('player-active')
  }
}

// Add click event listeners to each cell
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {
  // Ensure cell is empty and game isn't paused
  if (cell.textContent === '' && !isPauseGame) {
    isGameStart = true
    updateCell(cell, index)

    // If no winner yet, switch turn and let computer pick
    if (!checkWinner()) {
      changePlayer()
      randomPick()
    }
  }
}

function updateCell(cell, index) {
  cell.textContent = player
  inputCells[index] = player
  cell.style.color = (player === 'X') ? '#1892EA' : '#A737FF'
}

function changePlayer() {
  player = (player === 'X') ? 'O' : 'X'
  updateActiveIndicator()
}

function randomPick() {
  // Pause the game to allow Computer to pick
  isPauseGame = true

  setTimeout(() => {
    // Collect empty indices to avoid accidental infinite loops
    const empties = inputCells
      .map((v, i) => v === '' ? i : null)
      .filter(i => i !== null)

    // Safety: if no empty cells, just return (shouldn't happen because checkWinner handles draw)
    if (empties.length === 0) return

    // Pick a random empty index
    const randomIndex = empties[Math.floor(Math.random() * empties.length)]

    // Update the cell with Computer move
    updateCell(cells[randomIndex], randomIndex)

    // Check if Computer won or it's a draw
    if (!checkWinner()) {
      changePlayer()
      // Switch back to Human player
      isPauseGame = false
      return
    }

    // If winner/draw already declared, ensure state is paused
    isPauseGame = true
  }, 800) // Delay Computer move for a nicer UX
}

function checkWinner() {
  for (const [a, b, c] of winConditions) {
    if (inputCells[a] === player && inputCells[b] === player && inputCells[c] === player) {
      declareWinner([a, b, c])
      return true
    }
  }

  // Check for a draw (if all cells are filled)
  if (inputCells.every(cell => cell !== '')) {
    declareDraw()
    return true
  }

  return false
}

function declareWinner(winningIndices) {
  titleHeader.textContent = `${player} Win 🎉`
  isPauseGame = true

  // Highlight winning cells with gradient + glow
  winningIndices.forEach((index) => {
    const el = cells[index]
    el.style.background = 'linear-gradient(135deg, #1892EA, #A737FF)'
    el.style.animation = 'glow 1s infinite alternate'
    el.style.boxShadow = '0 0 10px #1892EA'
  })

  setTimeout(() => {
    restartBtn.style.visibility = 'visible'
  }, 500)
}

function declareDraw() {
  titleHeader.textContent = 'Draw 🤝'
  isPauseGame = true

  // Dim all cells a bit so draw state feels distinct
  cells.forEach(cell => {
    cell.style.opacity = '0.7'
  })

  setTimeout(() => {
    restartBtn.style.visibility = 'visible'
  }, 500)
}

function choosePlayer(selectedPlayer) {
  // Ensure the game hasn't started
  if (!isGameStart) {
    player = selectedPlayer
    updateActiveIndicator()
  }
}

// Expose choosePlayer if dipanggil dari onclick di HTML
window.choosePlayer = choosePlayer

restartBtn.addEventListener('click', () => {
  restartBtn.style.visibility = 'hidden'
  inputCells.fill('')
  cells.forEach(cell => {
    cell.textContent = ''
    cell.style.background = ''
    cell.style.animation = ''
    cell.style.boxShadow = ''
    cell.style.opacity = '1'
    cell.style.color = ''
  })
  isPauseGame = false
  isGameStart = false
  titleHeader.textContent = 'Choose'
  // Reset indicator (kedua pemain non-aktif)
  xPlayerDisplay.classList.remove('player-active')
  oPlayerDisplay.classList.remove('player-active')
})

