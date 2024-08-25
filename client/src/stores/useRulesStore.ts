import { defineStore } from 'pinia'
import axios from 'axios'
import type { ActionT, ConditionT, RulesStateT, RuleT } from '../types/rules'

export const useRulesStore = defineStore('rules', {
  state: (): RulesStateT => ({
    rules: [],
  }),
  actions: {
    async fetchRules () {
      try {
        const response = await axios.get<{
          status: string;
          results: number;
          data: RuleT[];
        }>('http://localhost:8000/api/rules')
        this.rules = response.data.data
        // console.log(this.rules)
      } catch (error) {
        console.error('Error fetching rules:', error)
        throw new Error('Error fetching rules')
      }
    },
    async fetchRule (ruleId: string) {
      try {
        const response = await axios.get<{
          status: string;
          data: RuleT;
        }>(`http://localhost:8000/api/rules/${ruleId}`)
        // console.log(response.data)
        return response.data.data
      } catch (error) {
        console.error('Error fetching rule:', error)
        throw new Error('Error fetching rule')
      }
    },
    async editRule (rule: RuleT) {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/rules/${rule.id}`,
          rule
        )
        this.fetchRules()
        return response.data.data
      } catch (error) {
        console.error('Error editing rule:', error)
        throw new Error('Error editing rule')
      }
    },
    async createRule (rule: RuleT) {
      try {
        const response = await axios.post('http://localhost:8000/api/rules', rule)
        this.fetchRules()
        return response.data.data
      } catch (error) {
        console.error('Error creating rule:', error)
        throw new Error('Error creating rule')
      }
    },
    async deleteRule (ruleId: string) {
      try {
        await axios.delete(`http://localhost:8000/api/rules/${ruleId}`)
        this.fetchRules()
      } catch (error) {
        console.error('Error deleting rule:', error)
        throw new Error('Error deleting rule')
      }
    },
    async validateRule (rule: RuleT) {
      try {
        const response = await axios.post('http://localhost:8000/api/rules/validate', rule)
        return response.data.status
      } catch (error) {
        console.error('Error testing rule:', error)
        throw new Error('Error testing rule')
      }
    },
    async addConditionToRule (ruleId: string, condition: ConditionT) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/rules/${ruleId}/add-condition`,
          condition
        )
        this.fetchRule(ruleId)
        return response.data.data
      } catch (error) {
        console.error('Error adding condition to rule:', error)
        throw new Error('Error adding condition to rule')
      }
    },
    async addActionToRule (ruleId: string, action: ActionT) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/rules/${ruleId}/add-action`,
          action
        )
        this.fetchRule(ruleId)
        return response.data.data
      } catch (error) {
        console.error('Error adding action to rule:', error)
        throw new Error('Error adding action to rule')
      }
    },
  },
})
