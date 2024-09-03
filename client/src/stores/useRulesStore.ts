import { defineStore } from 'pinia'
import axios from 'axios'
import type { Rule } from '../types/rule'

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [] as Rule[],
  }),
  actions: {
    async fetchRules () {
      try {
        const response = await axios.get<{
          status: string
          results: number
          data: Rule[]
        }>('http://localhost:8000/api/rules')

        if (response.data && response.data.data) {
          this.rules = response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching rules:', error)
        throw new Error('Error fetching rules')
      }
    },
    async toggleRule (ruleId: string, enabled: boolean) {
      try {
        const response = await axios.put<Rule>(`http://localhost:8000/api/rules/${ruleId}`, { enabled })
        if (response.data) {
          const ruleIndex = this.rules.findIndex(rule => rule._id === ruleId)
          if (ruleIndex !== -1) {
            this.rules[ruleIndex].enabled = enabled
          }
          return response.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error(`Error ${enabled ? 'enabling' : 'disabling'} rule:`, error)
        throw new Error(`Error ${enabled ? 'enabling' : 'disabling'} rule`)
      }
    },
    async fetchRule (ruleId: string) {
      try {
        const response = await axios.get<Rule>(`http://localhost:8000/api/rules/${ruleId}`)
        if (response.data) {
          return response.data.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error fetching rule:', error)
        throw new Error('Error fetching rule')
      }
    },
    async createRule (newRule: Rule) {
      try {
        const response = await axios.post<Rule>('http://localhost:8000/api/rules', newRule)
        if (response.data) {
          return response.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error creating rule:', error)
        throw new Error('Error creating rule')
      }
    },
    async updateRule (ruleId: string, updatedRule: Rule) {
      try {
        const response = await axios.put<Rule>(`http://localhost:8000/api/rules/${ruleId}`, updatedRule)
        if (response.data) {
          return response.data
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Error editing rule:', error)
        throw new Error('Error editing rule')
      }
    },
    async deleteRule (ruleId: string) {
      try {
        await axios.delete(`http://localhost:8000/api/rules/${ruleId}`)
      } catch (error) {
        console.error('Error deleting rule:', error)
        throw new Error('Error deleting rule')
      }
    },
    async validateRule (rule: Rule) {
      try {
        const response = await axios.post('http://localhost:8000/api/rules/validate', rule)
        return response.data
      } catch (error) {
        console.error('Error validating rule:', error)
        throw new Error('Error validating rule')
      }
    },
  },
})
