# Opened for / Subject person

Client is requesting an API to submit HR Cases from third-party systems. The solution figured out was to take advantage of the out of the box Service Catalog API, specifically the Submit a Record Producer (POST) resource.

Chosen that approach, having a record producer associated to the HR Service becomes mandatory. OOB, none of those record produces include variables mapped to the Opened for and Subject person fields as the producer is supposed to be used through the catalog of services hence the logged in user would be set up in the above mentioned fields.

However, from our perspective, all the cases opened by our integration would set the generic user (the most common approach is to create a generic user as the interface handler) in the opened by, opened for, and subject person what is an unwished behaviour.

One simple solution would be:

* Create a variable set containing both variables opened for and subject person (Reference to `sys_user` table)
* Set default value `gs.getUserID()`
* Set the flag *Map to field* as `true`
* Set the field field as `opened_for` and `subject_person` respectively
* Create a Catalog UI Policy hiding the field by default
  * Mark *Applies on a Catalog Item View*
  * Mark *Applies on Catalog Tasks*
  * Mark *Applies on Requested Items*
  * Mark *Applies on the Target Record*
* Include the variable set in the desired record producers

## How to test OOB

Open the REST API Explorer

* **Namespace:** sn_sc
* **API Name:** Service Catalog API
* **Method:** Submit a Record Producer (POST)
* **Path Parameters**
  * **sys_id:** dfec71099f231200d9011977677fcfdc
* **Body**

```json
{
  variables: {
    "what_is_your_question": "Testing from API Explorer",
    "opened_for": "62826bf03710200044e0bfc8bcbe5df1",
    "subject_person": "be82abf03710200044e0bfc8bcbe5d1c"
  }
}
```
