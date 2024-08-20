import mongoose from "mongoose";

const ConditionSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
    required: true,
    enum: [
      "equals",
      "greater_than",
      "less_than",
      "not_equals",
      "greater_or_equal",
      "less_or_equal",
    ],
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const ActionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  algorithm: {
    type: String,
  },
  key_size: {
    type: Number,
  },
});

const RoleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  conditions: [ConditionSchema],
  actions: [ActionSchema],
  priority: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Role", RoleSchema);

// {
//     "id": "rule_001",
//     "name": "High-Security Data Transfer",
//     "description": "Apply PQC and QKD for sensitive data transfers",
//     "conditions": [
//       {
//         "field": "data_classification",
//         "operator": "equals",
//         "value": "top_secret"
//       },
//       {
//         "field": "transfer_size",
//         "operator": "greater_than",
//         "value": 1000000
//       }
//     ],
//     "actions": [
//       {
//         "type": "apply_pqc",
//         "algorithm": "CRYSTALS-Kyber"
//       },
//       {
//         "type": "initiate_qkd",
//         "key_size": 256
//       }
//     ],
//     "priority": 1,
//     "enabled": true
//   }
