import Board from './Board';
import Bishop from './Bishop';
import Rook from './Rook';
import Queen from './Queen';
import Knight from './Knight';
import Pawn from './Pawn';
import King from './King';

export default class Chess {
    constructor() {
        this.board = new Board().board;
        this.currentPiece = null;
        this.whoseTurn = 1; // 1 - белые, -1 - черные

        // this.board[5][3] = new Pawn(this.board, -1, 5, 3);
        // this.board[5][2] = new Pawn(this.board, -1, 5, 2);
        // this.board[1][4] = new Pawn(this.board, -1, 1, 4);
        // this.board[1][5] = new Pawn(this.board, -1, 1, 5);
        // this.board[4][4] = new Pawn(this, -1, 4, 4);
        // this.board[1][6] = new Pawn(this, -1, 1, 6);


        // this.board[6][0] = new Pawn(1, 6, 0);
        // this.board[6][1] = new Pawn(1, 6, 1);
        // this.board[6][2] = new Pawn(1, 6, 2);
        // this.board[6][3] = new Pawn(1, 6, 3);
        // this.board[6][4] = new Pawn(1, 6, 4);
        // this.board[6][5] = new Pawn(this, 1, 6, 5);
        // this.board[3][7] = new Pawn(this, 1, 3, 7);
        // this.board[2][3] = new Pawn(this, -1, 2, 3);
        // this.board[3][3] = new Pawn(this, -1, 3, 3);
        // this.board[1][4] = new Pawn(this, -1, 1, 4);
        // this.board[2][5] = new Pawn(this, -1, 2, 5);
        // this.board[4][5] = new Pawn(this, 1, 4, 5);

        // this.board[3][3] = new Pawn(this.board, 1, 3, 3);
        // this.board[4][2] = new Pawn(this.board, 1, 4, 2);
        this.board[2][4] = new Pawn(this, 1, 2, 4);

        // this.board[0][1] = new Knight(-3, 0, 1);
        // this.board[0][6] = new Knight(-3, 0, 6);
        // this.board[7][1] = new Knight(3, 7, 1);
        // this.board[7][6] = new Knight(3, 7, 6);
        // this.board[0][3] = new Knight(this, -3, 0, 3);
        // this.board[7][3] = new Knight(this, 3, 7, 3);

        // this.board[0][2] = new Bishop(-4, 0, 2);
        // this.board[0][5] = new Bishop(-4, 0, 5);
        // this.board[7][2] = new Bishop(4, 7, 2);
        // this.board[7][5] = new Bishop(4, 7, 5);
        // this.board[1][0] = new Bishop(this, -4, 1, 0);

        // this.board[7][7] = new Rook(this, 5, 7, 7);
        // this.board[7][0] = new Rook(this, 5, 7, 0);

        // this.board[0][7] = new Rook(this, -5, 0, 7);
        // this.board[0][0] = new Rook(this, -5, 0, 0);
        // this.board[0][3] = new Rook(this, -5, 0, 3);
        // this.board[0][7] = new Rook(-5, 0, 7);
        // this.board[7][0] = new Rook(5, 7, 0);
        // this.board[7][7] = new Rook(5, 7, 7);

        // this.board[0][2] = new Rook(this, -5, 0, 2);
        // this.board[1][3] = new Bishop(this, -4, 1, 3);

        // this.board[0][3] = new Queen -9, 0, 3);
        // this.board[7][3] = new Queen(9, 7, 3);

        // this.board[7][4] = new King(this, 1000, 7, 4);
        this.board[0][2] = this.createPieceByValue(-1000, 0, 2);
        // this.board[0][4] = new King(this, -1000, 0, 4);
    }

    getBoard() {
        return this.board.map(row => [...row]); // возвращаем всегда новый массив, чтобы ссылка на массив была другой
    }

    setCurrentPiece(obj) {
        this.currentPiece = this.board[obj.rowIndex][obj.colIndex];
    }

