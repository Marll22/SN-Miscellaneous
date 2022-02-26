/**
 * @author alealvar [alexalvarez@mail.com]
 * @BuildTag glide-orlando-12-11-2019__patch0-hotfix1-01-08-2020
 * @description
 * Sometimes, for whatever reason, events get stuck because they are claimed
 * by an offline node or a node which doesn't exist anymore in the instance.
 * This script helps to identify those events
 * 
 * @return {String} The stuck events and the node(s) claiming them
 */
(function () {
   var gaEvent = new GlideAggregate('sysevent');
   gaEvent.addAggregate('COUNT', 'claimed_by');
   gaEvent.addQuery('state', '!=', 'processed');
   gaEvent.addQuery('state', '!=', 'error');
   gaEvent.addQuery('state', '!=', 'transferred');
   gaEvent.addNotNullQuery('claimed_by');
   gaEvent.query();
   
   while (gaEvent.next()) {
      var node = gaEvent.getValue('claimed_by');
      var count = gaEvent.getAggregate('COUNT', 'claimed_by');
      
      var grNode = new GlideRecord('sys_cluster_state');
      
      grNode.addQuery('status', 'online');
      grNode.addQuery('system_id', node);
      grNode.query();

      grNode.hasNext() ? 
      gs.log('No events found', 'stuck_event') :
      gs.log('Offline/ghost node: ' + node + ' is claiming ' + count + ' events', 'stuck_event');
   }
})();