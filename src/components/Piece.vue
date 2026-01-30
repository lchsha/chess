<script setup>
import { onMounted, useTemplateRef, ref, onUpdated, watch } from 'vue';

const { value, rowIndex, colIndex, isCheck, promotionInfo } = defineProps({
    value: {
        type: Number,
        required: true
    },
    rowIndex: {
        type: Number,
        required: true
    },
    colIndex: {
        type: Number,
        required: true
    },
    isCheck: {
        type: Boolean,
        required: true
    },
    promotionInfo: {
        type: Object,
        required: true
    },
});
const emit = defineEmits(['pick', 'put', 'turn-pawn']);

const piece = useTemplateRef('piece');
const promotionDropdown = useTemplateRef('promotionDropdown');
const pieceWrapper = useTemplateRef('piece-wrapper');
let ghost = null;
let isDragged = ref(false);

const imgSrc = new Map([
    [-4, '/images/bishop-black.png'],
    [4, '/images/bishop-white.png'],
    [-5, '/images/rook-black.png'],
    [5, '/images/rook-white.png'],
    [-9, '/images/queen-black.png'],
    [9, '/images/queen-white.png'],
    [-3, '/images/knight-black.png'],
    [3, '/images/knight-white.png'],
    [-1, '/images/pawn-black.png'],
    [1, '/images/pawn-white.png'],
    [-1000, '/images/king-black.png'],
    [1000, '/images/king-white.png'],
]);

onMounted(() => {

});

onUpdated(() => {

});

watch(
    () => {
        if (Object.keys(promotionInfo).length > 0 && promotionDropdown.value) {
            // console.log(promotionInfo);
            
            promotionDropdown.value.focus();
        }
    },
    (x) => {
    }
);

function onMouseDown(e) {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    isDragged.value = true;

    piece.value.style.position = 'fixed';
    piece.value.style.width = pieceWrapper.value.offsetWidth + 'px';
    piece.value.style.height = pieceWrapper.value.offsetHeight + 'px';
    setCoordsForPiece(e);
    emit('pick', { value, rowIndex, colIndex });
}
function onMouseMove(e) {
    setCoordsForPiece(e);
}
function onMouseUp(e) {
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);
    isDragged.value = false;

    piece.value.style.position = '';
    piece.value.style.width = '';
    piece.value.style.height = '';
    piece.value.style.left = '';
    piece.value.style.top = '';
    emit('put', { x: e.clientX, y: e.clientY });
}
function setCoordsForPiece(e) {
    piece.value.style.left = e.clientX - pieceWrapper.value.offsetWidth / 2 + 'px';
    piece.value.style.top = e.clientY - pieceWrapper.value.offsetHeight / 2 + 'px';
}
function onClickDesiredPiece(value) {
    emit('turn-pawn', value);
    document.activeElement?.blur();
}
</script>

<template>
    <div class="piece-wrapper" :class="{ dragged: isDragged, check: isCheck }" ref="piece-wrapper">
        <div ref="piece" class="piece" @mousedown="onMouseDown" @mouseup="test">
            <img :src="imgSrc.get(value)" alt="" draggable="false" />
        </div>
        <div v-if="isDragged" class="piece ghost">
            <img :src="imgSrc.get(value)" draggable="false" />
        </div>
    </div>

    <div v-if="Object.keys(promotionInfo).length > 0" class="dropdown dropdown-center absolute top-0">
        <div tabindex="0" role="button" class="btn p-0 m-0 w-0 h-0 border-none" ref="promotionDropdown"></div>
        <!-- <div tabindex="0" role="button" class="btn " ref="dropdownBtn"></div> -->
        <ul tabindex="-1" class="dropdown-content menu bg-base-100 z-100 w-[75px] p-0 shadow-sm top-0">
            <li>
                <a class="block w-[75px] h-[75px]" @click="onClickDesiredPiece(Math.sign(value) === 1 ? 9 : -9)">
                    <img :src="imgSrc.get(Math.sign(value) === 1 ? 9 : -9)" alt="">
                </a>
            </li>
            <li>
                <a class="block w-[75px] h-[75px]" @click="onClickDesiredPiece(Math.sign(value) === 1 ? 3 : -3)">
                    <img :src="imgSrc.get(Math.sign(value) === 1 ? 3 : -3)" alt="">
                </a>
            </li>
            <li>
                <a class="block w-[75px] h-[75px]" @click="onClickDesiredPiece(Math.sign(value) === 1 ? 5 : -5)">
                    <img :src="imgSrc.get(Math.sign(value) === 1 ? 5 : -5)" alt="">
                </a>
            </li>
            <li>
                <a class="block w-[75px] h-[75px]" @click="onClickDesiredPiece(Math.sign(value) === 1 ? 4 : -4)">
                    <img :src="imgSrc.get(Math.sign(value) === 1 ? 4 : -4)" alt="">
                </a>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
.piece-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    &.dragged {
        background: rgba(20, 85, 30, 0.5);
        z-index: 1000;
    }

    &.check {
        background: radial-gradient(ellipse at center, rgb(255, 0, 0) 0%, rgb(231, 0, 0) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%);
    }
}

.piece {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;



    &.ghost {
        pointer-events: none;
        opacity: 0.6;
        z-index: 10;
    }
}
</style>