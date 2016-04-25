import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SwipeGallery from '../index';

function getElements(numElements) {
  const elements = [];
  for (let i = 1; i <= numElements; ++i) {
    elements.push(
      <div className="subelement">{ i }</div>
    );
  }
  return elements;
}

storiesOf('Button', module)
  .add('default view', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
    />
  ))
  .add('vertical view', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
      orientation={SwipeGallery.VERTICAL}
    />
  ));
