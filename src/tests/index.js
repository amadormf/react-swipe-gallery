import React from 'react';
import { shallow, mount } from 'enzyme';
import SwipeGallery from '../index';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('Swipe gallery', () => {
  it('Render a component and contain the element', () => {
    const elements = [(
      <div>Hello</div>
    )];

    const wrapper = shallow(<SwipeGallery elements={elements}></SwipeGallery>);
    expect(wrapper.text()).to.be.equal('Hello');
  });

  it('should handle the click event', () => {
    const clickMe = sinon.stub();
    // Here we do a JSDOM render. So, that's why we need to
    // wrap this with a div.
    const wrapper = mount(
      <div>
        <Button onClick={ clickMe }>ClickMe</Button>
      </div>
    );

    wrapper.find('button').simulate('click');
    expect(clickMe.callCount).to.be.equal(1);
  });
});
