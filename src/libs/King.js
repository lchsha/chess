import Piece from './Piece.js'

export default class King extends Piece {
    constructor(chess, value, rowIndex, colIndex) {
        super(chess, value, rowIndex, colIndex);
        this.hasMoved = false;
    }
    isMovePossible(targetRow, targetCol) {
        const rowDiff = Math.abs(targetRow - this.rowIndex);
        const colDiff = Math.abs(targetCol - this.colIndex);

        if (rowDiff === 0 && colDiff === 0) return false;
        return rowDiff <= 1 && colDiff <= 1;
    }

    canAttack(targetRow, targetCol) {
        const rowDiff = Math.abs(targetRow - this.rowIndex);
        const colDiff = Math.abs(targetCol - this.colIndex);
        return rowDiff <= 1 && colDiff <= 1;
    }
}