<script setup>
import { onMounted, useTemplateRef, ref, onUpdated } from 'vue';

const { value, rowIndex, colIndex } = defineProps({
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
    }
});
const emit = defineEmits(['pick', 'put']);

const piece = useTemplateRef('piece');
const pieceWrapper = useTemplateRef('piece-wrapper');
let ghost = null;
let isDragged = ref(false);
let imgSrc = value < 0 ? '/images/bishop-black.png' : '/images/bishop-white.png';

onMounted(() => {
    console.log('Mounted');

});

onUpdated(() => {
    console.log('Updated');

});

function mouseDown(e) {
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
</script>

<template>
    <div class="piece-wrapper" :class="{ dragged: isDragged }" ref="piece-wrapper">
        <div ref="piece" class="piece" @mousedown="mouseDown" @mouseup="test">
            <img :src="imgSrc" alt="black bishop" draggable="false" />
        </div>
        <div v-if="isDragged" class="piece ghost" :style="ghostStyle">
            <img :src="imgSrc" draggable="false" />
        </div>
    </div>
</template>

<style lang="scss">
.piece-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    &.dragged {
        background: rgba(20, 85, 30, 0.5);
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