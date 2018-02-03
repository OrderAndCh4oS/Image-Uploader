require('../css/app.scss');
import Dropzone from 'dropzone';

let dropzone = new Dropzone("form#imageFileForm",
    {
        paramName: "image[imageFile][file]", // The name that will be used to transfer the file
        maxFilesize: 128, // MB
        uploadMultiple: false,
        thumbnailWidth: 200,
        thumbnailHeight: 200
    });
dropzone.on("success", function (file, response) {
    window.location = "/show/" + response.data.id;
});
Dropzone.autoDiscover = false;


