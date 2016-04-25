import React, { PropTypes } from 'react';

export default class SwipeGallery extends React.Component {
  static propTypes = {
    elements: PropTypes.array.isRequired,
  };

  render() {
    const { elements } = this.props;
    return (
      <div>
        {elements}
      </div>
    );
  }
}
