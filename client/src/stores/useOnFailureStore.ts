import { defineStore } from 'pinia'
import axios from 'axios'
import type { Action } from '../types/rule'

export const useOnFailureStore = defineStore('onFailure', {
  state: () => ({
    onFailures: [] as Action[],
  }),
  actions: {
    async fetchOnFailure () {
      try {
        const response = await axios.get<{
            status: string
            results: number
            data: Action[]
          }>('http://localhost:8000/api/onFailure')

        if (response.data && response.data.data) {
          this.onFailures = response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching onFailure:', error)
        throw new Error('Error fetching onFailure')
      }
    },
  },
})
