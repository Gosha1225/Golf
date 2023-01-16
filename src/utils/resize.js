const wrapper = document.getElementById("scalable-wrapper");
const wrapperContent = document.getElementById("scalable-wrapper__content");
const elHeight = wrapperContent.offsetHeight;
const elWidth = wrapperContent.offsetWidth;

function handleResize() {
  const scale = Math.min(
    wrapper.offsetWidth / elWidth,
    wrapper.offsetHeight / elHeight
  );
  wrapperContent.style.transform = `translate(-50%, -50%) scale(${scale})`;
  const { left, top } = wrapperContent.getBoundingClientRect();
  wrapperContent.dataset.scale = scale;
  wrapperContent.dataset.offsetTop = top / scale;
  wrapperContent.dataset.offsetLeft = left / scale;
}

export default handleResize;
