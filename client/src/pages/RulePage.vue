<template>
  <v-container>
    <List class="side-bar" />
    <draggable
      v-model="droppedBlocks"
      class="block-dropzone"
      group="blocks"
      @end="handleDragEnd"
    >
      <template v-for="block in droppedBlocks">
        <div
          v-if="block"
          :key="block._id"
          class="block"
          :style="blockStyle(block._id)"
          @mousedown.stop="startDrag(block._id)"
        >
          <div
            class="left-connector"
            @mousedown.stop="handleConnectorClick(block._id, 'left')"
          />
          {{ block.name }}
          <div
            class="right-connector"
            @mousedown.stop="handleConnectorClick(block._id, 'right')"
          />
        </div>
      </template>
    </draggable>
    <svg class="lines">
      <line
        v-for="(line, index) in lines"
        :key="index"
        stroke="black"
        stroke-width="2"
        :x1="line.x1"
        :x2="line.x2"
        :y1="line.y1"
        :y2="line.y2"
      />
    </svg>
    <div v-if="isDragging" class="delete-zone">
      Drop here to delete
    </div>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'

  interface Block {
    _id: string;
    name: string;
    description: string;
    eventType: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface BlockPosition {
    top: number;
    left: number;
  }

  interface Line {
    fromBlockId: string;
    toBlockId: string;
    side: 'left' | 'right';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    setup () {
      const droppedBlocks = ref<Block[]>([])
      const isDragging = ref(false)
      const currentBlockId = ref<string | null>(null)
      const blockPositions = ref<Map<string, BlockPosition>>(new Map())
      const lines = ref<Line[]>([])
      const selectedConnector = ref<{ blockId: string; side: 'left' | 'right' } | null>(null)

      const handleDragEnd = (event: any) => {
        if (!event.item || !currentBlockId.value) return

        const deleteZone = document.querySelector('.delete-zone')
        const deleteZoneRect = deleteZone?.getBoundingClientRect()

        if (
          deleteZoneRect &&
          event.originalEvent.clientY > deleteZoneRect.top &&
          event.originalEvent.clientY < deleteZoneRect.bottom &&
          event.originalEvent.clientX > deleteZoneRect.left &&
          event.originalEvent.clientX < deleteZoneRect.right
        ) {
          droppedBlocks.value = droppedBlocks.value.filter(
            block => block._id !== currentBlockId.value
          )
          blockPositions.value.delete(currentBlockId.value)
          lines.value = lines.value.filter(
            line => line.fromBlockId !== currentBlockId.value && line.toBlockId !== currentBlockId.value
          )
        } else {
          const dropZoneRect = event.from.getBoundingClientRect()
          const newBlock = event.item as HTMLElement
          const top = event.originalEvent.clientY - dropZoneRect.top - newBlock.offsetHeight / 2
          const left = event.originalEvent.clientX - dropZoneRect.left - newBlock.offsetWidth / 2

          blockPositions.value.set(currentBlockId.value, { top, left })
        }

        // تحديث إحداثيات الخطوط بعد تحريك الكتل
        updateLinesPositions()

        currentBlockId.value = null
        isDragging.value = false
      }

      const blockStyle = (blockId: string) => {
        const position = blockPositions.value.get(blockId)
        return {
          top: `${position?.top || 0}px`,
          left: `${position?.left || 0}px`,
          position: 'absolute',
        }
      }

      const startDrag = (blockId: string) => {
        isDragging.value = true
        currentBlockId.value = blockId
      }

      const handleConnectorClick = (blockId: string, side: 'left' | 'right') => {
        if (selectedConnector.value) {
          const fromBlockId = selectedConnector.value.blockId
          const toBlockId = blockId

          const fromPosition = blockPositions.value.get(fromBlockId)
          const toPosition = blockPositions.value.get(toBlockId)
          const dropZone = document.querySelector('.block-dropzone')
          const dropZoneRect = dropZone?.getBoundingClientRect()

          if (fromPosition && toPosition && dropZoneRect) {
            const x1 = fromPosition.left + (selectedConnector.value.side === 'left' ? 0 : 100)
            const y1 = fromPosition.top + 29
            const x2 = toPosition.left + (side === 'left' ? 0 : 100)
            const y2 = toPosition.top + 29

            lines.value.push({
              fromBlockId,
              toBlockId,
              side,
              x1: x1 + dropZoneRect.left,
              y1: y1 + dropZoneRect.top,
              x2: x2 + dropZoneRect.left,
              y2: y2 + dropZoneRect.top,
            })
          }

          selectedConnector.value = null
        } else {
          selectedConnector.value = { blockId, side }
        }
      }

      const updateLinesPositions = () => {
        const dropZoneRect = document.querySelector('.block-dropzone')?.getBoundingClientRect()

        if (!dropZoneRect) return

        lines.value = lines.value.map(line => {
          const fromPosition = blockPositions.value.get(line.fromBlockId)
          const toPosition = blockPositions.value.get(line.toBlockId)

          if (fromPosition && toPosition) {
            const x1 = fromPosition.left + (line.side === 'left' ? 0 : 100)
            const y1 = fromPosition.top + 29
            const x2 = toPosition.left + (line.side === 'left' ? 0 : 100)
            const y2 = toPosition.top + 29

            return {
              ...line,
              x1: x1 + dropZoneRect.left,
              y1: y1 + dropZoneRect.top,
              x2: x2 + dropZoneRect.left,
              y2: y2 + dropZoneRect.top,
            }
          }

          return line
        })
      }

      watch(droppedBlocks, updateLinesPositions, { deep: true })

      return {
        droppedBlocks,
        handleDragEnd,
        blockStyle,
        startDrag,
        handleConnectorClick,
        isDragging,
        lines,
      }
    },
  })
</script>

<style scoped>
.block-dropzone {
  border: 2px dashed #ccc;
  height: 80vh;
  position: relative;
}

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

.side-bar {
  position: fixed;
}

.delete-zone {
  border: 2px solid red;
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
  height: 10vh;
  position: fixed;
  bottom: 50px;
  width: 66.5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
