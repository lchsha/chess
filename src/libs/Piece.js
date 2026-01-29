
export default class Piece {
    constructor(chess, value, rowIndex, colIndex) {
        this.value = value;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.chess = chess;
    }

    isMovePossible(targetRow, targetCol) {
        throw new Error('Метод isMovePossible должен быть реализован в наследнике');
    }

    canAttack(targetRow, targetCol) {
        throw new Error("Метод должен быть реализован в наследнике");
    }
}