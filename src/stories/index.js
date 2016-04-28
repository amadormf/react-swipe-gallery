import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SwipeGallery from '../index';
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

const styles = {
  width: '90vw',
  margin: '0 auto',
};
storiesOf('Button', module)
  .add('default view', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
      customStyles={styles}
    />
  ))
  .add('vertical view', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
      orientation={SwipeGallery.VERTICAL}
    />
  ))
  .add('with buffer', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
      customStyles={styles}
      buffer
    />
  ))
  .add('vertical with buffer', () => (
    <SwipeGallery
      elements={ getElements(5) }
      maxElements={3}
      customStyles={styles}
      orientation={SwipeGallery.VERTICAL}
      buffer
    />
  ))
;
