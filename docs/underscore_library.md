# Underscore JS Snippets

## Snippet 1

**Use case** 

For a given object composed of objects, filter the objects by a value. Version 1.8.3

```js
var myObj = {
  obj1: {
    name: 'obj1',
    required: true
  },
  obj2: {
    name: 'obj2',
    required: false
  },
  obj3: {
    name: 'obj3',
    required: false
  },
  obj4: {
    name: 'obj4',
    required: true
  },
  obj5: {
    name: 'obj5',
    required: true
  }
};

var arr = [];
_.mapObject(myObj, function(value, key){
  value.required ? arr.push(key) : void 0 ;
});
arr;
```