    moveCurrentPiece(targetRow, targetCol) {
        // проверка очередности хода
        if (!this.checkingTurnOrder()) return { success: false };
        // рокировка
        if (this.currentPiece instanceof King) {
            const diffCol = targetCol - this.currentPiece.colIndex;
            if (Math.abs(diffCol) >= 2) {
                if (this.canCastle(this.currentPiece, diffCol > 0 ? 'short' : 'long')) {
                    this.preformCastle(this.currentPiece, diffCol > 0 ? 'short' : 'long');

                    // смена очередности хода
                    this.whoseTurn *= -1;
                    return {
                        success: true,
                        check: this.isCheck(this.whoseTurn) ? this.whoseTurn : null
                    };
                }
            }
        }
        // проверка возможности хода фигуры
        if (!this.currentPiece.isMovePossible(targetRow, targetCol)) return { success: false };
        // проверка заблокированного пути по диагонали для слона и ферзя
        if (!this.checkingCellsDiagonal(this.currentPiece.rowIndex, this.currentPiece.colIndex, targetRow, targetCol)) return { success: false };
        // проверка заблокированного пути по прямой для ладьи и ферзя
        if (!this.checkingCellsStraight(this.currentPiece.rowIndex, this.currentPiece.colIndex, targetRow, targetCol)) return { success: false };
        // проверка целевой клетки
        if (!this.checkingTargetCell(this.currentPiece, targetRow, targetCol)) return { success: false };


        // устанавливаем флаг для пешки при ходе на 2 клетки
        if (this.currentPiece instanceof Pawn) {
            if (Math.abs(targetRow - this.currentPiece.rowIndex) === 2) {
                this.currentPiece.enPassantFlag = true;
            } else {
                this.currentPiece.enPassantFlag = false;
            }
        }

        const capturedPiece = this.board[targetRow][targetCol];
        const prevRow = this.currentPiece.rowIndex;
        const prevCol = this.currentPiece.colIndex;

        // обновляем доску
        this.board[this.currentPiece.rowIndex][this.currentPiece.colIndex] = 0; // обязательно перед перемещением обнулить старую ячейку
        this.board[targetRow][targetCol] = this.currentPiece;

        // обновляем координаты фигуры
        this.currentPiece.rowIndex = targetRow;
        this.currentPiece.colIndex = targetCol;

        // обработка взятия на проходе
        if (this.currentPiece instanceof Pawn) {
            let takenRow = this.currentPiece.value > 0 ? targetRow + 1 : targetRow - 1;
            const takenPawn = this.board[takenRow][targetCol];

            if (takenPawn instanceof Pawn && takenPawn.enPassantFlag) {
                this.board[takenRow][targetCol] = 0;
            }
        }

        // запрет хода если мой король под шахом
        if (this.isCheck(this.whoseTurn)) {
            this.board[prevRow][prevCol] = this.currentPiece;
            this.board[targetRow][targetCol] = 0;
            this.currentPiece.rowIndex = prevRow;
            this.currentPiece.colIndex = prevCol;

            return {
                success: false,
            };
        }

        let convertedPawn = null;
        // превращение пешки
        if (this.currentPiece instanceof Pawn) {
            const lastRow = this.currentPiece.value > 0 ? 0 : 7;
            if (lastRow === this.currentPiece.rowIndex) {
                convertedPawn = {
                    capturedPiece: capturedPiece ? capturedPiece : 0,
                    prevRowIndex: prevRow,
                    prevColIndex: prevCol,
                    rowIndex: this.currentPiece.rowIndex,
                    colIndex: this.currentPiece.colIndex,
                }
                return {
                    success: true,
                    convertedPawn
                }
            };
        }

        // добавляем флаг сделанного хода фигуре
        if (this.currentPiece instanceof King || this.currentPiece instanceof Rook) {
            this.currentPiece.hasMoved = true;
        }


        // смена очередности хода
        this.whoseTurn *= -1;

        // сброс флага en passant у пешек после смены хода
        for (const row of this.board) {
            for (const piece of row) {
                if (piece instanceof Pawn && Math.sign(piece.value) !== this.whoseTurn) {
                    piece.enPassantFlag = false;
                }
            }
        }

        // проверка на мат
        if (this.isCheck(this.whoseTurn) && !this.hasAnyLegalMove(this.whoseTurn)) {
            // console.log('МАТ');

        }
        // проверка на пат
        if (!this.isCheck(this.whoseTurn) && !this.hasAnyLegalMove(this.whoseTurn)) {
            // console.log('ПАТ');

        }

        return {
            success: true,
            check: this.isCheck(this.whoseTurn) ? this.whoseTurn : null,
        };
    }

