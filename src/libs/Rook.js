import Piece from './Piece.js'

export default class Rook extends Piece {
    constructor(chess, value, rowIndex, colIndex) {
        super(chess, value, rowIndex, colIndex);
        this.hasMoved = false;
    }
    isMovePossible(targetRow, targetCol) {
        const rowDiff = Math.abs(targetRow - this.rowIndex);
        const colDiff = Math.abs(targetCol - this.colIndex);

        if (rowDiff === 0 && colDiff === 0) return false;
        return rowDiff === 0 || colDiff === 0;
    }

    canAttack(targetRow, targetCol) {
        return this.isMovePossible(targetRow, targetCol) &&
            this.chess.checkingCellsStraight(this.rowIndex, this.colIndex, targetRow, targetCol) &&
            this.chess.checkingTargetCell(this, targetRow, targetCol);
    }
}