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
          :data-block-id="block._id"
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
    <json-preview :json-preview="jsonPreview" />
  </v-container>
</template>

<script lang="ts">
  import { CSSProperties, defineComponent, ref, watch } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'
  import { useRoute } from 'vue-router'
  import { useRulesStore } from '../stores/useRulesStore'
  import type { Block, BlockPosition } from '../types/block'
  import type { Line } from '../types/line'
  import type { JsonPreview } from '../types/jsonPreview'

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    setup () {
      const route = useRoute()
      const store = useRulesStore()

      const droppedBlocks = ref<Block[]>([])
      const isDragging = ref(false)
      const currentBlockId = ref<string | null>(null)
      const blockPositions = ref<Map<string, BlockPosition>>(new Map())
      const lines = ref<Line[]>([])
      const selectedConnector = ref<{ blockId: string; side: 'left' | 'right' } | null>(null)

      const jsonPreview = ref<JsonPreview>({
        name: null,
        triggers: [],
        conditions: [],
        actions: [],
        onFailure: [],
        config: [],
      })

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
          const blockToDelete = droppedBlocks.value.find(
            block => block._id === currentBlockId.value
          )

          if (blockToDelete) {
            removeBlockFromJsonPreview(blockToDelete)
          }

          droppedBlocks.value = droppedBlocks.value.filter(
            block => block._id !== currentBlockId.value
          )
          blockPositions.value.delete(currentBlockId.value)
          lines.value = lines.value.filter(
            line =>
              line.fromBlockId !== currentBlockId.value &&
              line.toBlockId !== currentBlockId.value
          )
        } else {
          const dropZoneRect = event.from.getBoundingClientRect()
          const newBlock = event.item as HTMLElement
          const top =
            event.originalEvent.clientY - dropZoneRect.top - newBlock.offsetHeight / 2
          const left =
            event.originalEvent.clientX - dropZoneRect.left - newBlock.offsetWidth / 2

          blockPositions.value.set(currentBlockId.value, { top, left })

          const addedBlock = droppedBlocks.value.find(
            block => block._id === currentBlockId.value
          )
          if (addedBlock) {
            addBlockToJsonPreview(addedBlock)
          }
        }

        updateLinesPositions()

        currentBlockId.value = null
        isDragging.value = false
      }

      const blockStyle = (blockId: string): CSSProperties => {
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
          const blockElement = document.querySelector(
            `[data-block-id="${fromBlockId}"]`
          ) as HTMLElement

          if (fromPosition && toPosition && dropZoneRect && blockElement) {
            const blockWidth = blockElement.offsetWidth
            const x1 = fromPosition.left + blockWidth
            const y1 = fromPosition.top + blockElement.offsetHeight / 2
            const x2 = toPosition.left
            const y2 = toPosition.top + blockElement.offsetHeight / 2

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
        const dropZoneRect =
          document.querySelector('.block-dropzone')?.getBoundingClientRect()

        if (!dropZoneRect) return

        lines.value = lines.value.map(line => {
          const fromPosition = blockPositions.value.get(line.fromBlockId)
          const toPosition = blockPositions.value.get(line.toBlockId)
          const blockElement = document.querySelector(
            `[data-block-id="${line.fromBlockId}"]`
          ) as HTMLElement

          if (fromPosition && toPosition && blockElement) {
            const blockWidth = blockElement.offsetWidth
            const x1 = fromPosition.left + blockWidth
            const y1 = fromPosition.top + blockElement.offsetHeight / 2
            const x2 = toPosition.left
            const y2 = toPosition.top + blockElement.offsetHeight / 2

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

      const removeBlockFromJsonPreview = (block: Block) => {
        switch (block.type) {
          case 'Trigger':
            jsonPreview.value.triggers = jsonPreview.value.triggers.filter(
              item => item._id !== block._id
            )
            break
          case 'Condition':
            jsonPreview.value.conditions = jsonPreview.value.conditions.filter(
              item => item._id !== block._id
            )
            break
          case 'Action':
            jsonPreview.value.actions = jsonPreview.value.actions.filter(
              item => item._id !== block._id
            )
            break
          case 'OnFailure':
            jsonPreview.value.onFailure = jsonPreview.value.onFailure.filter(
              item => item._id !== block._id
            )
            break
          case 'Config':
            jsonPreview.value.config = jsonPreview.value.config.filter(
              item => item._id !== block._id
            )
            break
          default:
            break
        }
      }

      const addBlockToJsonPreview = (block: Block) => {
        let isBlockAdded = false

        switch (block.type) {
          case 'Trigger':
            isBlockAdded = jsonPreview.value.triggers.some(item => item._id === block._id)
            if (!isBlockAdded) jsonPreview.value.triggers.push(block)
            break
          case 'Condition':
            isBlockAdded = jsonPreview.value.conditions.some(item => item._id === block._id)
            if (!isBlockAdded) jsonPreview.value.conditions.push(block)
            break
          case 'Action':
            isBlockAdded = jsonPreview.value.actions.some(item => item._id === block._id)
            if (!isBlockAdded) jsonPreview.value.actions.push(block)
            break
          case 'OnFailure':
            isBlockAdded = jsonPreview.value.onFailure.some(item => item._id === block._id)
            if (!isBlockAdded) jsonPreview.value.onFailure.push(block)
            break
          case 'Config':
            isBlockAdded = jsonPreview.value.config.some(item => item._id === block._id)
            if (!isBlockAdded) jsonPreview.value.config.push(block)
            break
          default:
            break
        }
      }

      const initializeData = async () => {
        console.log(route.params)
        if (route.params.ruleId === 'add') {
          jsonPreview.value = {
            name: null,
            triggers: [],
            conditions: [],
            actions: [],
            onFailure: [],
            config: [],
          }
        } else {
          const ruleData = await store.fetchRule(route.params.ruleId)
          if (ruleData) {
            jsonPreview.value = {
              name: ruleData.name,
              triggers: ruleData.triggers,
              conditions: ruleData.conditions,
              actions: ruleData.actions,
              onFailure: ruleData.onFailure,
              config: ruleData.config,
            }
            droppedBlocks.value = [
              ...ruleData.triggers,
              ...ruleData.conditions,
              ...ruleData.actions,
              ...ruleData.onFailure,
              ...ruleData.config,
            ]
          }
        }
      }

      initializeData()

      watch(droppedBlocks, updateLinesPositions, { deep: true })

      return {
        droppedBlocks,
        handleDragEnd,
        blockStyle,
        startDrag,
        handleConnectorClick,
        isDragging,
        lines,
        jsonPreview,
      }
    },
  })
</script>

<style scoped>
.block-dropzone {
  border: 2px dashed #ccc;
  height: 85vh;
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

.delete-zone {
  border: 2px solid red;
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
  height: 10vh;
  width: 100%;
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
