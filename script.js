var imageCanvas, ctx1;
var textCanvas, ctx2;

var savedImage, savedColor;
var useGradient = true;

var nameText = "";
var skillText = "";
var tribeText = "";

jQuery(function() {
    $('#canvas-wrapper').on('dragover', handleDrag);
    $('#canvas-wrapper').on('drop', handleDrop);

    // background image
    imageCanvas = document.getElementById('image-canvas');
    imageCanvas.width = 1920;
    imageCanvas.height = 1080;
    ctx1 = imageCanvas.getContext('2d');

    // text overlay
    textCanvas = document.getElementById('text-canvas');
    textCanvas.width = 1920;
    textCanvas.height = 1080;
    ctx2 = textCanvas.getContext('2d');

    $('#image-chooser').on('change', handleChoose);

    // form
    $('#name').on('keyup', modifyName);
    $('#skill').on('keyup', modifySkill);
    $('#tribe').on('keyup', modifyTribe);

    selectColor();
    $('#color').simplecolorpicker().on('change', selectColor);
    $('#hex-color').on('input', handleHexColor);
    $('#gradient').on('change', handleGradient);

    $('#download').on('click', handleDownload);
    $('#textonly').on('click', handleTextOnly);

    // force load font for testing
    setTimeout(function() {
        updateText();
    }, 100);
});

// MARK: - image handling

function handleDrag(e) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handleImage(e.originalEvent.dataTransfer.files[0]);
}

function handleChoose(e) {
    handleImage(e.target.files[0]);
}

function handleImage(file) {
    if (file.type.match(/image.*/)) {
        let reader = new FileReader();
        reader.onload = function(event) {
            setImage(event.target.result);
        }
        reader.readAsDataURL(file);
    }
}

function setImage(newImage) {
    var img = new Image();
    img.onload = function() {
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        textCanvas.width = img.width;
        textCanvas.height = img.height;

        ctx1.drawImage(img, 0, 0);
        $('#canvas-wrapper').css("border", "none");
        updateText();
    }
    savedImage = newImage;
    img.src = savedImage;
}

// MARK: - input handling

function modifyName(e) {
    nameText = e.target.value.trim().toUpperCase();
    updateText();
}

function modifySkill(e) {
    skillText = e.target.value.trim().toUpperCase();
    updateText();
}

function modifyTribe(e) {
    tribeText = e.target.value.trim().toUpperCase();
    updateText();
}

function selectColor() {
    let color = $('#color').val();
    $('#hex-color').val(color);
    modifyColor(color);
}

function handleHexColor() {
    var color = $('#hex-color').val();
    color = color.replace('#', '');

    if (!color.trim()) {
        selectColor(); // revert to color picker selection
    } else if (isHexColor(color)) {
        deselectColor();
        modifyColor(color);
    }
}

function deselectColor() {
    let selectedColor = document.querySelector('span.color[data-selected]');
    if (selectedColor !== null) {
        selectedColor.removeAttribute('data-selected');
    }
}

function modifyColor(color) {
    if (!color.startsWith("#")) {
        color = "#" + color;
    }
    savedColor = color;
    updateText();
}

function handleGradient() {
    useGradient = $('#gradient').is(':checked')
    updateText();
}

// MARK: - text handling

function updateText() {
    // remove old text before redrawing
    ctx2.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    // calculate based on image dimensions
    let min = Math.min(textCanvas.width, textCanvas.height);
    let startX = (textCanvas.width - min) / 5 + ratio(100);

    // height from bottom
    let nameY = 100;
    let skillY = 100;
    let tribeY = 60;

    drawText(nameText, 45, startX, nameY);
    let xOffset = ctx2.measureText(nameText).width + ratio(25); // to place after name
    drawText(skillText, 27, startX + xOffset, skillY);
    drawText(tribeText, 29, startX + ratio(2), tribeY);
}

function drawText(text, size, x, yOffset) {
    let y = textCanvas.height - ratio(yOffset);

    ctx2.font = getFont(size);
    ctx2.shadowColor = "black";
    ctx2.shadowOffsetX = ratio(4);
    ctx2.shadowOffsetY = ratio(3);
    ctx2.shadowBlur = ratio(4);

    var gradient = ctx2.createLinearGradient(0, y - ratio(size), 0, y);
    gradient.addColorStop(0, derivedHexColor(savedColor, 100));
    gradient.addColorStop(0.5, savedColor);
    gradient.addColorStop(1, derivedHexColor(savedColor, 100));
    ctx2.fillStyle = (useGradient) ? gradient : savedColor;

    ctx2.fillText(text, x, y);

}

function ratio(num) {
    let min = Math.min(textCanvas.width, textCanvas.height);
    return num * (min / 560); // arbitrary value
}

function getFont(size) {
    return ratio(size) + 'px CutamondBasic';
}

// MARK: - download handling

function handleTextOnly(e) {
    e.stopPropagation();
    e.preventDefault();

    handleDownload(e, true); // textOnly = true
}

function handleDownload(e, textOnly) {
    e.stopPropagation();
    e.preventDefault();

    var link = document.createElement('a');
    let fileName = (!nameText) ? 'blank' : nameText.toLowerCase();
    link.download = fileName + '.png';
    if (textOnly) {
        link.href = textCanvas.toDataURL();
    } else {
        link.href = combinedCanvasDataURL();
    }
    link.click();
}

function combinedCanvasDataURL() {
    let combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = imageCanvas.width;
    combinedCanvas.height = imageCanvas.height;

    let ctx3 = combinedCanvas.getContext('2d');
    ctx3.drawImage(imageCanvas, 0, 0);
    ctx3.drawImage(textCanvas, 0, 0);

    return combinedCanvas.toDataURL();
}

// MARK: - color helpers

function isHexColor(hex) {
    return typeof hex === 'string' &&
        hex.length === 6 &&
        !isNaN(Number('0x' + hex))
}

function derivedHexColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}