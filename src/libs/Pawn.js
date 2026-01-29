import Piece from './Piece.js'

export default class Pawn extends Piece {
    constructor(chess, value, rowIndex, colIndex) {
        super(chess, value, rowIndex, colIndex);
        this.enPassantFlag = false; // флаг для en passant
    }

    isMovePossible(targetRow, targetCol) {
        const startRow = this.value > 0 ? 6 : 1;
        const rowDirection = this.value > 0 ? -1 : 1;
        const rowDiff = targetRow - this.rowIndex;
        const colDiff = Math.abs(targetCol - this.colIndex);

        if (colDiff === 0 && rowDiff === rowDirection) {
            // console.log('1');
            
            if (this.chess.board[targetRow][targetCol] === 0) return true;  
            return false;
        }

        if (colDiff === 0 && startRow === this.rowIndex && rowDiff === rowDirection * 2) {
            // console.log('2');

            if (this.chess.board[this.rowIndex + rowDirection][this.colIndex]) return false;
            if (this.chess.board[targetRow][targetCol] === 0) return true;
            return false;
        }

        if (colDiff === 1 && rowDiff === rowDirection) {
            // console.log('3');
            

            const targetCell = this.chess.board[targetRow][targetCol];

            // возможность взятия на проходе
            if (this.chess.board[this.rowIndex][targetCol] instanceof Pawn && this.chess.board[this.rowIndex][targetCol].enPassantFlag) {
                return true;
            }

            if (targetCell !== 0 && Math.sign(targetCell.value) !== Math.sign(this.value)) {
                return true;
            }
        }

        // console.log('4');
        


        return false;
    }

    canAttack(targetRow, targetCol) {
        const rowDiff = targetRow - this.rowIndex;
        const colDiff = Math.abs(targetCol - this.colIndex);
        const rightDirection = this.value > 0 ? -1 : 1;
        return rowDiff === rightDirection && colDiff === 1;
    }
}