import backgroundColor from "../../assets/Desert/Background.png";
import board from "../../assets/Desert/Board.png";
import stone1 from "../../assets/Desert/Stone.png";
import stone2 from "../../assets/Desert/Stone2.png";
import stone3 from "../../assets/Desert/Stones.png";
import stone4 from "../../assets/Desert/Stones2.png";

import cactus1 from "../../assets/Desert/Cactus.png";
import cactus2 from "../../assets/Desert/Cactus_2.png";

import infoPanel from "../../assets/Desert/Upper_Bar.png";

import hole from "../../assets/Desert/Hole.png";
import ball from "../../assets/Desert/Ball.png";
import start from "../../assets/Desert/START.png";

import hand from "../../assets/Desert/Hand.png";

function setSource(elem, source) {
  elem.src = elem.src || source;
}

setSource(document.querySelector(".background-color"), backgroundColor);
setSource(document.querySelector(".board"), board);
setSource(document.querySelector(".cactus1"), cactus1);
setSource(document.querySelector(".cactus2"), cactus2);

const stoneImgs = [stone1, stone2, stone3, stone4];
document.querySelectorAll(".stone").forEach((el, index) => {
  setSource(el, stoneImgs[index]);
});

setSource(document.querySelector(".info-board"), infoPanel);

setSource(document.querySelector(".pg-cactus1"), cactus1);
setSource(document.querySelector(".pg-cactus2"), cactus2);
setSource(document.querySelector(".pg-cactus3"), cactus1);

setSource(document.querySelector(".start"), start);
setSource(document.querySelector(".hole-img"), hole);

setSource(document.querySelector(".ball"), ball);

setSource(document.querySelector(".hand"), hand);
