export default class CalculationManager {
  constructor() {
    this.wrapperContent = document.querySelector(".scalable-wrapper__content");
    this.ball = document.querySelector(".ball");
  }

  calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  changeDirectionCalculation(directionEnum) {
    switch (directionEnum) {
      case DIRECTION_ENUM.LEFT: {
        xValue *= -1;
        break;
      }
      case DIRECTION_ENUM.RIGHT: {
        xValue *= -1;
        break;
      }
      case DIRECTION_ENUM.TOP: {
        yValue *= -1;
        break;
      }
      case DIRECTION_ENUM.BOTTOM: {
        yValue *= -1;
        break;
      }
      default: {
        break;
      }
    }
  }

  checkCollision(element, ball) {
    const { offsetLeft, offsetTop, scale } = this.wrapperContent.dataset;

    const element_width = element.getBoundingClientRect().width / scale;
    const ball_width = ball.getBoundingClientRect().width / scale;

    const element_height = element.getBoundingClientRect().height / scale;
    const ball_height = ball.getBoundingClientRect().height / scale;

    const x_pos_element =
      element.getBoundingClientRect().left / scale - offsetLeft;
    const y_pos_element =
      element.getBoundingClientRect().top / scale - offsetTop;

    const x_pos_ball = ball.getBoundingClientRect().left / scale - offsetLeft;
    const y_pos_ball = ball.getBoundingClientRect().top / scale - offsetTop;

    const leftPos = x_pos_element < x_pos_ball + ball_width / 2;
    const rightPos =
      x_pos_element + element_width > x_pos_ball + ball_width / 2;

    const topPos = y_pos_element < y_pos_ball + ball_height / 2;
    const bottomPos =
      y_pos_element + element_height > y_pos_ball + ball_height / 2;

    if (leftPos && rightPos && topPos && bottomPos) {
      return { collision: true, target: element.classList };
    }
    return { collision: false, target: "" };
  }

  preventDefaultTouchEvents() {
    window.addEventListener(
      "touchmove",
      (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      },
      { passive: false }
    );
    window.addEventListener(
      "touchstart",
      (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      },
      { passive: false }
    );
    window.addEventListener(
      "touchend",
      (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      },
      { passive: false }
    );
    window.addEventListener(
      "touchend",
      (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        ev.stopImmediatePropagation();
      },
      { passive: false }
    );
  }
}
