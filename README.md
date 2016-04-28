# React Swipe Gallery Component

Swipe gallery over React

You can view an online example in [http://amadormf.github.io/react-swipe-gallery/](http://amadormf.github.io/react-swipe-gallery/)

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

|Props Name | Type         | Default  | Description              |
|-----------|--------------|:--------:|----------------|
|elements   |Array         |          |Element of gallery        |
|maxElements|Number        |    1     |Max number of elements    |   
|onChangePosition|Function |          |Call when change the elements visibles|
|orientation|String        |HORIZONTAL|SwipeGallery.VERTICAL or SwipeGallery.HORIZONTAL|
|className  |String        |          |Custom name class         |
|buffer     |Bool          |  true    |if is true add a buffer for quickly transition|
|hideArrow  |Bool          |  false   |If is true don't show the arrows|
|hideArrowWithNoElements|Bool       |true   |If is true and maxElements > elements.length don't show the arrows|
 
