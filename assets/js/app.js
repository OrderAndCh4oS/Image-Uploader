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

if (typeof mockFile !== "undefined" && typeof mockImageUrl !== "undefined") {
    dropzone.options.addedfile.call(dropzone, mockFile);
    dropzone.options.thumbnail.call(dropzone, mockFile, mockImageUrl);
    dropzone.emit("complete", mockFile);
}

Dropzone.autoDiscover = false;


