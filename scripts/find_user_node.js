/**
 * @author alealvar [alealvarez@mail.com]
 * @BuildTag glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
 * @description
 * Returns the node which user is logged-in to.
 * Node is contained in loggin transaction log. The script filter that log
 * to find the node.
 *
 * @param {string} user_name The ID of the user
 * @print The node which the user is logged-in to
 */
function findNode(user_name) {
  var logGr = new GlideRecord('syslog_transaction');
  
  logGr.addQuery('sys_created_by', user_name);
  logGr.addQuery('sys_created_on', '>', gs.minutesAgo(15));
  
  logGr.orderBy('sys_created_on');
  logGr.setLimit(1);
  
  logGr.query();

  if (logGr.next()) {
    var node = logGr.getValue('system_id');
    var num = node.indexOf(':');
    var nodeName = node.substring(parseInt(num+1), parseInt(node.length));
    
    gs.log("User " + user_name + " is currently logged-in into node " + nodeName, "find_user_node.js");
  } else {
    gs.log("User " + user_name + " is not logged-in right now", "find_user_node.js");
  }
}

findNode( /* Replace by user name */'<user_name>');
