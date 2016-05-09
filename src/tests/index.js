/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow, mount } from 'enzyme';
import SwipeGallery from '../index';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const { describe, it, before, beforeEach, context } = global;

chai.use(sinonChai);

const SIZE_ELEMENT = 200;

function getElements(numElements) {
  const elements = [];
  for (let i = 0; i < numElements; ++i) {
    elements.push(
      <div className="subelement" key={i}>
        <span>{ i }</span>
      </div>
    );
  }
  return elements;
}

function getFakeEventMoveSwipe(x, y) {
  return {
    changedTouches: [
      {
        clientX: x,
        clientY: y,
      },
    ],
  };
}

function simulateMovement(x, y, wrapper) {
  const start = 400;
  wrapper.simulate('touchStart', getFakeEventMoveSwipe(start, start));
  wrapper.simulate('touchMove', getFakeEventMoveSwipe(start + x, start + y));
  wrapper.simulate('touchEnd', getFakeEventMoveSwipe(start + x + x, start + y + y));
}

const fakeEvent = {
  preventDefault: () => undefined,
  stopPropagation: () => undefined,
};

describe('Swipe gallery', () => {
  it('Render a component and contain the element', () => {
    const wrapper = shallow(<SwipeGallery elements={getElements(3)} />);
    expect(wrapper.find('.subelement')).to.have.length(1);
  });

  it('Render max elements', () => {
    const elements = getElements(5);

    const wrapper = shallow(
      <SwipeGallery
        elements= {elements}
        maxElements={3}
      />
    );
    expect(wrapper.find('.subelement')).to.have.length(3);
  });

  it('Render elements.length < maxElements and show all elements', () => {
    const elements = getElements(2);
    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
      />
    );
    expect(wrapper.find('.SwipeGallery-element--visible')).to.have.length(2);
    expect(wrapper.find('.SwipeGallery-element--invisible')).to.have.length(0);
  });

  it('With buffer render elements.length < maxElements and show all elements', () => {
    const elements = getElements(2);
    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        buffer
      />
    );
    expect(wrapper.find('.SwipeGallery-element--visible')).to.have.length(2);
    expect(wrapper.find('.SwipeGallery-element--invisible')).to.have.length(0);
  });

  it('Show next button and previous button', () => {
    const elements = getElements(3);

    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
      />
    );

    expect(wrapper.find('.SwipeGallery-next')).to.have.length(1);
    expect(wrapper.find('.SwipeGallery-previous')).to.have.length(1);
  });

  it('Check if on click in next button go to the next element', () => {
    const elements = getElements(5);
    const onChange = sinon.spy();
    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        onChangePosition= {onChange}
      />
    );
    wrapper.find('.SwipeGallery-next').simulate('click', fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    expect(onChange.calledWith(1)).to.be.true;
  });

  it('Check if click in next button many times get the correct positiion', () => {
    const numElements = 5;
    const elements = getElements(numElements);
    const onChange = sinon.spy();

    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        onChangePosition= {onChange}
      />
    );

    const buttonNext = wrapper.find('.SwipeGallery-next');
    buttonNext.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(1, [1, 2, 3]);

    buttonNext.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(2, [2, 3, 4]);

    buttonNext.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(3, [3, 4, 0]);

    buttonNext.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(4, [4, 0, 1]);

    buttonNext.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(0, [0, 1, 2]);
  });

  it('Check if click in previous button many times get the correct positiion', () => {
    const numElements = 5;
    const elements = getElements(numElements);
    const onChange = sinon.spy();

    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        onChangePosition= {onChange}
      />
    );

    const buttonPrevious = wrapper.find('.SwipeGallery-previous');

    buttonPrevious.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(4, [4, 0, 1]);

    buttonPrevious.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(3, [3, 4, 0]);

    buttonPrevious.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(2, [2, 3, 4]);

    buttonPrevious.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(1, [1, 2, 3]);

    buttonPrevious.simulate('click', fakeEvent);
    expect(onChange).to.be.calledWith(0, [0, 1, 2]);
  });

  it('Check if on click in previous button go to the last element', () => {
    const numElements = 5;
    const elements = getElements(numElements);
    const onChange = sinon.spy();
    const wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        onChangePosition= {onChange}
      />
    );
    wrapper.find('.SwipeGallery-previous').simulate('click', fakeEvent);
    expect(onChange).to.be.callCount(1);
    expect(onChange).to.be.calledWith(numElements - 1);
  });

  it('Check if send a custom class, this is used', () => {
    const wrapper = shallow(
      <SwipeGallery
        elements={getElements(5)}
        className="TestClass"
      />
    );
    expect(wrapper.find('.TestClass')).to.have.length(1);
  });

  it('Check if send prop orientation vertical, change class name of buttons', () => {
    const wrapper = shallow(
      <SwipeGallery
        elements={getElements(5)}
        orientation={SwipeGallery.VERTICAL}
      />
    );
    expect(wrapper.find('.SwipeGallery--vertical')).to.have.length(1);
  });

  it('Hide arrows if send prop hideArrow=true', () => {
    const wrapper = shallow(
      <SwipeGallery
        elements={getElements(5)}
        hideArrows
      />
    );
    expect(wrapper.find('.SwipeGallery-next')).to.have.length(0);
    expect(wrapper.find('.SwipeGallery-previous')).to.have.length(0);
  });
});

