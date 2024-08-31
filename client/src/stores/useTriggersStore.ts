import { defineStore } from 'pinia'
import axios from 'axios'
import type { Trigger } from '../types/rule'

export const useTriggersStore = defineStore('triggers', {
  state: () => ({
    triggers: [] as Trigger[],
  }),
  actions: {
    async fetchTriggers () {
      try {
        const response = await axios.get<{
            status: string
            results: number
            data: Trigger[]
          }>('http://localhost:8000/api/trigger')

        if (response.data && response.data.data) {
          this.triggers = response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching trigger:', error)
        throw new Error('Error fetching trigger')
      }
    },
  },
})
