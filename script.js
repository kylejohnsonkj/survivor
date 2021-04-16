var canvas;
var ctx;
var savedImage;

$(document).ready(function() {
    const imageLoader = document.getElementById('image-loader');
    imageLoader.addEventListener('change', handleImage, false);

    const nameInput = document.getElementById('name-input');
    nameInput.addEventListener('keydown', modifyName, false);

    const skillInput = document.getElementById('skill-input');
    skillInput.addEventListener('keydown', modifySkill, false);

    const tribeInput = document.getElementById('tribe-input');
    tribeInput.addEventListener('keydown', modifyTribe, false);

    canvas = document.getElementById('image-canvas');
    ctx = canvas.getContext('2d');
});

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        setImage(event.target.result, null);
    }
    reader.readAsDataURL(e.target.files[0]);
}

function setImage(e, callback) {
    var img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        callback();
    }
    savedImage = e;
    img.src = savedImage;
}

function modifyName(e) {
    // TODO: move callback into separate func
    setImage(savedImage, function() {
        ctx.font = "30px Arial";
        ctx.fillText(e.target.value, 10, 50);
    });
}

function modifySkill(e) {

}

function modifyTribe(e) {

}