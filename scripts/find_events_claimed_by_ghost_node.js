/**
* @author alealvar [alealv@mail.com]
* @version 0.1
* @BuildTag glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
*
* Sometimes, for whatever reason, events get stuck because they are claimed
* by an offline node or a node which doesn"t exist anymore in the instance.
*
* This script helps to identify those events
*/
function findStuckEvents() {
   var eventGa = new GlideAggregate("sysevent");
   eventGa.addAggregate("COUNT", "claimed_by");
   eventGa.addEncodedQuery("stateNOT INprocessed,error,transferred");
   eventGa.addNotNullQuery("claimed_by");
   eventGa.query();
   
   while (eventGa.next()) {
      var node = eventGa.getValue("claimed_by");
      var count = eventGa.getAggregate("COUNT", "claimed_by");
      
      var nodeGr = new GlideRecord("sys_cluster_state");
      
      nodeGr.addQuery("status", "online");
      nodeGr.addQuery("system_id", node);
      nodeGr.query();

      if (!nodeGr.hasNext()) {
         gs.log("Offline/ghost node: " + node + " is claiming " + count + " events", "find_events_claimed_by_ghost_node.js");
      }
   }
}

