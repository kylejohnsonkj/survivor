var canvas, ctx;
var textCanvas;
var savedImage;
var savedColor = '#7bd148';

jQuery(function() {
    $('#image-loader').on('change', handleChoose);

    $('#name').on('keyup', modifyName);
    $('#skill').on('keyup', modifySkill);
    $('#tribe').on('keyup', modifyTribe);

    $('#color').simplecolorpicker().on('change', function() {
        let color = $('#color').val();
        modifyColor(color);
    });

    canvas = document.getElementById('canvas');
    canvas.width = 1920;
    canvas.height = 1080;

    // setImage("samples/garrett.png", function() {});
    ctx = canvas.getContext('2d');
    updateText();

    $('.image-wrapper').on('dragover', handleDrag);
    $('.image-wrapper').on('drop', handleDrop);

    $('#download').on('click', handleDownload);
    $('#textonly').on('click', clearBgThenDownload)

});

function clearBgThenDownload(e) {
    e.stopPropagation();
    e.preventDefault();
    updateText(null); // clear image
    handleDownload(e, function() {
        setImage(savedImage, updateText);
    });
}

function handleDownload(e, callback) {
    e.stopPropagation();
    e.preventDefault();
    var link = document.createElement('a');
    let fileName = (nameText == "") ? 'blank' : nameText.toLowerCase();
    link.download = fileName + '.png';
    link.href = canvas.toDataURL()
    link.click();
    callback();
}

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
            setImage(event.target.result, updateText);
        }
        reader.readAsDataURL(file);
    }
}

function setImage(newImage, callback) {
    if (newImage == null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        callback();
        return;
    }

    var img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        $('.image-wrapper').css("border", "none");
        callback();
    }
    savedImage = newImage;
    img.src = savedImage;
}

function ratio(num) {
    let min = Math.min(canvas.width, canvas.height);
    return num * (min / 560);
}

function getFont(size) {
    return ratio(size) + 'px CutamondBasic';
}

var nameText = "";
var skillText = "";
var tribeText = "";

function updateText(override) {
    var image = savedImage;
    if (override !== undefined) {
        image = override;
    }
    setImage(image, function() {
        let min = Math.min(canvas.width, canvas.height);
        let startX = Math.max((canvas.width - min) / 5 + (ratio(100)), (ratio(50)));

        let nameY = 100;
        let skillY = 100;
        let tribeY = 60;

        drawText(nameText, 45, startX, nameY);
        let xOffset = ctx.measureText(nameText).width + ratio(25); // to place after name
        drawText(skillText, 27, startX + xOffset, skillY);
        drawText(tribeText, 29, startX + ratio(2), tribeY);
    });
}

function drawText(text, size, x, y) {
    ctx.font = getFont(size);
    ctx.fillStyle = savedColor;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = ratio(4);
    ctx.shadowOffsetY = ratio(3);
    ctx.shadowBlur = ratio(4);
    ctx.fillText(text, x, canvas.height - ratio(y));
}

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

function modifyColor(color) {
    savedColor = color;
    updateText();
}