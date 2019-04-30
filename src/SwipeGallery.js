import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class SwipeGallery extends React.Component {
  static HORIZONTAL = 'horizontal';
  static VERTICAL = 'vertical';

  static NEXT = 1;
  static PREVIOUS = -1;

  static propTypes = {
    elements: PropTypes.array.isRequired,
    maxElements: PropTypes.number,
    onChangePosition: PropTypes.func,
    orientation: PropTypes.string,
    className: PropTypes.string,
    buffer: PropTypes.bool,
    hideArrows: PropTypes.bool,
    hideArrowWithNoElements: PropTypes.bool,
    customStyles: PropTypes.object,
    disableSwipe: PropTypes.bool,
    stopPropagation: PropTypes.bool,
    infinityGallery: PropTypes.bool,
    arrows: PropTypes.object,
    position: PropTypes.number,
    initialPosition: PropTypes.number,
  };

  static defaultProps = {
    orientation: SwipeGallery.HORIZONTAL,
    maxElements: 1,
    buffer: false,
    hideArrows: false,
    hideArrowWithNoElements: true,
    disableSwipe: false,
    infinityGallery: true,
    arrows: {
      prev: '❮',
      next: '❯',
    },
    initialPosition: 0,
    position: null,
  };

  constructor(props) {
    super(props);
    this.allowSwipe = true;
    this.state = {
      actualPosition: this.props.initialPosition,
      visiblePositions: this._getVisiblePositions(props.initialPosition),
      swiping: false,
      canMovePrev: this._canMove('prev', props.initialPosition),
      canMoveNext: this._canMove('next', props.initialPosition),
    };
    this._resetMove();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== null && nextProps.position >= 0) {
      const movePositions = nextProps.position - this.state.actualPosition;
      this._move(null, movePositions);
    }
  }

  _resetMove() {
    this.movement = {
      moveX: 0,
      moveY: 0,
      accumulatorX: 0,
      accumulatorY: 0,
    };
  }

  _wrapElement(visible, element, position, index) {
    const classWrap = classNames({
      'SwipeGallery-element': true,
      'SwipeGallery-element--visible': visible,
      'SwipeGallery-element--invisible': !visible,
      'SwipeGallery-element--left': position === 'left',
      'SwipeGallery-element--right': position === 'right',
      'SwipeGallery-element--top': position === 'top',
      'SwipeGallery-element--bottom': position === 'bottom',
    });
    return (
      <div
        className={classWrap}
        key={index}
      >
        {element}
      </div>
    );
  }

  _getVisibleElements() {
    const elements = [];

    for (const position of this.state.visiblePositions) {
      elements.push(this._wrapElement(true, this.props.elements[position], null, position));
    }

    if (this.props.buffer && this.props.elements.length > this.props.maxElements) {
      let firstPosition = this.state.visiblePositions[0] - 1;
      if (firstPosition < 0) {
        firstPosition = this.props.elements.length - 1;
      }

      elements.unshift(
        this._wrapElement(
          false,
          this.props.elements[firstPosition],
          this.props.orientation === SwipeGallery.HORIZONTAL ? 'left' : 'top',
          'first'
        )
      );

      let lastPosition = this.state.visiblePositions[this.state.visiblePositions.length - 1] + 1;
      if (lastPosition >= this.props.elements.length) {
        lastPosition = 0;
      }
      elements.push(
        this._wrapElement(
          false,
          this.props.elements[lastPosition],
          this.props.orientation === SwipeGallery.HORIZONTAL ? 'right' : 'bottom',
          'last'
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

  _canMove(type, position) {
    const { elements, maxElements, infinityGallery } = this.props;
    if (infinityGallery) {
      return true;
    }
    if (type === 'prev') {
      return !(position === 0);
    }
    return !(position === elements.length - maxElements);
  }

  _move(e, movePositions) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const position = this._calculatePosition(movePositions);

    this.setState({
      actualPosition: position,
      visiblePositions: this._getVisiblePositions(position),
      canMovePrev: this._canMove('prev', position),
      canMoveNext: this._canMove('next', position),
    }, () => {
      if (typeof this.props.onChangePosition === 'function') {
        this.props.onChangePosition(
          this.state.actualPosition,
          this.state.visiblePositions
        );
      }
    });
  }


  _isSwipeDisabled() {
    return (this.props.disableSwipe || this.props.elements.length <= this.props.maxElements);
  }

  _handleTouchStart(e) {
    if (this._isSwipeDisabled()) {
      return;
    }

    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    this.finishSwipe = false;
    this.movement.touchX = e.changedTouches[0].clientX;
    this.movement.touchY = e.changedTouches[0].clientY;
  }

  _handleTouchMove(e) {
    if (this._isSwipeDisabled()) {
      return;
    }

    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    if (!this.finishSwipe) {
      this.movement = this._calculateMove(e);
      this._moveSwipe(e);
    }
  }

  _handleTouchEnd(e) {
    if (this._isSwipeDisabled()) {
      return;
    }

    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    if (!this.finishSwipe) {
      this._finishSwipe(e);
    }
  }

  _finishSwipe(e) {
    if (this._isSwipeDisabled()) {
      return;
    }
    this.finishSwipe = true;
    let movePosition = 0;

    const moved = this.props.orientation === SwipeGallery.HORIZONTAL
                    ? this.movement.accumulatorX
                    : this.movement.accumulatorY;

    if (this.props.elements.length > this.props.maxElements) {
      if (moved < 0) {
        movePosition = SwipeGallery.NEXT;
      } else if (moved > 0) {
        movePosition = SwipeGallery.PREVIOUS;
      }

      if (movePosition) {
        this._move(e, movePosition);
      }
      this._resetMove();
      this._resetPosition();
    }
  }

  _resetPosition() {
    const nodes = this.refs.container.childNodes;
    const lastIndex = nodes.length - 1;
    for (let i = 0; i <= lastIndex; ++i) {
      nodes[i].style.top = '';
      nodes[i].style.left = '';
      nodes[i].style.right = '';
      nodes[i].style.bottom = '';
      nodes[i].style.transform = '';
      nodes[i].style.position = '';
      nodes[i].style.opacity = '';
    }
  }

  _moveSwipe(e) {
    const nodes = this.refs.container.childNodes;

    const quantityToMove = this.props.orientation === SwipeGallery.HORIZONTAL
                            ? this.movement.accumulatorX
                            : this.movement.accumulatorY;

    const newElementToView = quantityToMove > 0
      ? nodes[0]
      : nodes[nodes.length - 1];

    const newElementSize = this.props.orientation === SwipeGallery.HORIZONTAL
      ? newElementToView.offsetWidth
      : newElementToView.offsetHeight;

    if (this.props.buffer) {
      newElementToView.style.transform = 'initial';
      newElementToView.style.opacity =
        Math.abs(quantityToMove / newElementSize);
    }

    const pxToMove = `${quantityToMove}px`;
    const lastIndex = nodes.length - 1;
    for (let i = 0; i <= lastIndex; ++i) {
      if (this.props.orientation === SwipeGallery.HORIZONTAL) {
        if (nodes[i] === newElementToView) {
          if (i === 0) {
            nodes[i].style.left = `${(-newElementSize + quantityToMove)}px`;
            nodes[i].style.right = '';
          } else {
            if (this.props.buffer) {
              nodes[i].style.right = `${-(newElementSize + quantityToMove)}px`;
              nodes[i].style.left = '';
            } else {
              nodes[i].style.left = `${(quantityToMove)}px`;
            }
          }
        } else {
          nodes[i].style.left = pxToMove;
        }
      } else {
        if (nodes[i] === newElementToView) {
          if (i === 0) {
            nodes[i].style.top = `${(-newElementSize + quantityToMove)}px`;
          } else {
            if (this.props.buffer) {
              nodes[i].style.bottom = `${-(newElementSize + quantityToMove)}px`;
              nodes[i].style.top = '';
            } else {
              nodes[i].style.top = `${(quantityToMove)}px`;
            }
          }
        } else {
          nodes[i].style.top = pxToMove;
        }
      }
    }

    if (this.props.buffer) {
      if (newElementSize < Math.abs(quantityToMove)) {
        this._finishSwipe(e);
      }
    }
  }


  _calculateMove(e) {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const moveX = touchX - this.movement.touchX;
    const moveY = touchY - this.movement.touchY;
    let accumulatorX = 0;
    let accumulatorY = 0;
    if (
      (moveX > 0 && this.state.canMovePrev) ||
      (moveX < 0 && this.state.canMoveNext)
    ) {
      accumulatorX = this.movement.accumulatorX + moveX;
    }

    if (
      (moveY > 0 && this.state.canMovePrev) ||
      (moveY < 0 && this.state.canMoveNext)
    ) {
      accumulatorY = this.movement.accumulatorY + moveY;
    }

    return {
      touchX,
      touchY,
      moveX,
      moveY,
      accumulatorX,
      accumulatorY,
    };
  }

  _showArrow(type) {
    const {
      hideArrows,
      hideArrowWithNoElements,
      infinityGallery,
      elements,
      maxElements,
    } = this.props;

    if (hideArrows) {
      return false;
    }
    if (hideArrowWithNoElements
      && elements.length <= maxElements && hideArrowWithNoElements
    ) {
      return false;
    }
    if (infinityGallery) {
      return true;
    }
    if (type === 'prev') {
      return this.state.canMovePrev;
    }
    return this.state.canMoveNext;
  }

  render() {
    const {
      orientation,
      className,
      customStyles,
      arrows,
    } = this.props;

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
      <div
        className = {swipeGalleryClasses}
        onTouchStart={(e) => this._handleTouchStart(e)}
        onTouchMove={(e) => this._handleTouchMove(e)}
        onTouchEnd={(e) => this._handleTouchEnd(e)}
        style={customStyles}
      >
        { this._showArrow('prev')
          &&
          <div
            className={arrowClassesLeft}
            onClick={(e) => {
              this._move(e, -1);
            }}
          >
            <div>{arrows.prev}</div>
          </div>
        }
        <div
          ref="container"
          className={'SwipeGallery-container'}
        >
          {this._getVisibleElements()}

        </div>
        {
          this._showArrow('next')
          &&
          <div
            className = {arrowClassesRight}
            onClick={(e) => {
              this._move(e, 1);
            }}
          >
            <div>{arrows.next}</div>
          </div>
        }
      </div>
    );
  }
}
