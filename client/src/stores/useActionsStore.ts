import { defineStore } from 'pinia'
import axios from 'axios'
import type { Action } from '../types/rule'

export const useActionsStore = defineStore('actions', {
  state: () => ({
    actions: [] as Action[],
  }),
  actions: {
    async fetchActions () {
      try {
        const response = await axios.get<{
            status: string
            results: number
            data: Action[]
          }>('http://localhost:8000/api/action')

        if (response.data && response.data.data) {
          this.actions = response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching actions:', error)
        throw new Error('Error fetching actions')
      }
    },
  },
})
