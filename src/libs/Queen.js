import Piece from './Piece.js'

export default class Queen extends Piece {
    isMovePossible(targetRow, targetCol) {
        const rowDiff = Math.abs(targetRow - this.rowIndex);
        const colDiff = Math.abs(targetCol - this.colIndex);

        if (rowDiff === 0 && colDiff === 0) return false;
        return rowDiff === 0 || colDiff === 0 || rowDiff === colDiff;
    }

    canAttack(targetRow, targetCol) {
        return this.isMovePossible(targetRow, targetCol) &&
            this.chess.checkingCellsDiagonal(this.rowIndex, this.colIndex, targetRow, targetCol) &&
            this.chess.checkingCellsStraight(this.rowIndex, this.colIndex, targetRow, targetCol) &&
            this.chess.checkingTargetCell(this, targetRow, targetCol);
    }
}