/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow, mount } from 'enzyme';
import SwipeGallery from '../index';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

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
    expect(wrapper.find('.subelement')).to.have.length(3);
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
    const container = wrapper.find('.SwipeGallery-container');
    buttonNext.simulate('click', fakeEvent);
    expect(onChange.calledWith(1, [1, 2, 3])).to.be.true;

    buttonNext.simulate('click', fakeEvent);
    expect(onChange.calledWith(2, [2, 3, 4])).to.be.true;

    buttonNext.simulate('click', fakeEvent);
    expect(onChange.calledWith(3, [3, 4, 0])).to.be.true;

    buttonNext.simulate('click', fakeEvent);
    expect(onChange.calledWith(4, [4, 0, 1])).to.be.true;

    buttonNext.simulate('click', fakeEvent);
    expect(onChange.calledWith(0, [0, 1, 2])).to.be.true;
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
    expect(onChange.callCount).to.be.equal(1);
    expect(onChange.calledWith(numElements)).to.be.true;
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
});
