var imageLoader;
var canvas;
var ctx;

$(document).ready(function() {
    imageLoader = document.getElementById('image-loader');
    imageLoader.addEventListener('change', handleImage, false);
    canvas = document.getElementById('image-canvas');
    ctx = canvas.getContext('2d');
});

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}