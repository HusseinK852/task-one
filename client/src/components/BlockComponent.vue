<template>
  <div
    class="block"
    :data-block-id="block._id"
    :style="style"
    @mousedown.stop="startDrag"
  >
    <div
      class="left-connector"
      @mousedown.stop="connectorMouseDown('left')"
      @mouseup.stop="connectorMouseUp('left')"
    />
    {{ block.name }}
    <div
      class="right-connector"
      @mousedown.stop="connectorMouseDown('right')"
      @mouseup.stop="connectorMouseUp('right')"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import type { RuleNode } from '../types/rule'

  export default defineComponent({
    props: {
      block: { type: Object as () => RuleNode, required: true },
      style: { type: Object as () => Record<string, string>, required: true },
    },
    emits: ['startDrag', 'connectorClick'],
    setup (props, { emit }) {
      const startDrag = () => {
        emit('startDrag', props.block._id)
      }

      const connectorMouseDown = (side: 'left' | 'right') => {
        emit('connectorClick', props.block._id, side)
      }

      const connectorMouseUp = (side: 'left' | 'right') => {
        emit('connectorClick', props.block._id, side)
      }

      return { startDrag, connectorMouseDown, connectorMouseUp }
    },
  })
</script>

<style scoped>
.block {
  background-color: red;
  padding: 20px 10px;
  border-radius: 5px;
  color: #000;
  cursor: move;
  display: flex;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  white-space: normal;
  position: absolute;
  z-index: 10;
}
.left-connector,
.right-connector {
  position: absolute;
  width: 14px;
  height: 14px;
  background: gray;
  border-radius: 50%;
  z-index: 11;
  cursor: pointer;
}
.left-connector {
  left: -7px;
  top: 50%;
  transform: translateY(-50%);
}
.right-connector {
  right: -7px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
