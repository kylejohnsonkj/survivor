var canvas,
    ctx,
    savedImage;

$(document).ready(function() {
    const imageLoader = document.getElementById('image-loader');
    imageLoader.addEventListener('change', handleImage, false);

    const nameInput = document.getElementById('name-input');
    nameInput.addEventListener('keyup', modifyName, false);

    const skillInput = document.getElementById('skill-input');
    skillInput.addEventListener('keyup', modifySkill, false);

    const tribeInput = document.getElementById('tribe-input');
    tribeInput.addEventListener('keyup', modifyTribe, false);

    canvas = document.getElementById('image-canvas');
    ctx = canvas.getContext('2d');
});

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        setImage(event.target.result, function() {});
    }
    reader.readAsDataURL(e.target.files[0]);
}

function setImage(e, callback) {
    var img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        console.log(canvas.width + " " + canvas.height);
        ctx.drawImage(img, 0, 0);
        callback();
    }
    savedImage = e;
    img.src = savedImage;
}

const big = 45;
const small = 25;
const baseWidth = 1000;

function getFont(fontSize) {
    var ratio = fontSize / baseWidth;
    var size = canvas.width * ratio;
    return (size | 0) + 'px CutamondBasic';
}

var nameText = "";
var skillText = "";
var tribeText = "";

function updateText() {
    setImage(savedImage, function() {
        drawText(nameText, big, 170, 90);
        const nameWidth = ctx.measureText(nameText).width;
        drawText(skillText, small, 170 + nameWidth + 20, 95);
        drawText(tribeText, small, 170, 50);
    });
}

function drawText(text, size, x, y) {
    ctx.font = getFont(size);
    ctx.fillStyle = 'orange';
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 4;
    ctx.fillText(text, x, canvas.height - y);
}

function modifyName(e) {
    nameText = e.target.value.toUpperCase();
    updateText();
}

function modifySkill(e) {
    skillText = e.target.value.toUpperCase();
    updateText();
}

function modifyTribe(e) {
    tribeText = e.target.value.toUpperCase();
    updateText();
}