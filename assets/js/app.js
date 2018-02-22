require('../css/app.scss');
import Dropzone from 'dropzone';
import axios from 'axios';

function initUploadButton(dropzone) {
    const uploadImageButton = document.getElementById('upload-image');
    if (uploadImageButton !== null) {
        uploadImageButton.addEventListener('click', function (e) {
            e.preventDefault();
            dropzone.processQueue();
        });
    }
}

function makeMockFIle(dropzone) {
    if (typeof mockFile !== "undefined" && typeof mockImageUrl !== "undefined") {
        let imageUrl = mockImageUrl.replace(mockFile, '');
        dropzone.emit("addedfile", mockFile);
        dropzone.emit("thumbnail", mockFile, imageUrl);
        dropzone.emit("complete", mockFile);
        let existingFileCount = 1; // The number of files already uploaded
        dropzone.options.maxFiles = dropzone.options.maxFiles - existingFileCount;
    }
}

function initDropzone() {
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

                this.on('sending', function (file, xhr, formData) {
                    const metaData = document.getElementById('meta');
                    const metaFormData = new FormData(metaData);
                    for (let [key, value] of metaFormData) {
                        formData.append(key, value);
                    }
                });

                this.on('complete', function (file) {
                    prevFile = file;
                });

                this.on("success", function (file, response) {
                    window.location = "/show/" + response.data.id;
                });
            }
        });
    return dropzone;
}

if (document.getElementById('imageFileForm')) {
    Dropzone.autoDiscover = false;
    let dropzone = initDropzone();
    makeMockFIle(dropzone);
    initUploadButton(dropzone);
}
