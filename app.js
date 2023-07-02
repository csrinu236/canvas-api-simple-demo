const canvasMain = document.querySelector('#canvasMain');
const canvasOverlay = document.querySelector('#canvasOverlay');
const canvasWrapper = document.querySelector('.canvasWrapper');
const radioButtons = document.querySelectorAll('input[type="radio"]');

const RECTANGLE = 'RECTANGLE';
const DRAW = 'DRAW';
let DRAW_TYPE = DRAW;
let STROKE_WIDTH = '1';
let STROKE_STYLE = 'black';

radioButtons.forEach((eachBtn) => {
  eachBtn.addEventListener('change', (e) => {
    // console.log(e.target.value);
    DRAW_TYPE = e.target.value;
  });
});

const canvasWrapperGBCR = canvasWrapper.getBoundingClientRect();
canvasMain.width = canvasOverlay.width = canvasWrapperGBCR.width;
canvasMain.height = canvasOverlay.height = canvasWrapperGBCR.height;

const canvasLeftOffSet = canvasWrapper.offsetLeft;
const canvasTopOffSet = canvasWrapper.offsetTop;

// getBoundingClientRect() is the ultimate thing that handles
// measurements of DOM instead of offsetTop or Left
const canvasGBCR = canvasOverlay.getBoundingClientRect();
// console.log(window.innerWidth - canvasGBCR.right);

const ctx = canvasOverlay.getContext('2d');
const ctxMain = canvasMain.getContext('2d');
ctx.lineWidth = ctxMain.lineWidth = '1';

const thicknessControl = document.querySelector('.thickness-control input');
thicknessControl.onchange = function (e) {
  if (e.target.value <= 0) {
    e.target.value = 1;
  } else if (e.target.value >= 50) {
    e.target.value = 50;
  }
  ctx.lineWidth = e.target.value;
  ctxMain.lineWidth = e.target.value;
};

const colorControl = document.querySelector('.color-control input');
colorControl.onchange = function (e) {
  //   console.log(e.target.value);
  ctx.strokeStyle = e.target.value;
  ctxMain.strokeStyle = e.target.value;
};

const eraseBtn = document.querySelector('.erase-btn');
eraseBtn.onclick = function (e) {
  //   ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
  ctxMain.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
};

// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(200, 100);
// ctx.moveTo(0, 0);

// ctx.lineTo(100, 150);

// ctx.rect(10, 20, 150, 100);
// ctx.strokeStyle = 'black';
// ctx.stroke();

let shouldPaint = false;
let startX; // with rect to entire viewport(mouse.clientX)
let startY;
let mouseX; // with respect to canvas
let mouseY;
let prevStartX = 0;
let prevStartY = 0;
let prevWidth = 0;
let prevHeight = 0;

canvasOverlay.addEventListener('mousedown', (e) => {
  // e.preventDefault();
  // e.stopPropagation();
  ctxMain.beginPath(); // resets last ending point
  ctx.beginPath(); // resets last ending point
  shouldPaint = true;

  if (DRAW_TYPE === RECTANGLE) {
    startX = e.clientX;
    startY = e.clientY;
    prevStartX = mouseX = startX - canvasLeftOffSet;
    prevStartY = mouseY = startY - canvasTopOffSet;
  }
});

canvasOverlay.addEventListener('mouseup', (e) => {
  e.preventDefault();
  e.stopPropagation();
  shouldPaint = false;

  if (DRAW_TYPE === RECTANGLE) {
    //   console.log({ prevStartX, prevStartY, prevWidth, prevHeight });
    ctxMain.strokeRect(prevStartX, prevStartY, prevWidth, prevHeight);
    ctxMain.strokeStyle = 'black';
    prevStartX = prevStartY = prevWidth = prevHeight = 0;
    //   console.log('MOUSE UP');
  }
});

canvasOverlay.addEventListener('mousemove', (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  if (!shouldPaint) {
    return;
  }
  console.log(e);

  if (DRAW_TYPE === DRAW) {
    ctxMain.lineTo(e.clientX - canvasLeftOffSet, e.clientY - canvasTopOffSet);
    ctxMain.stroke();
  } else if (DRAW_TYPE === RECTANGLE) {
    ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
    ctx.strokeRect(mouseX, mouseY, e.clientX - startX, e.clientY - startY);
    prevWidth = e.clientX - startX;
    prevHeight = e.clientY - startY;
  }
});
