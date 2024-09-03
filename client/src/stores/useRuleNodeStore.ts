import { defineStore } from 'pinia'
import axios from 'axios'
import type { RuleNode } from '../types/rule'

export const useRuleNodeStore = defineStore('ruleNodes', {
  state: () => ({
    ruleNodes: [] as RuleNode[],
  }),
  actions: {
    async fetchRuleNodes () {
      try {
        const response = await axios.get<{
          data: RuleNode[];
        }>('http://localhost:8000/api/ruleNode')
        this.ruleNodes = response.data.data
      } catch (error) {
        console.error('Error fetching rule nodes:', error)
      }
    },
  },
})
