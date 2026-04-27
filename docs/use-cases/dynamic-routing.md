# Use Case: Dynamic Workflow Routing

`neuron-js` can be used to route tasks or data through a complex system based on dynamic criteria.

## Scenario: Customer Support Ticket Routing
A company wants to route incoming support tickets to the appropriate department based on keywords, customer tier, and current agent availability.

## The Workflow
1.  **Ingestion**: A new ticket arrives.
2.  **Context**: The `ExecutionContext` is loaded with ticket metadata (subject, body, customer info).
3.  **Routing Rules**:

```json
{
  "rules": [
    {
      "id": "BillingEscalation",
      "conditions": [
        { "type": "ContainsKeywords", "params": { "words": ["invoice", "charge", "refund"] } }
      ],
      "actions": [
        { "type": "AssignToDepartment", "params": { "dept": "Billing" } },
        { "type": "SetPriority", "params": { "level": "High" } }
      ]
    },
    {
      "id": "TechnicalTier3",
      "conditions": [
        { "type": "CustomerTier", "params": { "is": "Enterprise" } },
        { "type": "Category", "params": { "is": "Technical" } }
      ],
      "actions": [
        { "type": "AssignToAgent", "params": { "agentId": "senior-on-call" } }
      ]
    }
  ]
}
```

## Why use neuron-js for this?
- **Hot-swappable Routing**: When a new department is created or agent shifts change, the routing rules can be updated instantly via a central control panel.
- **Explainability**: By logging the rule execution, a manager can see *why* a ticket was routed to a specific agent.
- **Complex Logic**: Native support for AND/OR and inverted conditions allows for much more sophisticated routing than simple `if/else` chains.
- **Pipelining**: A ticket can first be "Tagged" by one rule, and then "Routed" by a subsequent rule that looks for that tag.
