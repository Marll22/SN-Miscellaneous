/**
* @author alealvar [alealvarez@mail.com]
* @BuildTag glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
* @description
* Fixes users with duplicated records in resource_aggregate_daily and
* resource_aggregate_monthly tables. The script checks whether an user has
* duplicated records in resource_aggregate_monthly table filtering by category
* = "capacity" for a defined period of time.
* In the event of user has any duplicated records for that perior, the script
* deletes the records in both tables and run the OOB script to populate the
* user capacity
* @param {string} users A list of users comma-separated
* @param {boolean} debug Run mode. True only print results, false fix records
* @print In debug mode, prints the users with duplicated capacities
*/
function fixCapacity(users, debug) {
  var startDate = gs.dateGenerate("2020-01-01", "start");
  var endDate = gs.dateGenerate("2025-12-31", "end");
  var arrayUsers = [];
  var logger = "\nSTART";

  var monthGa = new GlideAggregate("resource_aggregate_monthly");

  if (JSUtil.notNil(users) && users != "") {
    monthGa.addQuery("user", "IN", users);
  }

  monthGa.addQuery("category=capacity");
  monthGa.addQuery("month_starts_on", ">=", startDate);
  monthGa.addQuery("month_starts_on", "<=", endDate);

  monthGa.addAggregate("COUNT", "month_starts_on");
  monthGa.addHaving("COUNT", ">", "1");
  monthGa.groupBy("user");
  monthGa.groupBy("month_starts_on");
  
  monthGa.query();

  while (monthGa.next()) {

    if (arrayUsers.indexOf(monthGa.getValue("user")) == -1) {
      arrayUsers.push(monthGa.getValue("user"));
    }
  }

  for (var i in arrayUsers) {
    var userID = arrayUsers[i];

    if (DEBUG === true) {
      logger += "\nUser ID: " + userID;
    }

    var monthGr = new GlideRecord("resource_aggregate_monthly");
    
    monthGr.addQuery("user", userID);
    monthGr.addQuery("category", "IN", "capacity,availability");
    monthGr.addQuery("month_starts_on", ">=", startDate);
    monthGr.addQuery("month_starts_on", "<=", endDate);
    
    monthGr.query();

    if (DEBUG === false) {
      monthGr.deleteMultiple();

      var dailyGr = new GlideAggregate("resource_aggregate_daily");
      
      dailyGr.addQuery("user", userID);
      dailyGr.addQuery("category", "IN", "capacity,availability");
      dailyGr.addQuery("month_starts_on", ">=", startDate);
      dailyGr.addQuery("month_starts_on", "<=", endDate);      
      
      dailyGr.query();
      
      logger += "\nUser: " + user + " - Aggregate daily: " + dailyGr.getRowCount();

      dailyGr.deleteMultiple();

      //recalculate user capacity
      var rmDailyAggregate = new RMDailyAggregate(userID, startDate, endDate);
      rmDailyAggregate.populateCapacity();
    } else {
      logger += "\nMonth capacity: " + monthGr.getRowCount();
    }
  }

  logger += "\nEND";

  gs.log(logger, "ppm_fix_user_duplicated_capacity");
}


fixCapacity(/* replace by user(s) */ "<user(s)>", /* debug mode */ true);