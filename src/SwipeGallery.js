import React, { PropTypes } from 'react';
import styles from './styles/SwipeGallery.styl';
import classNames from 'classnames';

export default class SwipeGallery extends React.Component {
  static HORIZONTAL = 'horizontal';
  static VERTICAL = 'vertical';

  static propTypes = {
    elements: PropTypes.array.isRequired,
    maxElements: PropTypes.number,
    onChangePosition: PropTypes.function,
    orientation: PropTypes.string,
  };

  static defaultProps = {
    orientation: SwipeGallery.HORIZONTAL,
  };

  constructor(props) {
    super(props);
    this.state = {
      actualPosition: 0,
      visiblePositions: this._getVisiblePositions(0),
    };
  }

  _getVisibleElements() {
    return this.state.visiblePositions.map(position => this.props.elements[position]);
  }

  _getVisiblePositions(actualPosition) {
    const elements = this.props.elements;
    const maxElements = this.props.maxElements || elements.length;

    const visiblePositions = [];
    for (let i = 0; i < elements.length && i < maxElements; ++i) {
      let position = actualPosition + i;
      if (position >= elements.length) {
        position = 0 + (position - elements.length);
      }
      visiblePositions.push(position);
    }
    return visiblePositions;
  }

  _calculatePosition(movePositions) {
    const actualPosition = this.state ? this.state.actualPosition : 0;
    const elementsCount = this.props.elements.length;
    const maxElements = this.props.maxElements || elementsCount;

    if (elementsCount <= maxElements) {
      return 0;
    }

    let calculateNewPosition = actualPosition + movePositions;
    if (calculateNewPosition >= elementsCount) {
      calculateNewPosition = 0;
    } else if (calculateNewPosition < 0) {
      calculateNewPosition = elementsCount;
    }
    return calculateNewPosition;
  }

  _move(e, movePositions) {
    e.preventDefault();
    e.stopPropagation();

    const position = this._calculatePosition(movePositions);

    this.setState({
      actualPosition: position,
      visiblePositions: this._getVisiblePositions(position),
    }, () => {
      if (typeof this.props.onChangePosition === 'function') {
        this.props.onChangePosition(this.state.actualPosition, this.state.visiblePositions);
      }
    });
  }

  _getSwipeableContainer(childs) {

  }

  render() {
    const { orientation } = this.props;
    return (
      <div className = {styles.SwipeGallery} >
        <div
          className={styles['SwipeGallery-previous']}
          onClick={(e) => {
            this._move(e, -1);
          }}
        >
          {'<'}
        </div>
        <div
          className={styles['SwipeGallery-container']}
        >
          {this._getVisibleElements()}
        </div>
        <div
          className = {styles['SwipeGallery-next']}
          onClick={(e) => {
            this._move(e, 1);
          }}
        >
          {'>'}
        </div>
      </div>
    );
  }
}
