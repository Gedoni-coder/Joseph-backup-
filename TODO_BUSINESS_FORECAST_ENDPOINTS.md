# Business Forecast Server Endpoints Implementation TODO

## Completed Steps
- [ ] 

## Pending Steps (from approved plan)
1. **Read current api/models.py** to confirm exact current fields/imports for safe edits.
2. **Update api/models.py**: Add missing fields:
   - CashFlowForecast: cumulative_cash (DecimalField), working_capital (DecimalField)
   - CostStructure: type (CharField choices=['fixed','
