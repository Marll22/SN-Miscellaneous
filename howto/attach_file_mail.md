# How to attach a file to a mail by script

For whatever reason, we cannot attach a file to an email directly in the notification record. In those cases, there is another solution: **Create a business rule including the attachment to the outbound notifiaction**

## Steps

[x] Create System property

- **Name:** sys_attachment.***filename***
- **Type:** String
- **Value:** *`sys_id` of the attachmente [sys_attachment] record*

[x] Create Business Rule

- **Name:** Attachments notification *myNotificationName*
- **Table:** Email [sys_email]
- **When to run:** Before insert
- **Filter condition(s):** *make sure to filter the specific notification*
- **Script:**

```js
(function executeRule(current, previous /*null when async*/) {

  var attID = gs.getProperty('sys_attachment.filename');
  var grAtt = new GlideRecord('sys_attachment');

  if (grAtt.get(attID)) {
    var content = new GlideSysAttachment().getContentStream(grAtt.getUniqueValue());
    new GlideSysAttachment().writeContentStream(
      current,
      grAtt.getValue('file_name'),
      grAtt.getValue('content_type'),
      content
    );
  }
})(current, previous);
```
