import InitialiseDropzone from "./dropzone";

require('../css/app.scss');

if (document.getElementById("imageFileForm")) {
    const dropzone = new InitialiseDropzone("imageFileForm", "image[imageFile][file]", "upload-image");
    dropzone.init();
}
