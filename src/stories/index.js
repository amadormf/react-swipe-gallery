import React from 'react';
import { storiesOf, action } from '@storybook/react';
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

class SwipeManually extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.position !== nextState.position;
  }

  _onChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!Number.isNaN(value)) {
      this.setState({
        position: value,
      });
    }
  }

  render() {
    const elements = getElements(10);
    const stylesInput = {
      fontSize: '2em',
      marginBottom: '1em',
    };
    const actionPosition = action('changedPosition');

    return (
      <div>
        <input type="text" onChange={this._onChange} style={ stylesInput } />
        <SwipeGallery
          elements={elements}
          maxElements={3}
          buffer
          position={this.state.position}
          onChangePosition={ actionPosition }
        />
      </div>
    );
  }
}

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
  .add('horizontal with buffer but only three elements', () => (
    <SwipeGallery
      elements={ getElements(3) }
      maxElements={3}
      customStyles={styles}
      buffer
    />
  ))
  .add('horizontal with buffer and nonRotating', () => (
    <SwipeGallery
      elements={ getElements(4) }
      maxElements={3}
      customStyles={styles}
      buffer
      infinityGallery={false}
    />
  ))
  .add('Custom arrows', () => (
    <SwipeGallery
      elements={getElements(10)}
      maxElements={3}
      buffer
      arrows={{
        prev: 'p',
        next: 'n',
      }}
    />
  ))
  .add('Change position', () => (
    <SwipeGallery
      elements={getElements(10)}
      maxElements={3}
      buffer
      initialPosition={4}
    />
  ))
  .add('Change position manually', () => (
    <SwipeManually />
  ));
