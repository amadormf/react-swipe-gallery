/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow } from 'enzyme';
import SwipeGallery from '../index';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const { describe, it, before, beforeEach } = global;

chai.use(sinonChai);

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
      />
    );
  });

  it('Check swipe left move', () => {
    wrapper.prop('onSwipingLeft')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    expect(onChange.calledWith(1, [1, 2, 3])).to.be.true;
  });

  it('Check swipe right move', () => {
    wrapper.prop('onSwipingRight')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    expect(onChange.calledWith(4, [4, 0, 1])).to.be.true;
  });

  it('Check swipe up move', () => {
    wrapper.setProps({ orientation: SwipeGallery.VERTICAL });
    wrapper.update();
    wrapper.prop('onSwipingUp')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    expect(onChange.calledWith(1, [1, 2, 3])).to.be.true;
  });

  it('Check swipe up move', () => {
    wrapper.setProps({ orientation: SwipeGallery.VERTICAL });
    wrapper.update();
    wrapper.prop('onSwipingDown')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    expect(onChange.calledWith(4, [4, 0, 1])).to.be.true;
  });

  it('Check swipe don\'t allow quickly move', () => {
    wrapper.prop('onSwipingRight')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    wrapper.prop('onSwipingRight')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
  });

  it('Check swipe move with timeout', (cb) => {
    wrapper.prop('onSwipingRight')(fakeEvent);
    expect(onChange.callCount).to.be.equal(1);
    setTimeout(() => {
      wrapper.prop('onSwipingRight')(fakeEvent);
      expect(onChange.callCount).to.be.equal(2);
      cb();
    }, 200);
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
