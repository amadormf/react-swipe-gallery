import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SwipeGallery from '../../lib/index';
import '../styles/SwipeGallery.styl';

function getElements(numElements) {
  const elements = [];
  const styles = {
    width: '200px',
    height: '200px',
    fontSize: '3em',
    margin: '2px',
    backgroundColor: 'grey',
    textAlign: 'center',
  };
  for (let i = 0; i < numElements; ++i) {
    elements.push(
      <div style={styles}><span>{i}</span></div>
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
  ))
  .add('With buffer', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
      buffer
    />
  ))
;
