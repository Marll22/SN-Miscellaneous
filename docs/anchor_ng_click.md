# Anchor Tag - ng-click()

**Use case:** In Service Portal, we need to do some checks before jumping to another site from an anchor tag

- HTML Template

```html
<div>
  <a href="https://www.google.es/" target="_blank" ng-click="c.clicked()" id="anchor">Google</a>
</div>
```

- Client Controller

```js
api.controller = function() {
  /* widget controller */
  var c = this;

  c.clicked = function($event) {
    alert("Testing");
    var anchor = document.getElementById("anchor");
    anchor.href = "javascript:void(0)";
    anchor.target = "_self";
  };
};
```
