import "../styles/reset.css";
import "../styles/global.css";
import "../styles/index.css";
import "../styles/fonts.css";
import handleResize from "./utils/resize";
import "./utils/images";
import {
  ballHitTheSpot,
  clickStartBtnAnimation,
  handAnimation,
  startBtnAnimation,
} from "./utils/animation";

export class Playable {
  constructor() {
    // super();
    // this.startApp = startApp;
    // this?.startApp();
    this.ball = document.querySelector(".ball");
    this.wrapperContent = document.querySelector(".scalable-wrapper__content");
    this.field = document.querySelector(".strength-field");
    this.yellow = document.querySelector(".yellow");
    this.green = document.querySelector(".green");
    this.red = document.querySelector(".red");
    this.startBtn = document.querySelector(".start");
    this.hand = document.querySelector(".hand");

    this.collisions = document.querySelectorAll(".collision");

    this.degree = 0;
    this.yVale = 0;
    this.xValue = 0;
    this.yValueLeft = 0;
    this.xValueLeft = 0;
    this.hitCollision = false;
    this.hitTheHole = false;
    this.fromBallToPointX = 0;
    this.fromBallToPointY = 0;

    this.DIRECTION_ENUM = {
      LEFT: "left",
      RIGHT: "right",
      TOP: "top",
      BOTTOM: "bottom",
    };

    this.__onStartBtnListener = this.__onStartBtnListener.bind(this);
    this.__onPointerDown = this.__onPointerDown.bind(this);
    this.__onPointerMove = this.__onPointerMove.bind(this);
    this.__onPointerUp = this.__onPointerUp.bind(this);
    this.animate = this.animate.bind(this);
    this.ballMovement = this.ballMovement.bind(this);
    this.moveBall = this.moveBall.bind(this);
    this.doRicochet = this.doRicochet.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
    this.changeDirectionCalculation =
      this.changeDirectionCalculation.bind(this);

    this.startApp();
  }

  calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
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

  startApp() {
    handleResize();
    startBtnAnimation();
    this.preventDefaultTouchEvents();
    this.startBtn.addEventListener("pointerdown", this.__onStartBtnListener);
  }

  stretchAndRotateField(pageX, pageY) {
    const { x, y } = this.ball.getBoundingClientRect();
    const { offsetLeft, offsetTop, scale } = this.wrapperContent.dataset;

    this.fromBallToPointX =
      pageX -
      this.ball.offsetLeft * scale -
      (this.ball.width / 2) * scale -
      offsetLeft * scale;
    this.fromBallToPointY =
      pageY -
      this.ball.offsetTop * scale -
      (this.ball.height / 2) * scale -
      offsetTop * scale;

    const distance = Math.hypot(
      pageX / scale - x / scale,
      pageY / scale - y / scale
    );

    this.yellow.style.height = distance + "px";
    this.green.style.height = distance + "px";
    this.red.style.height = distance + "px";

    this.degree =
      this.calcAngleDegrees(this.fromBallToPointX, this.fromBallToPointY) - 90;

    this.field.style.transform = "rotate(" + this.degree + "deg)";
  }

  async __onStartBtnListener(event) {
    handAnimation();
    await clickStartBtnAnimation();
    this.hand.classList.remove("hidden");
    this.startBtn.remove();
    this.__addBallListeners();
  }

  __addBallListeners() {
    return new Promise((res) => {
      this.ball.addEventListener("pointerdown", this.__onPointerDown);
      res();
    });
  }

  __onPointerDown(event) {
    if (this.hand) {
      this.hand.remove();
    }
    this.ball.addEventListener("pointermove", this.__onPointerMove);
    this.ball.addEventListener("pointerup", this.__onPointerUp);
  }

  __onPointerMove(event) {
    this.stretchAndRotateField(event.pageX, event.pageY);
  }

  async __onPointerUp(event) {
    this.ball.removeEventListener("pointermove", this.__onPointerMove);
    this.ball.removeEventListener("pointerdown", this.__onPointerDown);
    this.ball.removeEventListener("pointerup", this.__onPointerUp);

    this.yellow.style.height = 0 + "px";
    this.green.style.height = 0 + "px";
    this.red.style.height = 0 + "px";

    await this.ballMovement();
  }

  __getBallCoords() {
    const ballLeft = Number(getComputedStyle(this.ball).left.split("px")[0]);
    const ballTop = Number(getComputedStyle(this.ball).top.split("px")[0]);
    return { ballLeft, ballTop };
  }

  __setFieldCoords() {
    return new Promise((res) => {
      const { scale } = this.wrapperContent.dataset;

      this.field.style.top = this.__getBallCoords().ballTop + 30 + "px";
      this.field.style.left =
        this.__getBallCoords().ballLeft -
        this.field.offsetWidth / 2 +
        this.ball.offsetWidth / 2 +
        "px";
      res();
    });
  }

  async __setBallCoords() {
    const { offsetLeft, offsetTop, scale } = this.wrapperContent.dataset;
    return new Promise(async (res) => {
      this.ball.style.left =
        this.ball.getBoundingClientRect().left / scale - offsetLeft + "px";
      this.ball.style.top =
        this.ball.getBoundingClientRect().top / scale - offsetTop + "px";

      this.ball.style.transform =
        "rotate(180deg)" +
        "translateY(" +
        0 +
        "px)" +
        "translateY(" +
        0 +
        "px)";
      await this.__setFieldCoords();
      res();
    });
  }

