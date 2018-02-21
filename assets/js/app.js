require('../css/app.scss');
import Dropzone from 'dropzone';
import axios from 'axios';

if (document.getElementById('imageFileForm')) {
    let prevFile;
    let dropzone = new Dropzone("form#imageFileForm",
        {
            paramName: "image[imageFile][file]", // The name that will be used to transfer the file
            maxFilesize: 128, // MB
            uploadMultiple: false,
            thumbnailWidth: 200,
            thumbnailHeight: 200,
            maxFiles: 2,
            autoProcessQueue: false,
            init: function () {
                this.on('addedfile', function () {
                    if (typeof prevFile !== "undefined") {
                        axios.get('/remove/' + imageId);
                        this.removeFile(prevFile);
                    }
                });

                this.on('complete', function (file) {
                    prevFile = file;
                });
            }
        });
    dropzone.on("success", function (file, response) {
        window.location = "/show/" + response.data.id;
    });

    if (typeof mockFile !== "undefined" && typeof mockImageUrl !== "undefined") {
        let imageUrl = mockImageUrl.replace(mockFile, '');
        dropzone.emit("addedfile", mockFile);
        dropzone.emit("thumbnail", mockFile, imageUrl);
        dropzone.emit("complete", mockFile);
        let existingFileCount = 1; // The number of files already uploaded
        dropzone.options.maxFiles = dropzone.options.maxFiles - existingFileCount;
    }
    Dropzone.autoDiscover = false;

    const uploadImageButton = document.getElementById('upload-image');
    if (uploadImageButton !== null) {
        uploadImageButton.addEventListener('click', function (e) {
            e.preventDefault();
            dropzone.processQueue();
        });
    }
}
