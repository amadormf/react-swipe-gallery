# React Swipe Gallery Component

Swipe gallery over React

##Install

`npm install --save react-swipe-gallery`

##Example

```javascript
import SwipeGallery from 'react-swipe-gallery'

//elements only for example
function getElements(numElements) {
  const elements = [];
  for (let i = 0; i < numElements; ++i) {
    elements.push(
      <div className="subelement" key={i}>
        { i }
      </div>
    );
  }
  return elements;
}

//swipe gallery example
const gallery = (
  <SwipeGallery
    elements={getElements(5)}
    maxElement={3}
  />  
);
```

##Props

|Props Name | Type      | Description              |
|-----------|-----------|--------------------------|
|elements   |Array      |Element of gallery        |
|maxElements|Number     |Max number of elements    |   
|onChangePosition|Function |Call when change the elements visibles|
|orientation|String     |SwipeGallery.VERTICAL or SwipeGallery.HORIZONTA1L|
|className  |String     |Custom name class         |
|buffer     |Bool       |if is true add a buffer for quickly transition|