  async doRicochet() {
    if (this.hitCollision) {
      if (this.hitTheHole) {
        this.__setBallCoords();
        ballHitTheSpot();
      }
      this.hitCollision = false;
      this.__setBallCoords();
      await this.moveBall();
      await this.__addBallListeners();
    } else {
      this.__setBallCoords();
      await this.__addBallListeners();
    }
  }

  async ballMovement() {
    const doRicochet = this.doRicochet;
    await this.moveBall().then(async function () {
      return new Promise(async (res) => {
        await doRicochet().then(async function () {
          await doRicochet().then(async function () {
            await doRicochet();
          });
        });
        res();
      });
    });
  }

  animate({ duration, timing, draw }) {
    return new Promise((res) => {
      let start = performance.now();

      const hitCollision = this.hitCollision;
      const hitTheHole = this.hitTheHole;

      requestAnimationFrame(function animate(time) {
        // timeFraction от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) {
          timeFraction = 1;
          res();
        }

        // текущее состояние анимации
        let progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
          const anim = requestAnimationFrame(animate);
          if (hitCollision) {
            cancelAnimationFrame(anim);
            res();
          }

          if (hitTheHole) {
            cancelAnimationFrame(anim);
            res();
          }
        }
      });
    });
  }

  changeDirectionCalculation(directionEnum) {
    switch (directionEnum) {
      case this.DIRECTION_ENUM.LEFT: {
        this.xValue *= -1;
        break;
      }
      case this.DIRECTION_ENUM.RIGHT: {
        this.xValue *= -1;
        break;
      }
      case this.DIRECTION_ENUM.TOP: {
        this.yValue *= -1;
        break;
      }
      case this.DIRECTION_ENUM.BOTTOM: {
        this.yValue *= -1;
        break;
      }
      default: {
        break;
      }
    }
  }

  moveBall() {
    const ball = this.ball;

    return new Promise(async (res) => {
      const { offsetLeft, offsetTop, scale } = this.wrapperContent.dataset;
      const wrapperHeight =
        this.wrapperContent.getBoundingClientRect().height / scale;

      if (this.yValueLeft === 0 && this.xValueLeft === 0) {
        this.yValue = (this.fromBallToPointY / scale) * 2.5;
        this.xValue = (this.fromBallToPointX / scale) * 2.5;

        if (this.yValue > 900) {
          this.yValue = 900;
        }
        if (this.yValue < -900) {
          this.yValue = -900;
        }
        if (this.xValue > 900) {
          this.xValue = 900;
        }
        if (this.xValue < -900) {
          this.xValue = -900;
        }
      }

      let yValue = this.yValue;
      let xValue = this.xValue;

      let yValueLeft = this.yValueLeft;
      let xValueLeft = this.xValueLeft;

      let hitCollision = this.hitCollision;
      let hitTheHole = this.hitTheHole;

      const DIRECTION_ENUM = this.DIRECTION_ENUM;

      const collisions = this.collisions;

      const checkCollision = this.checkCollision;
      const changeDirectionCalculation = this.changeDirectionCalculation;
      await this.animate({
        duration: 1500,
        timing: function (timeFraction) {
          return Math.sin(Math.acos(1 - timeFraction));
        },
        draw: function (progress) {
          ball.style.transform =
            "rotate(180deg)" +
            "translateY(" +
            progress * yValue +
            "px)" +
            "translateX(" +
            progress * xValue +
            "px)";

          yValueLeft = yValue - progress * yValue;
          xValueLeft = xValue - progress * xValue;

          const hit = [...collisions].reduce((acc, el) => {
            const { collision, target } = checkCollision(el, ball);
            if (collision) {
              acc.collision = collision;
              acc.target = target;
            }
            return acc;
          }, {});

          if (hit.collision) {
            hitCollision = true;
            if (hit.target[0] === "hole-collision") {
              hitTheHole = true;
            }
            if (
              hit.target[0] === "boarder2" ||
              hit.target[0] === "left-collision"
            ) {
              yValue = yValueLeft;
              xValue = xValueLeft;
              changeDirectionCalculation(DIRECTION_ENUM.LEFT);
            }
            if (
              hit.target[0] === "boarder1" ||
              hit.target[0] === "right-collision"
            ) {
              yValue = yValueLeft;
              xValue = xValueLeft;
              changeDirectionCalculation(DIRECTION_ENUM.RIGHT);
            }
            if (
              hit.target[0] === "boarder4" ||
              hit.target[0] === "top-collision"
            ) {
              yValue = yValueLeft;
              xValue = xValueLeft;
              changeDirectionCalculation(DIRECTION_ENUM.TOP);
            }
            if (
              hit.target[0] === "boarder3" ||
              hit.target[0] === "bottom-collision"
            ) {
              yValue = yValueLeft;
              xValue = xValueLeft;
              changeDirectionCalculation(DIRECTION_ENUM.BOTTOM);
            }
          }
        },
      });
      this.__setBallCoords();
      this.yValue = yValue;
      this.xValue = xValue;

      this.yValueLeft = yValueLeft;
      this.xValueLeft = xValueLeft;

      this.hitCollision = hitCollision;
      this.hitTheHole = hitTheHole;
      console.log(this.yVale);
      res();
    });
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
}