    // превращение пешки в фигуру
    promotePawn({ rowIndex, colIndex }, value) {
        const newPiece = this.createPieceByValue(value, rowIndex, colIndex);
        this.board[rowIndex][colIndex] = newPiece;

        // смена очередности хода
        this.whoseTurn *= -1;

        // сброс флага en passant у пешек после смены хода
        for (const row of this.board) {
            for (const piece of row) {
                if (piece instanceof Pawn && Math.sign(piece.value) !== this.whoseTurn) {
                    piece.enPassantFlag = false;
                }
            }
        }

        if (this.isCheck(this.whoseTurn) && !this.hasAnyLegalMove(this.whoseTurn)) {
            // МАТ
        }
        if (!this.isCheck(this.whoseTurn) && !this.hasAnyLegalMove(this.whoseTurn)) {
            // ПАТ
        }

        return {
            success: true,
            check: this.isCheck(this.whoseTurn) ? this.whoseTurn : null,
        };
    }

    // отмена хода если не выбрали фигуру при превращении пешки
    declineMove({ capturedPiece, prevRowIndex, prevColIndex, rowIndex, colIndex }) {
        const pawn = this.board[rowIndex][colIndex];

        this.board[rowIndex][colIndex] = capturedPiece;
        if (capturedPiece) {
            capturedPiece.rowIndex = rowIndex;
            capturedPiece.colIndex = colIndex;
        }
        this.board[prevRowIndex][prevColIndex] = pawn;
        pawn.rowIndex = prevRowIndex;
        pawn.colIndex = prevColIndex;
    }

    // проверка очередности хода
    checkingTurnOrder() {
        if (Math.sign(this.currentPiece.value) !== this.whoseTurn) {
            return false;
        }
        return true;
    }

    // проверка заблокированного пути по диагонали для слона и ферзя
    checkingCellsDiagonal(startRow, startCol, targetRow, targetCol) {
        // обязательная проверка на диагональный ход
        if (Math.abs(targetRow - startRow) !== Math.abs(targetCol - startCol)) return true;

        const rowDirection = targetRow - startRow > 0 ? 1 : -1;
        const colDirection = targetCol - startCol > 0 ? 1 : -1;
        const rowDiff = Math.abs(targetRow - startRow) - 1;

        for (let i = 1; i <= rowDiff; i++) {
            const currentRow = startRow + i * rowDirection;
            const currentCol = startCol + i * colDirection;
            const cellValue = this.board[currentRow][currentCol];

            if (cellValue !== 0) {
                return false;
            }
        }
        return true;
    }

    // проверка заблокированного пути по прямой для ладьи и ферзя
    checkingCellsStraight(startRow, startCol, targetRow, targetCol) {
        // обязательная проверка на прямой ход 
        if (startRow !== targetRow && startCol !== targetCol) return true;

        const rowDirection = targetRow - startRow > 0 ? 1 : -1;
        const colDirection = targetCol - startCol > 0 ? 1 : -1;
        const rowDiff = Math.abs(targetRow - startRow) - 1;
        const colDiff = Math.abs(targetCol - startCol) - 1;

        if (startRow === targetRow) {
            for (let i = 1; i <= colDiff; i++) {
                const currentCol = startCol + i * colDirection;
                const cellValue = this.board[startRow][currentCol];

                if (cellValue !== 0) {
                    return false;
                }
            }
        }

        if (startCol === targetCol) {
            for (let i = 1; i <= rowDiff; i++) {
                const currentRow = startRow + i * rowDirection;
                const cellValue = this.board[currentRow][startCol];

                if (cellValue !== 0) {
                    return false;
                }
            }
        }


        return true;
    }

    // проверка целевой клетки
    checkingTargetCell(attacker, targetRow, targetCol) {
        const targetCell = this.board[targetRow][targetCol];

        // если клетка пустая, ход возможен
        if (targetCell === 0) return true;

        // если на целевой клетке фигура того же цвета, ход невозможен
        return Math.sign(targetCell.value) !== Math.sign(attacker.value);
    }

