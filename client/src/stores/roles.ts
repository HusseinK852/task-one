import { defineStore } from "pinia";
import axios from "axios";
import type { RoleT, RolesStateT } from "../types/roles";

export const useRolesStore = defineStore("roles", {
  state: (): RolesStateT => ({
    roles: [],
  }),
  actions: {
    async fetchRoles() {
      try {
        const response = await axios.get<{
          status: string;
          results: number;
          data: RoleT[];
        }>("http://localhost:8000/api/rules");
        this.roles = response.data.data;
        // console.log("hi");
      } catch (error) {
        console.error("Error fetching roles:", error);
        throw new Error("Error fetching roles");
      }
    },
    async editRole(role: RoleT) {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/rules/${role.id}`,
          role
        );
        this.fetchRoles();
        return response.data.data;
      } catch (error) {
        console.error("Error editing role:", error);
        throw new Error("Error editing role");
      }
    },
  },
});
