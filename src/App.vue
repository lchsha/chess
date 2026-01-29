<script setup>
import { onMounted, onUnmounted, nextTick, useTemplateRef, ref } from 'vue';
import Bishop from './components/Bishop.vue';
import Piece from './components/Piece.vue';
import Chess from './libs/Chess';

const chessInstance = new Chess();
const boardArr = ref(chessInstance.getBoard());

const rows = boardArr.value.length;
const cols = boardArr.value[0].length;
const cellRefs = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
);
// const d

const check = ref(null);
const convertedPawn = ref({});
const piecesMap = {
    '-4': Bishop,
    '4': Bishop,
};


function onPickPiece(obj) {
    chessInstance.setCurrentPiece(obj);
}
function onPutPiece(coords) {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            const coordsCell = cellRefs[rowIndex][colIndex].getBoundingClientRect();

            if (coords.x >= coordsCell.left &&
                coords.x <= coordsCell.right &&
                coords.y >= coordsCell.top &&
                coords.y <= coordsCell.bottom
            ) {
                const result = chessInstance.moveCurrentPiece(
                    rowIndex,
                    colIndex
                );

                if (result?.success) {
                    boardArr.value = chessInstance.getBoard();

                    if (result.check) {
                        check.value = result.check;
                    } else {
                        check.value = null;
                    }

                    if (result.convertedPawn) {
                        convertedPawn.value = result.convertedPawn;
                    }
                }

            }
        }
    }
}
function onTurnPawn(value) {
    if (value === null) {
        chessInstance.declineMove(convertedPawn.value);
        convertedPawn.value = {};
        boardArr.value = chessInstance.getBoard();
    };

}

function onClickOutsideDropdown(e) {
    if (!Object.keys(convertedPawn.value).length || e.target.closest('.dropdown')) return;
    onTurnPawn(null);
}

onMounted(() => {
    nextTick(() => {
        document.addEventListener('click', onClickOutsideDropdown);
    })
});
onUnmounted(() => {
    document.addEventListener('click', onClickOutsideDropdown);
})

</script>

<template>
    <div class="chessboard-wrapper">
        <div class="chessboard">
            <div v-for="(item, rowIndex) in boardArr" :key="rowIndex" class="row">
                <div v-for="(el, colIndex) in boardArr[rowIndex]" :key="`${rowIndex}-${colIndex}-${el}`" :class="{
                    'light': (colIndex + rowIndex) % 2 === 0, 'dark': (colIndex + rowIndex) % 2 !== 0
                }" class="col relative" :ref="el => cellRefs[rowIndex][colIndex] = el">
                    <Piece v-if="el !== 0" :value="el.value" :rowIndex="rowIndex" :colIndex="colIndex" @turnPawn="onTurnPawn" @pick="onPickPiece" @put="onPutPiece" :isCheck="Math.abs(el.value) === 1000 && Math.sign(el.value) === check"
                        :promotionInfo="convertedPawn" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chessboard-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 150px;
}

.chessboard {
    background-color: red;
    width: 600px;
    height: 600px;
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex: 0 0 12.5%;
}

.col {
    flex: 0 0 12.5%;
    width: 12.5%;
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(img) {
        width: 100%;
        height: 100%;
        object-fit: contain;
        max-width: 100%;
        max-height: 100%;
    }

    &.light {
        background-color: #f0d9b5;
    }

    &.dark {
        background-color: #b58863;
    }
}
</style>
