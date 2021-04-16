var canvas, ctx;
var savedImage;
var savedColor = '#7bd148';

jQuery(function() {
    $('#image-loader').on('change', handleImage);

    $('#name').on('keyup', modifyName);
    $('#skill').on('keyup', modifySkill);
    $('#tribe').on('keyup', modifyTribe);

    $('#color').simplecolorpicker().on('change', function() {
        let color = $('#color').val();
        modifyColor(color);
    });

    canvas = document.getElementById('image-canvas');
    ctx = canvas.getContext('2d');
});

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        setImage(event.target.result, function() {});
        updateText();
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

function getFont(fontSize) {
    var ratio = fontSize / 1000;
    var size = canvas.width * ratio;
    return (size | 0) + 'px CutamondBasic';
}

var nameText = "";
var skillText = "";
var tribeText = "";

function updateText() {
    setImage(savedImage, function() {
        let fourThreeInset = (canvas.width - canvas.height * (4 / 3)) / 2;
        let xInset = fourThreeInset + canvas.height / 7.5;
        let nameY = canvas.height / 5.6;
        let skillY = canvas.height / 5.6;
        let tribeY = canvas.height / 9;

        drawText(nameText, 45, xInset, nameY);
        const xOffset = ctx.measureText(nameText).width + canvas.width / 30;
        drawText(skillText, 28, xInset + xOffset, skillY);
        drawText(tribeText, 28, xInset, tribeY);
    });
}

function drawText(text, size, x, y) {
    ctx.font = getFont(size);
    ctx.fillStyle = savedColor;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 3;
    ctx.letterSpacing = 26;
    ctx.shadowBlur = 4;
    let finalText = text.split("").join(String.fromCharCode(8202));
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

function modifyColor(color) {
    savedColor = color;
    updateText();
}