describe('SwipeGallery, swipe move', () => {
  let elements;
  let onChange;
  let wrapper;

  function loadWrapper(orientation = SwipeGallery.HORIZONTAL, buffer = false) {
    wrapper = mount(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        onChangePosition={onChange}
        orientation={orientation}
        buffer = {buffer}
      />
    );

    const nodes = wrapper.find('.SwipeGallery-element').nodes;

    for (let i = 0; i < nodes.length; ++i) {
      nodes[i].offsetWidth = SIZE_ELEMENT;
      nodes[i].offsetHeight = SIZE_ELEMENT;
    }
  }

  beforeEach(() => {
    onChange = sinon.spy();
  });

  context('Without buffer: ', () => {
    before(() => {
      elements = getElements(5);
    });
    it('Simulate left swipe, change position of elements', () => {
      loadWrapper();
      simulateMovement(-50, 0, wrapper);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(1, [1, 2, 3]);
    });

    it('Simulate right swipe, change position of elements', () => {
      loadWrapper();
      simulateMovement(50, 0, wrapper);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(4, [4, 0, 1]);
    });
    it('Simulate up swipe, change position of elements', () => {
      loadWrapper(SwipeGallery.VERTICAL);
      simulateMovement(0, -50, wrapper);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(1, [1, 2, 3]);
    });
    it('Simulate down swipe, change position of elements', () => {
      loadWrapper(SwipeGallery.VERTICAL);
      simulateMovement(0, 50, wrapper);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(4, [4, 0, 1]);
    });
  });

  context('With buffer: ', () => {
    before(() => {
      elements = getElements(5);
    });

    function simulateMovementAndExpectMove(x, y) {
      const start = 400;
      wrapper.simulate('touchStart', getFakeEventMoveSwipe(start, start));
      wrapper.simulate('touchMove', getFakeEventMoveSwipe(start + x, start + y));
      const subElements = wrapper.find('.SwipeGallery-element');
      wrapper.simulate('touchEnd', getFakeEventMoveSwipe(start + x + x, start + y + y));
      for (const element of subElements.nodes) {
        if (x > 0) {
          expect(element.style.left).to.have.equal('');
        } else {
          expect(element.style.top).to.have.equal('');
        }
      }
    }

    it('Simulate left swipe, change position of elements', () => {
      loadWrapper(SwipeGallery.HORIZONTAL, true);
      simulateMovementAndExpectMove(-50, 0);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(1, [1, 2, 3]);
    });
    it('Simulate right swipe, change position of elements', () => {
      loadWrapper(SwipeGallery.HORIZONTAL, true);
      simulateMovementAndExpectMove(50, 0);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(4, [4, 0, 1]);
    });
    it('Simulate up swipe, change position of elements', () => {
      loadWrapper(SwipeGallery.VERTICAL, true);
      simulateMovementAndExpectMove(0, -50);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(1, [1, 2, 3]);
    });
    it('Simulate down swipe, change position of elements', () => {
      loadWrapper(SwipeGallery.VERTICAL, true);
      simulateMovementAndExpectMove(0, 50);
      expect(onChange).to.be.callCount(1);
      expect(onChange).to.be.calledWith(4, [4, 0, 1]);
    });
  });

  context('Dont\'t allow swipe', () => {
    it('with elements.length < maxElements', () => {
      elements = getElements(2);
      loadWrapper();
      simulateMovement(50, 0, wrapper);
      expect(onChange).to.be.callCount(0);
    });
    it('with prop disableSwipe=true', () => {
      elements = getElements(5);
      wrapper = mount(
        <SwipeGallery
          elements = {elements}
          maxElements={3}
          onChangePosition={onChange}
          disableSwipe
        />
      );
      simulateMovement(50, 0, wrapper);
      expect(onChange).to.be.callCount(0);
    });
  });
});

