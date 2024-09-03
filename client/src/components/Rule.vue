<template>
  <div>
    <v-container>
      <List class="side-bar" />
      <draggable
        v-model="droppedBlocks"
        class="block-dropzone"
        group="blocks"
        @change="updateLinesOnChange"
        @end="handleDragEnd"
      >
        <template v-for="block in droppedBlocks" :key="block._id">
          <BlockComponent
            :block="block"
            :style="blockStyle(block)"
            @connector-click="handleConnectorClick"
            @start-drag="startDrag"
          />
        </template>
      </draggable>
      <DeleteZone v-if="isDragging" />
      <json-preview :json-preview="jsonPreview" />
      <RuleOptions class="rule-options" :rule="jsonPreview" />
    </v-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, ref, watch } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'
  import { useRoute } from 'vue-router'
  import { useRulesStore } from '../stores/useRulesStore'
  import type { RuleNode } from '../types/rule'
  import type { JsonPreview } from '../types/jsonPreview'
  import LeaderLine from 'leader-line-new'

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    setup () {
      const route = useRoute<{ ruleId: string }>()
      const store = useRulesStore()

      const droppedBlocks = ref<RuleNode[]>([])
      const isDragging = ref(false)
      const currentBlockId = ref<string | null>(null)
      const blockPositions = ref<Map<string, { top: number; left: number }>>(new Map())
      const startConnector = ref<{ blockId: string; side: 'left' | 'right' } | null>(null)
      const endConnector = ref<{ blockId: string; side: 'left' | 'right' } | null>(null)
      const jsonPreview = ref<JsonPreview>({
        name: null,
        description: 'test',
        nodes: [],
        connections: [],
      })

      const lineReferences = ref<Map<string, LeaderLine[]>>(new Map())

      watch(blockPositions, () => {
        updateAllLines()
      }, { deep: true })

      const handleDragEnd = (event: any) => {
        if (!event.item || !currentBlockId.value) return

        const deleteZoneRect = document.querySelector('.delete-zone')?.getBoundingClientRect()
        const isInDeleteZone = deleteZoneRect && event.originalEvent.clientX > deleteZoneRect.left &&
          event.originalEvent.clientX < deleteZoneRect.right &&
          event.originalEvent.clientY > deleteZoneRect.top &&
          event.originalEvent.clientY < deleteZoneRect.bottom

        if (isInDeleteZone) {
          removeBlockAndConnections(currentBlockId.value)
        } else {
          updateBlockPosition(event)
        }

        resetDragState()
      }

      const blockStyle = (block: RuleNode) => {
        const position = blockPositions.value.get(block._id || '')
        return {
          top: `${block.additionalInfo.layoutY || position?.top || 0}px`,
          left: `${block.additionalInfo.layoutX || position?.left || 0}px`,
          position: 'absolute',
        }
      }

      const startDrag = (blockId: string) => {
        isDragging.value = true
        currentBlockId.value = blockId
      }

      const handleConnectorClick = (blockId: string, side: 'left' | 'right') => {
        if (!startConnector.value) {
          if (side === 'right') {
            startConnector.value = { blockId, side }
          } else {
            console.warn('Start connector must be on the right side.')
          }
        } else {
          if (side === 'left') {
            endConnector.value = { blockId, side }
            console.log(endConnector.value.side)
            if (startConnector.value.side === 'right' && endConnector.value.side === 'left') {
              addLineConnection()
            } else {
              console.warn('Connections must go from right to left only.')
            }
          } else {
            console.warn('End connector must be on the left side.')
          }

          startConnector.value = null
          endConnector.value = null
        }
      }

      const updateBlockPosition = async (event: any) => {
        const dropZoneRect = event.from.getBoundingClientRect()
        const newBlock = event.item as HTMLElement
        const top = event.originalEvent.clientY - dropZoneRect.top - newBlock.offsetHeight / 2
        const left = event.originalEvent.clientX - dropZoneRect.left - newBlock.offsetWidth / 2

        const currentBlock = droppedBlocks.value.find(block => block._id === currentBlockId.value)
        if (currentBlock) {
          currentBlock.additionalInfo.layoutY = top
          currentBlock.additionalInfo.layoutX = left
        }

        blockPositions.value.set(currentBlockId.value!, { top, left })

        if (currentBlock) {
          addBlockToJsonPreview(currentBlock)
        }

        await nextTick()

        updateAllLines()
      }

      const addLineConnection = async () => {
        if (!startConnector.value || !endConnector.value) {
          console.warn('Both connectors need to be selected to create a line.')
          return
        }

        const fromBlockId = startConnector.value.blockId
        const toBlockId = endConnector.value.blockId

        if (fromBlockId === toBlockId) {
          console.warn('Cannot connect the same block to itself.')
          return
        }

        const fromBlockIndex = droppedBlocks.value.findIndex(block => block._id === fromBlockId)
        const toBlockIndex = droppedBlocks.value.findIndex(block => block._id === toBlockId)

        if (fromBlockIndex === -1 || toBlockIndex === -1) {
          console.warn('One or both blocks not found.')
          return
        }

        // تحقق من عدم وجود وصلة مشابهة بالفعل
        const existingConnection = jsonPreview.value.connections.find(connection =>
          connection.fromIndex === fromBlockIndex &&
          connection.toIndex === toBlockIndex &&
          connection.type === 'connection'
        )

        if (existingConnection) {
          console.warn('Connection already exists.')
          return
        }

        jsonPreview.value.connections.push({
          fromIndex: fromBlockIndex,
          toIndex: toBlockIndex,
          type: 'connection',
          _id: crypto.randomUUID(), // إضافة معرّف فريد لكل وصلة
        })

        const fromBlockElement = document.querySelector(`[data-block-id="${fromBlockId}"] .right-connector`) as HTMLElement
        const toBlockElement = document.querySelector(`[data-block-id="${toBlockId}"] .left-connector`) as HTMLElement

        if (fromBlockElement && toBlockElement) {
          const line = new LeaderLine(
            fromBlockElement,
            toBlockElement,
            {
              startPlug: 'disc',
              endPlug: 'arrow',
              color: 'gray',
              startSocket: 'right',
              endSocket: 'left',
            }
          )

          if (!lineReferences.value.has(fromBlockId)) {
            lineReferences.value.set(fromBlockId, [])
          }
          lineReferences.value.get(fromBlockId)!.push(line)

          if (!lineReferences.value.has(toBlockId)) {
            lineReferences.value.set(toBlockId, [])
          }
          lineReferences.value.get(toBlockId)!.push(line)
        } else {
          console.warn('Could not find connectors for the blocks.')
        }
      }

      const removeBlockAndConnections = (blockId: string) => {
        // Remove the block from the preview and block list
        jsonPreview.value.nodes = jsonPreview.value.nodes.filter(node => node._id !== blockId)
        droppedBlocks.value = droppedBlocks.value.filter(block => block._id !== blockId)

        // Remove connections related to this block
        jsonPreview.value.connections = jsonPreview.value.connections.filter(
          connection => {
            const fromBlock = droppedBlocks.value[connection.fromIndex]?._id
            const toBlock = droppedBlocks.value[connection.toIndex]?._id

            // حافظ على الوصلة إذا كانت البلوك المقابل لم يحذف
            return fromBlock !== blockId && toBlock !== blockId
          }
        )

        // Remove lines associated with the block
        if (lineReferences.value.has(blockId)) {
          const lines = lineReferences.value.get(blockId)
          lines?.forEach(line => {
            try {
              if (line) {
                line.remove()
              }
            } catch (error) {
              console.warn(`Failed to remove line for blockId: ${blockId}`, error)
            }
          })
          lineReferences.value.delete(blockId)
        }

        blockPositions.value.delete(blockId)
      }

      const resetDragState = () => {
        currentBlockId.value = null
        isDragging.value = false
      }

      const addBlockToJsonPreview = (block: RuleNode) => {
        if (!jsonPreview.value.nodes.some(node => node._id === block._id)) {
          jsonPreview.value.nodes.push(block)
        }
      }

      const initializeData = async () => {
        if (route.params.ruleId === 'add') {
          jsonPreview.value = { name: null, description: 'null', nodes: [], connections: [] }
        } else {
          const ruleData = await store.fetchRule(route.params.ruleId)
          if (ruleData) {
            jsonPreview.value = { name: ruleData.name, description: ruleData.description, nodes: ruleData.nodes, connections: ruleData.connections }
            droppedBlocks.value = [...ruleData.nodes]

            // Update block positions
            ruleData.nodes.forEach(node => {
              blockPositions.value.set(node._id, { top: node.additionalInfo.layoutY, left: node.additionalInfo.layoutX })
            })

            // Add lines between blocks
            await nextTick()
            ruleData.connections.forEach(connection => {
              const fromBlockId = droppedBlocks.value[connection.fromIndex]?._id
              const toBlockId = droppedBlocks.value[connection.toIndex]?._id

              if (toBlockId) {
                startConnector.value = { blockId: fromBlockId, side: 'right' }
                endConnector.value = { blockId: toBlockId, side: 'left' }
                addLineConnection()
              }
            })
          }
        }
      }

      const updateAllLines = () => {
        lineReferences.value.forEach((lines, blockId) => {
          if (lines) {
            lines.forEach(line => {
              if (line) {
                try {
                  line.position()
                } catch (error) {
                  console.warn(`Failed to update line for blockId: ${blockId}`, error)
                }
              }
            })
          }
        })
      }

      const updateLinesOnChange = () => {
        updateAllLines()
      }

      initializeData()

      return {
        droppedBlocks,
        handleDragEnd,
        blockStyle,
        startDrag,
        handleConnectorClick,
        isDragging,
        jsonPreview,
        updateLinesOnChange,
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
.rule-options {
  position: fixed;
  top: 86%;
  left: 86%;
  padding: 10px;
  border-radius: 5px;
  z-index: 99;
}
</style>
