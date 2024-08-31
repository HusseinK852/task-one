<template>
  <v-navigation-drawer app permanent width="480">
    <v-row style="min-height: 100vh;">
      <v-col class="name-list" cols="4">
        <v-list dense>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            @click="selectMenu(item.title)"
          >
            <v-list-item-title :class="{'active-item': selectedMenu === item.title}">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="8" style="margin-left: 33%;">
        <v-card class="container-items" flat>
          <v-card-title>{{ selectedMenu }}</v-card-title>
          <v-card-subtitle>
            <draggable
              v-model="getBlocksForSelectedMenu"
              group="blocks"
              @end="drag=false"
              @start="drag=true"
            >
              <div
                v-for="(block, idx) in getBlocksForSelectedMenu"
                :key="idx"
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
  import { useTriggersStore } from '../stores/useTriggersStore'
  import { useConditionsStore } from '../stores/useConditionsStore'
  import { useActionsStore } from '../stores/useActionsStore'
  import { useOnFailureStore } from '../stores/useOnFailureStore'
  import { useConfigsStore } from '../stores/useConfigStore'

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    setup () {
      const triggersStore = useTriggersStore()
      const conditionsStore = useConditionsStore()
      const actionsStore = useActionsStore()
      const onFailureStore = useOnFailureStore()
      const configsStore = useConfigsStore()

      const selectedMenu = ref('triggers')
      const menuItems = [
        { title: 'triggers' },
        { title: 'conditions' },
        { title: 'actions' },
        { title: 'onFailure' },
        { title: 'config' },
      ]

      onMounted(async () => {
        await triggersStore.fetchTriggers()
        await conditionsStore.fetchConditions()
        await actionsStore.fetchActions()
        await onFailureStore.fetchOnFailure()
        await configsStore.fetchConfigs()
      })

      const blocks = computed(() => ({
        triggers: triggersStore.triggers,
        conditions: conditionsStore.conditions,
        actions: actionsStore.actions,
        onFailure: onFailureStore.onFailures,
        config: configsStore.configs,
      }))

      const selectMenu = menuTitle => {
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
