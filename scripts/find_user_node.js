// find_user_node.js

/**
* @author alealvar [alealv@mail.com]
* @version 0.1
*
* Build tag: glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
*/

/**
* Returns the node which user is logged-in on.
* Node is contained in loggin transaction log. The script filter that log
* to find the node.
*
* @param {string} user_name The ID of the user
* @return {string} The node which the user is logged-in on
*/
function findNode(user_name) {
  var logs = new GlideRecord('syslog_transaction');
  logs.addQuery('sys_created_by', user_name);
  // The next filter it's arbitrary, however improves the SQL response time
  logs.addQuery('sys_created_on', '>', gs.minutesAgo(15));
  logs.orderBy('sys_created_on'); // Ascending Order
  logs.setLimit(1); // Returns just one record
  logs.query();

  // case A: user is currently logged-in
  if (logs.next()) {
    var node = logs.system_id.toString();
    var num = node.indexOf(':');
    var nodeName = node.substring(parseInt(num+1), parseInt(node.length));
    gs.log("User " + user_name + " is currently logged-in into node " + nodeName);

  // case B: user in not currently logged-in
  } else {
    gs.log("User " + user_name + " is not logged-in right now");
  }
}

findNode('<user_name>');
