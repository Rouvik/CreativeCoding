class TicTacToe {
    static playerID = Object.freeze({
        X: 0,
        O: 1
    });

    static playerChar = Object.freeze({
        X: 'X',
        O: 'O'
    });

    constructor() {
        this.playerOTurn = false; // true = O, false = X
        this.board = Array.from(Array(3), () => Array(3).fill(null));
        this.winner = null;
        this.lastPlayerMove = null;
        this.depthLimit = Infinity;
    }

    makeMove(positionX, positionY) {
        if (this.board[positionY][positionX] != null) {
            return false;
        }

        this.board[positionY][positionX] = this.playerOTurn ? TicTacToe.playerID.O : TicTacToe.playerID.X;
        this.playerOTurn = !this.playerOTurn;
        this.lastPlayerMove = { x: positionX, y: positionY };
        return true;
    }

    restart() {
        this.board = Array.from(Array(3), () => Array(3).fill(null));
        this.playerOTurn = false;
        this.winner = null;
        this.lastPlayerMove = null;
    }

    evaluateBoard(board = this.board) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] != null && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
                return 10 * (board[i][0] == TicTacToe.playerID.X ? 1 : -1);
            }

            if (board[0][i] != null && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
                return 10 * (board[0][i] == TicTacToe.playerID.X ? 1 : -1);
            }
        }

        if (board[0][0] != null && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            return 10 * (board[0][0] == TicTacToe.playerID.X ? 1 : -1);
        }
        else if (board[0][2] != null && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            return 10 * (board[0][2] == TicTacToe.playerID.X ? 1 : -1);
        }

        return 0;
    }

    checkWinner() {
        let evaluated = this.evaluateBoard();
        if (evaluated != 0) {
            this.winner = evaluated == 10 ? TicTacToe.playerID.X : TicTacToe.playerID.O;
            // alert(`Player ${this.winner == TicTacToe.playerID.X ? 'X' : 'O'} wins!`);
            messageContainer.textContent = `Player ${this.winner == TicTacToe.playerID.X ? 'X' : 'O'} wins!`;
        }
        else if (!this.isMovesLeft()) {
            // alert("Tie!");
            messageContainer.textContent = "Tie!";
        }
    }

    minMax(board = this.board, depth = 0, turn = this.playerOTurn) {
        const score = -this.evaluateBoard(board);
        if (score != 0) {
            if (turn) {
                return score + depth;
            }
            else {
                return score - depth;
            }
        }

        if (depth > this.depthLimit) {
            return 0;
        }

        if (!this.isMovesLeft(board)) {
            return 0;
        }

        let best;
        if (turn) {
            best = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == null) {
                        board[i][j] = TicTacToe.playerID.O;
                        best = Math.max(best, this.minMax(board, depth + 1, false));
                        board[i][j] = null;
                    }
                }
            }
        }
        else {
            best = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == null) {
                        board[i][j] = TicTacToe.playerID.X;
                        best = Math.min(best, this.minMax(board, depth + 1, true));
                        board[i][j] = null;
                    }
                }
            }
        }

        return best;
    }

    isOver() {
        return this.evaluateBoard() != 0;
    }

    isMovesLeft(board = this.board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    return true;
                }
            }
        }
        return false;
    }
}

class TicTacToeTable extends TicTacToe {
    constructor(containers) {
        super();
        this.containers = containers;
        this.addListeners();

        this.gameListener = this.cpuListener;
    }

    restart() {
        super.restart();
        messageContainer.textContent = "";
        this.containers.forEach(row => row.forEach(container => container.textContent = ""));
    }

    cpuListener(x, y) {
        if (!this.playerOTurn && this.winner == null && this.makeMove(x, y)) {
            this.checkWinner();
            if (this.winner == null) {
                this.cpuMakeMove();
                this.checkWinner();
            }
        }
    }

    player2Listener(x, y) {
        if (this.winner == null && this.makeMove(x, y)) {
            this.checkWinner();
        }
    }

    makeMove(positionX, positionY) {
        let ret = super.makeMove(positionX, positionY);
        if (ret) {
            // case is flipped since playerOTurn is flipped after the super.move
            this.containers[positionY][positionX].textContent = this.playerOTurn ? TicTacToe.playerChar.X : TicTacToe.playerChar.O;
        }

        return ret;
    }

    addListeners() {
        this.containers.forEach((row, y) => {
            row.forEach((container, x) => {
                container.addEventListener('click', () => this.gameListener(x, y));
            });
        });
    }

    cpuMakeMove() {
        let bestMove = -Infinity;
        let CPUbestMove = null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] == null) {
                    this.board[i][j] = TicTacToe.playerID.O;
                    const gameTurn = this.minMax(this.board, 0, false);
                    if (bestMove < gameTurn) {
                        bestMove = gameTurn;
                        CPUbestMove = { x: j, y: i };
                    }
                    this.board[i][j] = null;
                }
            }
        }

        if (CPUbestMove) {
            this.makeMove(CPUbestMove.x, CPUbestMove.y);
        }
    }
}

function restart() {
    game.restart();
}

function updateMode(elem) {
    switch (elem.id) {
        case 'pl2':
            game.gameListener = game.player2Listener;
            break;

        case 'cpe':
            game.gameListener = game.cpuListener;
            game.depthLimit = 1;
            break;
        case 'cpi':
            game.gameListener = game.cpuListener;
            game.depthLimit = Infinity;
            break;
    }
}

const dispBoard = document.getElementById('board');
const containersList = [...dispBoard.children[0].children].map(row => [...row.children]);
const messageContainer = document.getElementById('msg');

const game = new TicTacToeTable(containersList);