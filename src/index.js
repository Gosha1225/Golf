// import { Playable } from "./Playable";

// const playable = new Playable();

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

const ball = document.querySelector(".ball");
const wrapperContent = document.querySelector(".scalable-wrapper__content");
const field = document.querySelector(".strength-field");
const yellow = document.querySelector(".yellow");
const green = document.querySelector(".green");
const red = document.querySelector(".red");
const startBtn = document.querySelector(".start");
const hand = document.querySelector(".hand");

const collisions = document.querySelectorAll(".collision");

let degree = 0;
let yValue = 0;
let xValue = 0;
let yValueLeft = 0;
let xValueLeft = 0;
let hitCollision = false;
let hitTheHole = false;
let fromBallToPointX = 0;
let fromBallToPointY = 0;

const DIRECTION_ENUM = {
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
};

startApp();

const path = getComputedStyle(document.querySelector(".path")).d;
const svg = document.querySelector(".svg");

console.dir(path);
console.dir(svg);

function calcAngleDegrees(x, y) {
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function preventDefaultTouchEvents() {
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

function startApp() {
  handleResize();
  startBtnAnimation();
  preventDefaultTouchEvents();
  startBtn.addEventListener("pointerdown", __onStartBtnListener);
}

function stretchAndRotateField(pageX, pageY) {
  const { x, y } = ball.getBoundingClientRect();
  const { offsetLeft, offsetTop, scale } = wrapperContent.dataset;

  fromBallToPointX =
    pageX -
    ball.offsetLeft * scale -
    (ball.width / 2) * scale -
    offsetLeft * scale;
  fromBallToPointY =
    pageY -
    ball.offsetTop * scale -
    (ball.height / 2) * scale -
    offsetTop * scale;

  const distance = Math.hypot(
    pageX / scale - x / scale,
    pageY / scale - y / scale
  );

  yellow.style.height = distance + "px";
  green.style.height = distance + "px";
  red.style.height = distance + "px";

  degree = calcAngleDegrees(fromBallToPointX, fromBallToPointY) - 90;

  field.style.transform = "rotate(" + degree + "deg)";
}

async function __onStartBtnListener(event) {
  handAnimation();
  await clickStartBtnAnimation();
  hand.classList.remove("hidden");
  startBtn.remove();
  __addBallListeners();
}

function __addBallListeners() {
  return new Promise((res) => {
    ball.addEventListener("pointerdown", __onPointerDown);
    res();
  });
}

function __onPointerDown(event) {
  if (hand) {
    hand.remove();
  }
  ball.addEventListener("pointermove", __onPointerMove);
  ball.addEventListener("pointerup", __onPointerUp);
}

function __onPointerMove(event) {
  stretchAndRotateField(event.pageX, event.pageY);
}

async function __onPointerUp(event) {
  ball.removeEventListener("pointermove", __onPointerMove);
  ball.removeEventListener("pointerdown", __onPointerDown);
  ball.removeEventListener("pointerup", __onPointerUp);

  yellow.style.height = 0 + "px";
  green.style.height = 0 + "px";
  red.style.height = 0 + "px";

  await ballMovement();
}

function __getBallCoords() {
  const ballLeft = Number(getComputedStyle(ball).left.split("px")[0]);
  const ballTop = Number(getComputedStyle(ball).top.split("px")[0]);
  return { ballLeft, ballTop };
}

function __setFieldCoords() {
  return new Promise((res) => {
    const { scale } = wrapperContent.dataset;

    field.style.top = __getBallCoords().ballTop + 30 + "px";
    field.style.left =
      __getBallCoords().ballLeft -
      field.offsetWidth / 2 +
      ball.offsetWidth / 2 +
      "px";
    res();
  });
}

async function __setBallCoords() {
  const { offsetLeft, offsetTop, scale } = wrapperContent.dataset;
  return new Promise(async (res) => {
    ball.style.left =
      ball.getBoundingClientRect().left / scale - offsetLeft + "px";
    ball.style.top =
      ball.getBoundingClientRect().top / scale - offsetTop + "px";

    ball.style.transform =
      "rotate(180deg)" + "translateY(" + 0 + "px)" + "translateY(" + 0 + "px)";
    await __setFieldCoords();
    res();
  });
}

async function doRicochet() {
  if (hitCollision) {
    if (hitTheHole) {
      __setBallCoords();
      ballHitTheSpot();
    }
    hitCollision = false;
    __setBallCoords();
    await moveBall();
    await __addBallListeners();
  } else {
    __setBallCoords();
    await __addBallListeners();
  }
}

async function ballMovement() {
  await moveBall().then(async function () {
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

function animate({ duration, timing, draw }) {
  return new Promise((res) => {
    let start = performance.now();

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

function changeDirectionCalculation(directionEnum) {
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

function moveBall() {
  console.log(1);
  return new Promise(async (res) => {
    const { offsetLeft, offsetTop, scale } = wrapperContent.dataset;
    const wrapperHeight = wrapperContent.getBoundingClientRect().height / scale;

    if (yValueLeft === 0 && xValueLeft === 0) {
      yValue = (fromBallToPointY / scale) * 2.5;
      xValue = (fromBallToPointX / scale) * 2.5;

      if (yValue > 900) {
        yValue = 900;
      }
      if (yValue < -900) {
        yValue = -900;
      }
      if (xValue > 900) {
        xValue = 900;
      }
      if (xValue < -900) {
        xValue = -900;
      }
    }

    await animate({
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
            console.log("left");
            yValue = yValueLeft;
            xValue = xValueLeft;
            changeDirectionCalculation(DIRECTION_ENUM.LEFT);
          }
          if (
            hit.target[0] === "boarder1" ||
            hit.target[0] === "right-collision"
          ) {
            console.log("right");
            yValue = yValueLeft;
            xValue = xValueLeft;
            changeDirectionCalculation(DIRECTION_ENUM.RIGHT);
          }
          if (
            hit.target[0] === "boarder4" ||
            hit.target[0] === "top-collision"
          ) {
            console.log("top");
            yValue = yValueLeft;
            xValue = xValueLeft;
            changeDirectionCalculation(DIRECTION_ENUM.TOP);
          }
          if (
            hit.target[0] === "boarder3" ||
            hit.target[0] === "bottom-collision"
          ) {
            console.log("bottom");
            yValue = yValueLeft;
            xValue = xValueLeft;
            changeDirectionCalculation(DIRECTION_ENUM.BOTTOM);
          }
        }
      },
    });
    __setBallCoords();
    res();
  });
}

function checkCollision(element, ball) {
  const { offsetLeft, offsetTop, scale } = wrapperContent.dataset;

  const element_width = element.getBoundingClientRect().width / scale;
  const ball_width = ball.getBoundingClientRect().width / scale;

  const element_height = element.getBoundingClientRect().height / scale;
  const ball_height = ball.getBoundingClientRect().height / scale;

  const x_pos_element =
    element.getBoundingClientRect().left / scale - offsetLeft;
  const y_pos_element = element.getBoundingClientRect().top / scale - offsetTop;

  const x_pos_ball = ball.getBoundingClientRect().left / scale - offsetLeft;
  const y_pos_ball = ball.getBoundingClientRect().top / scale - offsetTop;

  const leftPos = x_pos_element < x_pos_ball + ball_width / 2;
  const rightPos = x_pos_element + element_width > x_pos_ball + ball_width / 2;

  const topPos = y_pos_element < y_pos_ball + ball_height / 2;
  const bottomPos =
    y_pos_element + element_height > y_pos_ball + ball_height / 2;

  if (leftPos && rightPos && topPos && bottomPos) {
    return { collision: true, target: element.classList };
  }
  return { collision: false, target: "" };
}