    // проверка на шах
    isCheck(colorSign) {
        const kingPos = this.findKingPosition(colorSign);
        if (!kingPos) return false;

        const { rowIndex: kingRow, colIndex: kingCol } = kingPos;

        for (const row of this.board) {
            for (const piece of row) {
                if (piece !== 0 && Math.sign(piece.value) === -colorSign) {
                    if (piece.canAttack(kingRow, kingCol)) {
                        // console.log(`Шах ${colorSign === 1 ? 'белому' : 'черному'} королю!`);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // проверка на возможный ход
    hasAnyLegalMove(colorSign) {
        for (const row of this.board) {
            for (const piece of row) {
                if (piece === 0 || Math.sign(piece.value) !== colorSign) continue;

                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (!piece.isMovePossible(i, j)) continue;
                        if (!this.checkingCellsDiagonal(piece.rowIndex, piece.colIndex, i, j)) continue;
                        if (!this.checkingCellsStraight(piece.rowIndex, piece.colIndex, i, j)) continue;
                        if (!this.checkingTargetCell(piece, i, j)) continue;

                        // фигура которая может быть на целевой клетке
                        const prevPiece = this.board[i][j] ? this.board[i][j] : 0;

                        const prevRow = piece.rowIndex;
                        const prevCol = piece.colIndex;

                        this.board[prevRow][prevCol] = 0;
                        this.board[i][j] = piece;
                        piece.rowIndex = i;
                        piece.colIndex = j;

                        const inCheck = this.isCheck(colorSign);

                        this.board[i][j] = prevPiece;
                        this.board[prevRow][prevCol] = piece;
                        piece.rowIndex = prevRow;
                        piece.colIndex = prevCol;

                        // найден легальный ход
                        if (!inCheck) return true;
                    }
                }
            }
        }

        return false;
    }

    // поиск координат короля определенного цвета
    findKingPosition(colorSign) {
        for (const row of this.board) {
            for (const piece of row) {
                if (piece instanceof King && Math.sign(piece.value) === colorSign) {
                    return { rowIndex: piece.rowIndex, colIndex: piece.colIndex };
                }
            }
        }
        return null;
    }

    // создать фигуру
    createPieceByValue(value, row, col) {
        switch (Math.abs(value)) {
            case 9: return new Queen(this, value, row, col);
            case 5: return new Rook(this, value, row, col);
            case 4: return new Bishop(this, value, row, col);
            case 3: return new Knight(this, value, row, col);
            case 1000: return new King(this, value, row, col);
            case 1: return new Pawn(this, value, row, col);
        }
    }

    // проверка возможности рокировки
    canCastle(king, side) {
        if (king.hasMoved) return false;

        const row = king.rowIndex;
        const rookCol = side === 'short' ? 7 : 0;
        const rook = this.board[row][rookCol];

        if (!(rook instanceof Rook) || rook.hasMoved) return false;

        const startCol = Math.min(king.colIndex, rook.colIndex) + 1;
        const endCol = Math.max(king.colIndex, rook.colIndex) - 1;

        // проверка пустых клеток между королём и ладьёй
        for (let i = startCol; i <= endCol; i++) {
            if (this.board[row][i] !== 0) return false;
        }

        // const prevKingColIndex = king.colIndex;
        const checkCols = side === 'short' ? [king.colIndex, king.colIndex + 1, king.colIndex + 2,] : [king.colIndex, king.colIndex - 1, king.colIndex - 2];

        for (const cell of checkCols) {
            king.colIndex = cell;
            if (this.isCheck(Math.sign(king.value))) {
                king.colIndex = checkCols[0];
                return false;
            }
        }
        king.colIndex = checkCols[0];
        return true;
    }

    // сделать рокировку
    preformCastle(king, side) {
        const row = king.rowIndex;
        const rookCol = side === 'short' ? 7 : 0;
        const rook = this.board[row][rookCol];

        const newKingCol = side === 'short' ? king.colIndex + 2 : king.colIndex - 2;
        const newRookCol = side === 'short' ? rook.colIndex - 2 : rook.colIndex + 3;

        this.board[row][king.colIndex] = 0;
        this.board[row][rook.colIndex] = 0;
        this.board[row][newKingCol] = king;
        this.board[row][newRookCol] = rook;
        king.colIndex = newKingCol;
        rook.colIndex = newRookCol;

        king.hasMoved = true;
        rook.hasMoved = true;

        return true;
    }
}