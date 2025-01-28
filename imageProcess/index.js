const sc = document.getElementById('screen');
const cxt = sc.getContext('2d', { alpha: false, willReadFrequently: true });

const fileInp = document.getElementById('fileInp');
const img = document.getElementById('img');

const grayscaleRadio = document.getElementById('grayscale');

const kernelElem = document.getElementById('kernel');

const kernelInputs = [...kernelElem.children[0].children].map(e => [...e.children].map(f => f.firstChild));

function processFile() {
    const file = fileInp.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
        img.src = reader.result;
        img.onload = imageHandler;
    };
}

function imageHandler() {
    sc.width = img.width;
    sc.height = img.height;
    cxt.drawImage(img, 0, 0, img.width, img.height);
    const imgData = cxt.getImageData(0, 0, sc.width, sc.height);
    const output = imageProcess(imgData);
    imgData.data.set(output);
    cxt.putImageData(imgData, 0, 0);
};

function getKernel() {
    return kernelInputs.map(e => e.map(f => parseFloat(f.value)));
}

let imageProcess = imageProcessRGB;

function imageProcessRGB(imgData) {
    const kernel = getKernel();
    const output = new Uint8ClampedArray(imgData.data.length);
    for (let i = 1; i < imgData.height - 1; i++) {
        for (let j = 1; j < imgData.width - 1; j++) {
            const [r, g, b] = applyKernelRGB(imgData, i, j, kernel);
            output[(i * imgData.width + j) * 4] = r;
            output[(i * imgData.width + j) * 4 + 1] = g;
            output[(i * imgData.width + j) * 4 + 2] = b;
            output[(i * imgData.width + j) * 4 + 3] = 255;
        }
    }

    return output;
}

function applyKernelRGB(imgData, i, j, kernel) {
    let sumr = 0;
    let sumg = 0;
    let sumb = 0;
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            const index = ((i + k) * imgData.width + j + l) * 4;
            sumr += imgData.data[index] * kernel[k + 1][l + 1];
            sumg += imgData.data[index + 1] * kernel[k + 1][l + 1];
            sumb += imgData.data[index + 2] * kernel[k + 1][l + 1];
        }
    }

    return [sumr, sumg, sumb];
}

function imageProcessGray(imgData) {
    const kernel = getKernel();
    const output = new Uint8ClampedArray(imgData.data.length);
    for (let i = 1; i < imgData.height - 1; i++) {
        for (let j = 1; j < imgData.width - 1; j++) {
            const color = applyKernelGray(imgData, i, j, kernel);
            output[(i * imgData.width + j) * 4] = color;
            output[(i * imgData.width + j) * 4 + 1] = color;
            output[(i * imgData.width + j) * 4 + 2] = color;
            output[(i * imgData.width + j) * 4 + 3] = 255;
        }
    }

    return output;
}

function applyKernelGray(imgData, i, j, kernel) {
    let sum = 0;
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            const index = ((i + k) * imgData.width + j + l) * 4;
            const gray = (imgData.data[index] + imgData.data[index + 1] + imgData.data[index + 2]) / 3;
            sum += gray * kernel[k + 1][l + 1];
        }
    }

    return sum;
}

function setAsSource() {
    img.src = sc.toDataURL();
}

function rerunWithSetAsSource() {
    setAsSource();
    imageHandler();
}

function changedMode() {
    if (grayscaleRadio.checked) {
        imageProcess = imageProcessGray;
    }
    else {
        imageProcess = imageProcessRGB;
    }
}

function downloadImage(elem) {
    elem.href = sc.toDataURL();
}

const kernelTypes = [
    [
        [0.0625, 0.125, 0.0625],
        [0.125, 0.25, 0.125],
        [0.0625, 0.125, 0.0625]
    ],
    [
        [0.11, 0.11, 0.11],
        [0.11, 0.11, 0.11],
        [0.11, 0.11, 0.11]
    ],
    [
        [0, -1, 0],
        [-1, 4, -1],
        [0, -1, 0]
    ],
    [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
    ],
    [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ],
    [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
    ],
    [
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1]
    ],
    [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ],
    [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1]
    ],
    [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ],
];

function changedKernel(elem) {
    const kernel = kernelTypes[elem.selectedIndex];
    kernelInputs.forEach((e, i) => e.forEach((f, j) => f.value = f.value = kernel[i][j]));
}