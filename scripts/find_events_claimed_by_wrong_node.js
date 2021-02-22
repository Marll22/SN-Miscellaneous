// find_events_claimed_by_wrong_node.js

/**
* @author alealvar [alealv@mail.com]
* @version 0.1
*
* Sometimes, for whatever reason, events being stuck because they are claimed
* by an offline node or a node which doesn't exist anymore in the instance.
*
* This script helps to identify those events
*/

var ga = new GlideAggregate('sysevent');
// aggregate events by node
ga.addAggregate('COUNT', 'claimed_by');
// filter in those events which are currently active
ga.addEncodedQuery("stateNOT INprocessed,error,transferred");
// filter out those events which are not claimed by any node yet
ga.addQuery('claimed_by', '!=', 'NULL');
ga.query();

while (ga.next()) {
   var node = ga.claimed_by;
   var count = ga.getAggregate('COUNT', 'claimed_by');
   /* find node in sys_cluster_state table */
   var gr = new GlideRecord("sys_cluster_state");
   // filter in those nodes which are online
   gr.addQuery("status", "online");
   // filter in that node which has claimed the event
   gr.addQuery("system_id", node.toString());
   gr.query();

   // if query returns no nodes, it means the event's been claimed by a node
   // which is not acailable anumore in the instance
   if (gr.getRowCount() == 0) {
      gs.print("Offline/ghost node: " + node + " is claiming " + count + " events");
   }
}
