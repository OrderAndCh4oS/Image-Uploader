import Dropzone from 'dropzone';
import axios from "axios/index";

export default class InitialiseDropzone {
    constructor(fileFormId, fileParam, buttonId) {
        this._fileFormId = fileFormId;
        this._fileParam = fileParam;
        this._buttonId = buttonId;
        this.prevFile = "";
    }

    get dropzone() {
        return this._dropzone;
    }

    init() {
        this._dropzone = this.initDropzone();
        Dropzone.autoDiscover = false;
        this.makeMockFIle();
        this.initUploadButton();
    }

    initUploadButton() {
        const uploadImageButton = document.getElementById(this._buttonId);
        if (uploadImageButton !== null) {
            uploadImageButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.dropzone.processQueue();
            });
        }
    }

    initDropzone() {
        return new Dropzone("#" + this._fileFormId, {
            paramName: this._fileParam, // The name that will be used to transfer the file
            maxFilesize: 128, // MB
            uploadMultiple: false,
            thumbnailWidth: 200,
            thumbnailHeight: 200,
            maxFiles: 2,
            autoProcessQueue: false,
            init: function () {
                this.on('addedfile', function () {
                    if (typeof this.prevFile !== "undefined") {
                        axios.get('/remove/' + imageId);
                        this.removeFile(this.prevFile);
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
                    this.prevFile = file;
                });

                this.on("success", function (file, response) {
                    window.location = "/show/" + response.data.id;
                });
            }
        });
    }

    makeMockFIle() {
        if (typeof mockFile !== "undefined" && typeof mockImageUrl !== "undefined") {
            let imageUrl = mockImageUrl.replace(mockFile, '');
            this.dropzone.emit("addedfile", mockFile);
            this.dropzone.emit("thumbnail", mockFile, imageUrl);
            this.dropzone.emit("complete", mockFile);
            let existingFileCount = 1; // The number of files already uploaded
            this.dropzone.options.maxFiles = this.dropzone.options.maxFiles - existingFileCount;
        }
    }
}
