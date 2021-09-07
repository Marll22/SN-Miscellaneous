# How to fake a workflow event

- Find the workflow context(s)
  - Table: wf_context
  - Filter by: Related record [id] = record.sys_id

- Find the workflow executing
  - Table: wf_executing
  - Filter by: Context [context] = wf_context.sys_id
  - Export the record(s) as XML file format

- Edit the XML file
  - Set state=finished

- Import back the edited XML file into ServiceNow
