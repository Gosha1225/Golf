import anime from "animejs";

export function finalScreenAnimation() {
  anime({
    targets: ".final-screen",
    top: "0px",
    duration: 900,
    delay: 2000,
    easing: "easeInOutQuart",
  });
}

export function downloadBtnAnimation() {
  anime({
    targets: ".download",
    scale: [
      { value: 1 },
      { value: 1.05, duration: 2000 },
      { value: 1, duration: 2000 },
    ],
    loop: true,
    easing: "linear",
  });
}

export function startBtnAnimation() {
  anime({
    targets: ".start",
    scale: [
      { value: 1.05, duration: 700 },
      { value: 1, duration: 700 },
    ],
    loop: true,
    easing: "easeInOutQuart",
  });
}

export function clickStartBtnAnimation() {
  return new Promise((res) => {
    anime({
      targets: ".start",
      complete: res,
      scale: 0.5,
      duration: 150,
      easing: "easeInOutQuart",
    });
  });
}

export function handAnimation() {
  anime({
    targets: ".hand",
    delay: 500,
    duration: 1000,
    top: "1800px",
    easing: "linear",
    loop: true,
  });
}

export function ballHitTheSpot() {
  const ball = document.querySelector(".ball");
  const hole = document.querySelector(".hole-collision");
  const wrapperContent = document.querySelector(".scalable-wrapper__content");
  const { offsetLeft, offsetTop, scale } = wrapperContent.dataset;
  anime({
    targets: ball,
    top: [
      { value: ball.getBoundingClientRect().top / scale - offsetTop + "px" },
      {
        value:
          hole.getBoundingClientRect().top / scale -
          hole.getBoundingClientRect().height / scale / 2 -
          // ball.getBoundingClientRect().height / scale / 2 -
          offsetTop +
          "px",
        duration: 500,
      },
    ],
    left: [
      { value: ball.getBoundingClientRect().left / scale - offsetLeft + "px" },
      {
        value:
          hole.getBoundingClientRect().left / scale -
          hole.getBoundingClientRect().width / scale / 2 -
          // ball.getBoundingClientRect().width / scale / 2 -
          offsetLeft +
          "px",
        duration: 500,
      },
    ],
    scale: [{ value: 0, duration: 500 }],
    easing: "linear",
  });
}
