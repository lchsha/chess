import Piece from './Piece.js'

export default class Knight extends Piece {
    isMovePossible(targetRow, targetCol) {
        const rowDiff = Math.abs(targetRow - this.rowIndex);
        const colDiff = Math.abs(targetCol - this.colIndex);

        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    canAttack(targetRow, targetCol) {
       return this.isMovePossible(targetRow, targetCol);
    }
}