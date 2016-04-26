import React, { PropTypes } from 'react';
import Swipeable from 'react-swipeable';
import classNames from 'classnames';
import './styles/SwipeGallery.styl';

export default class SwipeGallery extends React.Component {
  static HORIZONTAL = 'horizontal';
  static VERTICAL = 'vertical';

  static propTypes = {
    elements: PropTypes.array.isRequired,
    maxElements: PropTypes.number,
    onChangePosition: PropTypes.function,
    orientation: PropTypes.string,
    className: PropTypes.string,
    buffer: PropTypes.bool,
  };

  static defaultProps = {
    orientation: SwipeGallery.HORIZONTAL,
    buffer: false,
  };

  constructor(props) {
    super(props);
    this.allowSwipe = true;
    this.state = {
      actualPosition: 0,
      visiblePositions: this._getVisiblePositions(0),
    };
  }

  _wrapElement(visible, element, position, index) {
    const classWrap = classNames({
      'SwipeGallery-element--visible': visible,
      'SwipeGallery-element--invisible': !visible,
      'SwipeGallery-element--left': position === 'left',
      'SwipeGallery-element--right': position === 'right',
      'SwipeGallery-element--top': position === 'top',
      'SwipeGallery-element--bottom': position === 'bottom',
    });
    return (
      <div className={classWrap} key={index}>
        {element}
      </div>
    );
  }

  _getVisibleElements() {
    const elements = [];
    if (this.props.buffer) {
      let firstPosition = this.state.visiblePositions[0] - 1;
      if (firstPosition < 0) {
        firstPosition = this.props.elements.length - 1;
      }
      elements.push(
        this._wrapElement(
          false,
          this.props.elements[firstPosition],
          this.props.orientation === SwipeGallery.HORIZONTAL ? 'left' : 'top',
          firstPosition
        )
      );
    }


    for (const position of this.state.visiblePositions) {
      elements.push(this._wrapElement(true, this.props.elements[position], null, position));
    }

    if (this.props.buffer) {
      let lastPosition = this.state.visiblePositions[this.state.visiblePositions.length - 1] + 1;
      if (lastPosition >= this.props.elements.length) {
        lastPosition = 0;
      }
      elements.push(
        this._wrapElement(
          false,
          this.props.elements[lastPosition],
          this.props.orientation === SwipeGallery.HORIZONTAL ? 'right' : 'bottom',
          lastPosition
        )
      );
    }
    return elements;
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
      calculateNewPosition = elementsCount - 1;
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

  _swipe(e, movePositions) {
    if (this.allowSwipe) {
      this._move(e, movePositions);
      this.allowSwipe = false;
      setTimeout(() => {
        this.allowSwipe = true;
      }, 200);
    }
  }

  render() {
    const { orientation, className } = this.props;

    const swipeGalleryClasses = classNames({
      SwipeGallery: true,
      'SwipeGallery--vertical': orientation === SwipeGallery.VERTICAL,
      [className]: !!className,
    });

    const arrowClassesLeft = classNames({
      'SwipeGallery-previous': true,
      'SwipeGallery-previous--rotate90': orientation === SwipeGallery.VERTICAL,
    });

    const arrowClassesRight = classNames({
      'SwipeGallery-next': true,
      'SwipeGallery-next--rotate90': orientation === SwipeGallery.VERTICAL,
    });

    return (
      <Swipeable
        onSwipingUp = {
          (e) => {
            if (orientation === SwipeGallery.VERTICAL) {
              this._swipe(e, 1);
            }
          }
        }
        onSwipingDown = {
          (e) => {
            if (orientation === SwipeGallery.VERTICAL) {
              this._swipe(e, -1);
            }
          }
        }
        onSwipingRight = {
          (e) => {
            if (orientation === SwipeGallery.HORIZONTAL) {
              this._swipe(e, -1);
            }
          }
        }
        onSwipingLeft = {
          (e) => {
            if (orientation === SwipeGallery.HORIZONTAL) {
              this._swipe(e, 1);
            }
          }
        }
      >
        <div className = {swipeGalleryClasses} >
          <div
            className={arrowClassesLeft}
            onClick={(e) => {
              this._move(e, -1);
            }}
          >
            <div>{'❮'}</div>
          </div>
          <div
            className={'SwipeGallery-container'}
          >
            {this._getVisibleElements()}

          </div>
          <div
            className = {arrowClassesRight}
            onClick={(e) => {
              this._move(e, 1);
            }}
          >
            <div>{'❯'}</div>
          </div>
        </div>
      </Swipeable>
    );
  }
}
