// screen
const sc = document.getElementById('screen');
const cxt = sc.getContext('2d', { alpha: false, willReadFrequently: true });

// elements
const fileInp = document.getElementById('fileInp');
const genBtn = document.getElementById('genBtn');
const vdo = document.getElementById('vdo');
const dimx = document.getElementById('dimx');
const dimy = document.getElementById('dimy');
const inpType1 = document.getElementById('inpType1');
const asciiType1 = document.getElementById('asciiType1');
const colorPickerWrapper = document.getElementById('colorPickerWrapper');
const asciiOutput = document.getElementById('asciiOutput');

// global variables
let asciiChars = ['Ñ', '@', '#', 'W', '$', '9', '8', '7', '6', '5', '3', '2', '1', '0', '?', '!', 'a', 'b', 'c', ';', ':', '+', '=', '-', ',', '.', '_'];
let asciiImg = asciiImgBW;
let processVideo = () => { };
let intId = null;

// Not sure if this optimisation really provides performance boost, but I'm leaving it here for now
// fast round in js from https://gist.github.com/Olical/1162452
// Math.round = function(x) {
//     return (x + 0.5) << 0;
// };

// file input handler and image processing initiator
function fileInput() {
    const file = fileInp.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => imageOnLoad(img);
    }
}

// image processor
function imageOnLoad(img) {
    if (+dimx.value > 0 && +dimy.value > 0) {
        sc.width = +dimx.value;
        sc.height = +dimy.value;
        cxt.drawImage(img, 0, 0, sc.width, sc.height);
    }
    else {
        sc.width = img.width;
        sc.height = img.height;
        cxt.drawImage(img, 0, 0);
    }

    const data = cxt.getImageData(0, 0, sc.width, sc.height);
    const ascii = asciiImg(data);
    asciiOutput.innerHTML = ascii;
}

// handler for B/W ascii art
function asciiImgBW(imgData) {
    asciiOutput.style.fontSize = Math.max((window.innerWidth / imgData.width) * 1.6, 3) + 'px';
    let ascii = '';
    for (let i = 0; i < imgData.data.length; i += 4) {
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];

        const brightness = Math.round((r + g + b) / 3 / 255 * (asciiChars.length - 1));
        ascii += asciiChars[brightness];
        if ((i / 4 + 1) % imgData.width == 0) ascii += '\n';
    }
    return ascii;
}

// handler for colored ascii art uses <span> CSS colors to color the ascii art
function asciiImgColored(imgData) {
    asciiOutput.style.fontSize = Math.max((window.innerWidth / imgData.width) * 1.6, 3) + 'px';
    let ascii = '';
    for (let i = 0; i < imgData.data.length; i += 4) {
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];

        const brightness = Math.round((r + g + b) / 3 / 255 * (asciiChars.length - 1));
        ascii += `<span style='color: rgb(${r}, ${g}, ${b});'>${asciiChars[brightness]}</span>`;
        if ((i / 4 + 1) % imgData.width == 0) ascii += '\n';
    }
    return ascii;
}

// video process callback
function processVideoSrc() {
    cxt.drawImage(vdo, 0, 0, sc.width, sc.height);
    const data = cxt.getImageData(0, 0, sc.width, sc.height);
    asciiOutput.innerHTML = asciiImg(data);
    requestAnimationFrame(processVideo);
}

// change handlers --------------

function changedInputMode() {
    if (inpType1.checked) {
        fileInp.disabled = false;
        genBtn.disabled = false;

        processVideo = () => { };

        if (intId !== null) {
            clearInterval(intId);
        }
    }
    else {
        fileInp.disabled = true;
        genBtn.disabled = true;

        processVideo = processVideoSrc;
        sc.width = +dimx.value == 0 ? document.body.clientWidth - 10 : +dimx.value;
        sc.height = +dimy.value == 0 ? 3 / 4 * (document.body.clientWidth - 10) : +dimy.value;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                vdo.srcObject = stream;
                vdo.play();

                processVideo();
            }).catch(err => {
                console.error(err);
                alert("[Media Error] Failed to capture video\n" + err.toString());
            });
    }
}

function changedAsciiMode() {
    if (asciiType1.checked) {
        asciiImg = asciiImgBW;
    }
    else {
        asciiImg = asciiImgColored;
    }
}

// handy function for invert hex color codes (performing XOR inversion here this suits my purpose)
function invertHexColor(hex) {
    return '#' + (Number(`0x1${hex.substring(1)}`) ^ 0xFFFFFF).toString(16).substring(1).toUpperCase();
}

function changedColor(elem) {
    asciiOutput.style.backgroundColor = elem.value;
    colorPickerWrapper.style.backgroundColor = elem.value;
    colorPickerWrapper.style.color = invertHexColor(elem.value);
}

changedColor(colorPickerWrapper.children[0]);

function changedAsciiMap(elem) {
    asciiChars = elem.value.split('');
}