describe('Diferents number of elements with buffer', () => {
  function getWrapper(numElements, maxElements, onChange, hideArrowWithNoElements) {
    const elements = getElements(numElements);
    return shallow(
      <SwipeGallery
        elements={elements}
        maxElements={maxElements}
        onChangePosition={onChange}
        buffer
        hideArrowWithNoElements={hideArrowWithNoElements}
      />
    );
  }

  let onChange;

  beforeEach(() => {
    onChange = sinon.spy();
  });

  it('1 element with maxElements 3', () => {
    const wrapper = getWrapper(1, 3, onChange);
    expect(wrapper.find('.SwipeGallery-element--visible')).to.have.length(1);
    expect(wrapper.find('.SwipeGallery-next')).to.have.length(0);
    expect(wrapper.find('.SwipeGallery-previous')).to.have.length(0);
  });

  it('1 element with maxElements 3 and hideArrowWithNoElements=false', () => {
    const wrapper = getWrapper(1, 3, onChange, false);
    expect(wrapper.find('.SwipeGallery-element--visible')).to.have.length(1);
    expect(wrapper.find('.SwipeGallery-next')).to.have.length(1);
    expect(wrapper.find('.SwipeGallery-previous')).to.have.length(1);
  });
});

describe('Swipe gallery with prop buffer=true', () => {
  let elements;
  let wrapper;
  let onChange;

  before(() => {
    elements = getElements(5);
  });

  beforeEach(() => {
    onChange = sinon.spy();
    wrapper = shallow(
      <SwipeGallery
        elements={elements}
        maxElements={3}
        onChangePosition={onChange}
        buffer
      />
    );
  });
  it('Expect have visible 3 elements, but load 5 element (2 of buffer)', () => {
    expect(wrapper.find('.subelement')).to.have.length(5);
    expect(wrapper.find('.SwipeGallery-element--visible')).to.have.length(3);
    expect(wrapper.find('.SwipeGallery-element--invisible')).to.have.length(2);
  });
});

describe('stopPropagation parameter', () => {
  it('If is true don\'t propagate the touchEvent', () => {
    let onTouch = sinon.spy();
    const wrapper = mount(
      <div
        onTouchStart={onTouch}
        onTouchMove={onTouch}
        onTouchEnd={onTouch}
      >
        <SwipeGallery
          elements={getElements(5)}
          stopPropagation
        />
      </div>
    );
    simulateMovement(50, 0, wrapper.find('.SwipeGallery'));
    expect(onTouch).to.have.callCount(0);
  });
});
