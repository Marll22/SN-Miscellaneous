/**
* @author alealvar [alexalvarez@mail.com]
* @BuildTag glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
* @description
* Fixes users with duplicated records in resource_aggregate_daily and
* resource_aggregate_monthly tables. The script checks whether an user has
* duplicated records in resource_aggregate_monthly table filtering by category
* = 'capacity' for a defined period of time.
* In the event of user has any duplicated records for that perior, the script
* deletes the records in both tables and run the OOB script to populate the
* user capacity
*
* @param {String} users Comma-separated list of sys_user.sys_id values
* @param {boolean} debug Run mode. True only print results, false fix records
* @return {String|null} In debug mode, prints the users with duplicated capacities
*/
(function (users, debug) {
  var startDate = gs.dateGenerate('2020-01-01', 'start');
  var endDate = gs.dateGenerate('2025-12-31', 'end');
  var arrayUsers = [];
  var logger = '\nSTART';

  var gaAggregateMonthly = new GlideAggregate('resource_aggregate_monthly');

  gs.nil(users) ? undefined : gaAggregateMonthly.addQuery('user', 'IN', users);

  gaAggregateMonthly.addQuery('category', 'capacity');
  gaAggregateMonthly.addQuery('month_starts_on', '>=', startDate);
  gaAggregateMonthly.addQuery('month_starts_on', '<=', endDate);

  gaAggregateMonthly.addAggregate('COUNT', 'month_starts_on');
  gaAggregateMonthly.addHaving('COUNT', '>', '1');
  gaAggregateMonthly.groupBy('user');
  gaAggregateMonthly.groupBy('month_starts_on');
  
  gaAggregateMonthly.query();

  while (gaAggregateMonthly.next()) {
      arrayUsers.push(gaAggregateMonthly.getValue('user'));
  }

  var uniqueUsers = arrayUsers.filter(function (element, index) {
    return arrayUsers.indexOf(element) === index;
  });

  uniqueUsers.forEach(function(userID) {
    debug && (logger += '\nUser ID: ' + userID);

    var grAggregateMonthly = new GlideRecord('resource_aggregate_monthly');
    
    grAggregateMonthly.addQuery('user', userID);
    grAggregateMonthly.addQuery('category', 'IN', 'capacity,availability');
    grAggregateMonthly.addQuery('month_starts_on', '>=', startDate);
    grAggregateMonthly.addQuery('month_starts_on', '<=', endDate);
    
    grAggregateMonthly.query();

    if (!debug) {
      grAggregateMonthly.deleteMultiple();

      var grAggregateDaily = new GlideAggregate('resource_aggregate_daily');
      
      grAggregateDaily.addQuery('user', userID);
      grAggregateDaily.addQuery('category', 'IN', 'capacity,availability');
      grAggregateDaily.addQuery('month_starts_on', '>=', startDate);
      grAggregateDaily.addQuery('month_starts_on', '<=', endDate);      
      
      grAggregateDaily.query();
      
      logger += '\nUser: ' + userID + ' - Aggregate daily: ' + grAggregateDaily.getRowCount();

      grAggregateDaily.deleteMultiple();

      // Recalculate user capacity
      var rmDailyAggregate = new RMDailyAggregate(userID, startDate, endDate);
      rmDailyAggregate.populateCapacity();
    
    } else {
      logger += '\nMonth capacity: ' + grAggregateMonthly.getRowCount();
    }

  });

  logger += '\nEND';

  gs.log(logger, 'ppm_duplicated_capacity');
})('<sys_ids>', true);