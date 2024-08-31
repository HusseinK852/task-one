import { defineStore } from 'pinia'
import axios from 'axios'
import type { Condition } from '../types/rule'

export const useConditionsStore = defineStore('conditions', {
  state: () => ({
    conditions: [] as Condition[],
  }),
  actions: {
    async fetchConditions () {
      try {
        const response = await axios.get<{
            status: string
            results: number
            data: Condition[]
          }>('http://localhost:8000/api/condition')

        if (response.data && response.data.data) {
          this.conditions = response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching conditions:', error)
        throw new Error('Error fetching conditions')
      }
    },
  },
})
