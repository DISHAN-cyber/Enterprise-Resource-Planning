from app.models.forecast import CashflowRequest, CashflowProjection, CashflowResponse


def generate_cashflow_forecast(request: CashflowRequest) -> CashflowResponse:
    seasonality = request.seasonality or [1.0] * request.months
    forecast = []
    balance = request.current_balance

    for month in range(1, request.months + 1):
        growth_multiplier = (1 + request.revenue_growth_rate) ** (month - 1)
        revenue = request.monthly_revenue * growth_multiplier * seasonality[(month - 1) % len(seasonality)]
        expense = request.monthly_expense * ((1 + request.expense_growth_rate) ** (month - 1)) * seasonality[(month - 1) % len(seasonality)]
        balance += revenue - expense

        forecast.append(
            CashflowProjection(
                month=month,
                projected_balance=round(balance, 2),
                revenue=round(revenue, 2),
                expense=round(expense, 2),
            )
        )

    if balance < 0:
        recommendation = (
            "Projected cash balance goes negative. Review costs, accelerate receivables, "
            "or add a short-term working capital facility."
        )
    elif balance < request.current_balance * 0.25:
        recommendation = (
            "Cash remains low relative to the starting balance. Monitor spending closely "
            "and preserve liquidity." 
        )
    else:
        recommendation = "Cashflow looks healthy for the selected forecast horizon. Continue monitoring performance."

    return CashflowResponse(forecast=forecast, recommendation=recommendation)
