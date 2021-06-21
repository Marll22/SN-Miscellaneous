// Fix script to calculate planned cost, actual cost, and forecast in Company Currency
var dxcCurrUtils = new DxcCurrencyUtils();
var costPlanGr = new GlideRecord("cost_plan");

var qc = costPlanGr.addQuery("task.sys_class_name", "pm_project");
qc.addOrCondition("task.sys_class_name", "dmn_demand");

costPlanGr.addQuery("end_fiscal_period.fiscal_end_date_time", ">=", gs.beginningOfNextYear());
costPlanGr.addQuery("u_unallocated_expenses", false);
costPlanGr.addNotNullQuery("u_cost_center");
// TODO: exclude Sustainability projects
// costPlanGr.addQuery("task.ref_planned_task.u_process_category", "!=", "sustainability");

/* REMOVE THIS LINE FOR PRODUCTION */
costPlanGr.setLimit(10);
/* ############################### */

costPlanGr.query();

while (costPlanGr.next()) {
  // Populate company from Cost Center
  var companyGr = costPlanGr.u_cost_center.u_company.getRefRecord();
  if (companyGr.isValidRecord()) {
    costPlanGr.setValue("u_company", companyGr.getUniqueValue());
  }

  // Company has currency
  if (!companyGr.u_currency.nil()) {
    // Retrieve the breakdowns
    var breakdownGr = new GlideRecord("cost_plan_breakdown");
    breakdownGr.addQuery("cost_plan", costPlanGr.getUniqueValue());
    breakdownGr.query();

    while (breakdownGr.next()) {
      var enteredCurr = breakdownGr.getValue("entered_currency");
      var companyCurr = companyGr.getValue("u_currency");

      // Planned
      if (companyCurr === "CHF") {
        breakdownGr.setValue("u_cost_in_company_currency", breakdownGr.getValue("cost_default_currency"));
      } else if (companyCurr === enteredCurr) {
          breakdownGr.setValue("u_cost_in_company_currency", breakdownGr.getValue("cost_local_currency"));
      } else {
          var calculatedCost = dxcCurrUtils.calculateInCompanyCurrByFP(breakdownGr.getValue("cost_default_currency"), breakdownGr.getValue("fiscal_period"), companyCurr);
          breakdownGr.setValue("u_cost_in_company_currency", calculatedCost)
      }

      // Actual
      if (!breakdownGr.actual.nil() && breakdownGr.getValue("actual") > 0) {
        var calculatedActual = dxcCurrUtils.calculateInCompanyCurrByFP(breakdownGr.getValue("actual"), breakdownGr.getValue("fiscal_period"), companyCurr);
        breakdownGr.setValue("u_company_currency_actual", calculatedActual);
      }

      breakdownGr.update();
    }
    
  // Forecast
  gs.eventQueue('dxc.ppm.cost_plan_update_forecast', costPlanGr, "");
  }
}