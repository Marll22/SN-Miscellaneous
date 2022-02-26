/**
 * @author alealvar [alexalvarez@mail.com]
 * @BuildTag glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
 * @description
 * Returns the node which user is logged-in to.
 * Node is contained in loggin transaction log. The script filter that log
 * to find the node.
 *
 * @param {String} user_name sys_user.user_name
 * @return {String} The node which the user is logged-in to
 */
(function (userName) {
  var grLog = new GlideRecord('syslog_transaction');
  
  grLog.addQuery('sys_created_by', userName);
  grLog.addQuery('sys_created_on', '>', gs.minutesAgo(15));
  
  grLog.orderBy('sys_created_on');
  grLog.setLimit(1);
  
  grLog.query();

  if (grLog.next()) {
    var node = grLog.getValue('system_id');
    var num = node.indexOf(':');
    var nodeName = node.substring(parseInt(num+1), parseInt(node.length));
    
    gs.log("User " + userName + " is currently logged-in to node " + nodeName, "user_node");
  } else {
    gs.log("User " + userName + " is not logged-in right now", "user_node");
  }
})('<userName>');
