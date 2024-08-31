import { defineStore } from 'pinia'
import axios from 'axios'
import type { Config } from '../types/rule'

export const useConfigsStore = defineStore('configs', {
  state: () => ({
    configs: [] as Config[],
  }),
  actions: {
    async fetchConfigs () {
      try {
        const response = await axios.get<{
            status: string
            results: number
            data: Config[]
          }>('http://localhost:8000/api/config')

        if (response.data && response.data.data) {
          console.log(response.data.data)
          this.configs = response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching configs:', error)
        throw new Error('Error fetching configs')
      }
    },
  },
})
