import React, { PropTypes } from 'react';
import styles from './styles/SwipeGallery.styl';

export default class SwipeGallery extends React.Component {
  static propTypes = {
    elements: PropTypes.array.isRequired,
    maxElements: PropTypes.number,
    onChangePosition: PropTypes.function,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      actualPosition: 0,
    };
  }

  _getVisibleElements() {
    const { elements, maxElements } = this.props;
    const { actualPosition } = this.state;
    let countElements = 0;
    const elementsToReturn = [];
    for(let i = 0; i < elements.length && i < maxElements; ++i) {
      actualPosition = 0;
      elementsToReturn.push(element);
      if (maxElements && ++countElements >= maxElements) {
        break;
      }
    }
    return elementsToReturn;
  }


  _calculatePosition(movePositions) {
    const { actualPosition } = this.state;
    const elementsCount = this.props.elements.length;
    const maxElements = this.props.maxElements || elementsCount;

    if (elementsCount <= maxElements) {
      return 0;
    }

    let calculateNewPosition = actualPosition + movePositions;
    if (calculateNewPosition > maxElements) {
      calculateNewPosition = 0;
    } else if (calculateNewPosition < 0) {
      calculateNewPosition = elementsCount;
    }
    return calculateNewPosition;
  }

  _move(e, movePositions) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      actualPosition: this._calculatePosition(movePositions),
    }, () => {
      console.log("actualPosition = ", this.state.actualPosition);
      if (typeof this.props.onChangePosition === 'function') {
        this.props.onChangePosition(this.state.actualPosition);
      }
    });
  }

  render() {
    return (
      <div className = {styles.SwipeGallery}>
        <div
          className={styles['SwipeGallery-previous']}
          onClick={(e) => {
            this._move(e, -1);
          }}
        >
          {'<'}
        </div>
        {this._getVisibleElements()}
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
