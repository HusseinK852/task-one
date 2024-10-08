<template>
  <v-navigation-drawer
    app
    permanent
    style="position: fixed; top: 0; left: 0; height: 100vh"
    width="480"
  >
    <v-row style="min-height: 100vh">
      <v-col class="name-list" cols="4">
        <v-list dense>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            @click="selectMenu(item.title)"
          >
            <v-list-item-title
              :class="{ 'active-item': selectedMenu === item.title }"
            >
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="8" style="margin-left: 33%">
        <v-card class="container-items" flat>
          <v-card-title>{{ selectedMenu }}</v-card-title>
          <v-card-subtitle>
            <draggable
              v-model="getBlocksForSelectedMenu"
              group="blocks"
              @end="drag = false"
              @start="drag = true"
            >
              <div
                v-for="block in getBlocksForSelectedMenu"
                :key="block._id"
                class="block"
                draggable="true"
              >
                {{ block.name }}
              </div>
            </draggable>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'
  import { useRuleNodeStore } from '../stores/useRuleNodeStore'
  import type { RuleNode } from '../types/rule'

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    setup () {
      const RuleNodeStore = useRuleNodeStore()

      const selectedMenu = ref('triggers')
      const drag = ref(false)

      const menuItems = [
        { title: 'triggers' },
        { title: 'conditions' },
        { title: 'actions' },
        { title: 'onFailure' },
        { title: 'config' },
      ]

      onMounted(async () => {
        await RuleNodeStore.fetchRuleNodes()
      })

      const blocks = computed(() => {
        const categorizedBlocks: Record<string, RuleNode[]> = {
          triggers: [],
          conditions: [],
          actions: [],
          onFailure: [],
          config: [],
        }

        RuleNodeStore.ruleNodes.forEach((block: RuleNode) => {
          if (block.type === 'trigger') {
            categorizedBlocks.triggers.push(block)
          } else if (block.type === 'condition') {
            categorizedBlocks.conditions.push(block)
          } else if (block.type === 'action') {
            categorizedBlocks.actions.push(block)
          } else if (block.type === 'onFailure') {
            categorizedBlocks.onFailure.push(block)
          } else if (block.type === 'config') {
            categorizedBlocks.config.push(block)
          }
        })

        return categorizedBlocks
      })

      const selectMenu = (menuTitle: string) => {
        selectedMenu.value = menuTitle
      }

      const getBlocksForSelectedMenu = computed(() => {
        return blocks.value[selectedMenu.value] || []
      })

      return {
        selectedMenu,
        menuItems,
        getBlocksForSelectedMenu,
        selectMenu,
        drag,
      }
    },
  })
</script>

<style scoped>
.block-container {
  display: flex;
  flex-direction: column;
}
.active-item {
  color: #ffffff;
}
.name-list {
  background-color: rebeccapurple;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}
.v-list-item-title,
.v-card-title {
  text-align: center;
}
.container-items {
  background: #8a8a8a;
  margin-top: 20px;
}
.block {
  background: #ffffff;
  padding: 20px 10px;
  border-radius: 5px;
  color: #000000;
  display: flex;
  justify-content: center;
  margin: 5px 20px;
  word-wrap: break-word;
  white-space: normal;
  cursor: move;
}
</style>
