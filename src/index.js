// https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/

const player = 'X';
const opponent = 'O';
const moveSeparator = '_';
const positionSeparator = '-';

function isMovesLeft(board, size)
{
	for(let i = 0; i < size; i++)
		for(let j = 0; j < size; j++)
			if (board[i][j] === '')
				return true;

	return false;
}

function evaluate(b, size)
{
	// Checking for Rows for X or O victory.
	for(let row = 0; row < size; row++)
	{
		if (b[row][0] == b[row][1] &&
			b[row][1] == b[row][2])
		{
			if (b[row][0] == player)
				return 10;

			else if (b[row][0] == opponent)
				return -10;
		}
	}

	// Checking for Columns for X or O victory.
	for(let col = 0; col < size; col++)
	{
		if (b[0][col] == b[1][col] &&
			b[1][col] == b[2][col])
		{
			if (b[0][col] == player)
				return 10;

			else if (b[0][col] == opponent)
				return -10;
		}
	}

	// Checking for Diagonals for X or O victory.
	if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
	{
		if (b[0][0] == player)
			return 10;

		else if (b[0][0] == opponent)
			return -10;
	}

	if (b[0][2] == b[1][1] &&
		b[1][1] == b[2][0])
	{
		if (b[0][2] == player)
			return +10;

		else if (b[0][2] == opponent)
			return -10;
	}

	return 0;
}

// This is the minimax function. It
// considers all the possible ways
// the game can go and returns the
// value of the board
function minimax(board, size, depth, isMax)
{
	let score = evaluate(board, size);

	// If Maximizer has won the game
	// return his/her evaluated score
	if (score == 10)
		return score;

	// If Minimizer has won the game
	// return his/her evaluated score
	if (score == -10)
		return score;

	if (!isMovesLeft(board, size)) {
		return 0;
	}

	if (isMax) {
		// maximizer move
		let best = -1000;

		// Traverse all cells
		for(let i = 0; i < size; i++)
		{
			for(let j = 0; j < size; j++)
			{

				// Check if cell is empty
				if (board[i][j]=='')
				{

					// Make the move
					board[i][j] = player;

					// Call minimax recursively
					// and choose the maximum value
					best = Math.max(best, minimax(board, size, depth + 1, !isMax));

					// Undo the move
					board[i][j] = '';
				}
			}
		}
		return best;
	} else {
		// minimizer move
		let best = 1000;
		// Traverse all cells
		for(let i = 0; i < size; i++)
		{
			for(let j = 0; j < size; j++)
			{

				// Check if cell is empty
				if (board[i][j] === '')
				{

					// Make the move
					board[i][j] = opponent;

					// Call minimax recursively and
					// choose the minimum value
					best = Math.min(best, minimax(board, size, depth + 1, !isMax));

					// Undo the move
					board[i][j] = '';
				}
			}
		}
		return best;
	}
}

// This will return the best possible
// move for the player
function findBestMove(board, size)
{
	let bestVal = -1000;
	let bestMove = {
		row: -1,
		col: -1,
	};

	// Traverse all cells, evaluate
	// minimax function for all empty
	// cells. And return the cell
	// with optimal value.
	for(let i = 0; i < size; i++) {
		for(let j = 0; j < size; j++) {
			// Check if cell is empty
			if (board[i][j] === '') {
				// Make the move
				board[i][j] = player;

				// compute evaluation function
				// for this move.
				let moveVal = minimax(board, size, 0, false);

				// Undo the move
				board[i][j] = '';

				if (moveVal > bestVal) {
					bestMove.row = i;
					bestMove.col = j;
					bestVal = moveVal;
				}
			}
		}
	}

	// console.log("The value of the best move is: " + bestVal + "\n");

	return bestMove;
}

function parseMoves(moves)
{
	let board = [
		[ '', '', '' ],
		[ '', '', '' ],
		[ '', '', '' ]
	];

	for (const move of moves.split(moveSeparator)) {
		const parts = move.split(positionSeparator);
		board[parts[1]][parts[2]] = parts[0]
	}
	return board;
}

/**
 * @typedef {Object} Env
 */

export default {
	async fetch(request) {
		const url = new URL(request.url);
		if (url.searchParams.get('gid')) {
			// const gid = '1';
			let size = parseInt(url.searchParams.get('size') || '3', 10);
			let playing = url.searchParams.get('playing');
			let moves = url.searchParams.get('moves') || '';

			if (size !== 3) {
				return new Response(`Error:Sorry. Can't do it bro.`);
			}

			let bestMove;

			if (moves) {
				let board = parseMoves(moves);
				bestMove = findBestMove(board, size);
			} else {
				bestMove = {
					row: size - 1,
					col: size - 1,
				}
			}

			const move = `Move:${playing}${positionSeparator}${bestMove.row}${positionSeparator}${bestMove.col}`
			return new Response(move);
		}
		return new Response('I am a real Maxi.');
	},
};
