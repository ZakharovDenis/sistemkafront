import React, { Component } from 'react'
import { t, getCookie } from './Utils'
import './styles/PhotoWindow.css';
import $ from 'jquery';
import 'bootstrap'
import {CropPhotoModal, showModal, addMask} from './CropPhotoModal'

class PhotoWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            picture_src: null,
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', changeWindowSize);
        window.addEventListener('resize', function () {
            let photoWindow = document.querySelector('.box.has-advanced-upload');
            if (window.innerWidth > 850) {
                photoWindow.style.width = '50%'
            }
            else {
                photoWindow.style.width = '100%'
            }
        });
        window.addEventListener('load', function () {
            let photoWindow = document.querySelector('.box.has-advanced-upload');
            let fakeWindow = document.querySelector('.fakeWindow');
            fakeWindow.style.height = (photoWindow.offsetHeight) + 'px';
            f();
        })
    }
    componentWillUnmount() {
        window.removeEventListener('scroll');
        window.removeEventListener('resize');
        window.removeEventListener('load')
    }
    render() {
        return (
            <>
                <div className='fakeWindow'>
                    <form className="box has-advanced-upload" method="post" encType="multipart/form-data" action='loc'>
                        <div className="box__input">
                            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
                                <path
                                    d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z">
                                </path>
                            </svg>
                            <input type="file" name="file" id="file" className="box__file"></input>
                            <label htmlFor="file"><strong className="box__button btn btn-dark">{t('chose-file')}</strong><span className="box__dragndrop"> {t('drag-n-drop-msg')}</span>.</label>
                        </div>
                    </form>
                </div>
                <CropPhotoModal/>
            </>
        )
    }
}


function f() {
    // feature detection for drag&drop upload
    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    // applying the effect for every form
    var forms = document.querySelectorAll('.box');
    Array.prototype.forEach.call(forms, function (form) {
        var input = form.querySelector('input[type="file"]'),
            restart = form.querySelectorAll('.box__restart'),
            droppedFiles = false

        // automatically submit the form on file select
        input.addEventListener('change', function (e) {
            showModal(e.target.files)
        });

        input.addEventListener('click', function (e) {
            this.value = '';
            addMask();
        });


        // drag&drop files if the feature is available
        if (isAdvancedUpload) {
            form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                form.addEventListener(event, function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            ['dragover', 'dragenter'].forEach(function (event) {
                form.addEventListener(event, function () {
                    form.classList.add('is-dragover');
                });
            });
            ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                form.addEventListener(event, function () {
                    form.classList.remove('is-dragover');
                });
            });
            form.addEventListener('drop', function (e) {
                droppedFiles = e.dataTransfer.files; // the files that were dropped
                addMask();
                showModal(droppedFiles);
            });
        }

        // restart the form if has a state of error/success
        Array.prototype.forEach.call(restart, function (entry) {
            entry.addEventListener('click', function (e) {
                e.preventDefault();
                form.classList.remove('is-error', 'is-success');
                input.click();
            });
        });

        // Firefox focus bug fix for file input
        input.addEventListener('focus', function () { input.classList.add('has-focus'); });
        input.addEventListener('blur', function () { input.classList.remove('has-focus'); });

    });
};


function changeWindowSize() {
    let photoWindow = document.querySelector('.box.has-advanced-upload');
    let fakeWindow = document.querySelector('.fakeWindow');

    var html = document.documentElement;
    var body = document.body;

    var scrollTop = html.scrollTop || body && body.scrollTop || 0;
    scrollTop -= html.clientTop; // в IE7- <html> смещён относительно (0,0)

    if (photoWindow.offsetHeight >= 140) {
        photoWindow.style.height = (fakeWindow.offsetHeight - scrollTop) + 'px';
        if (window.innerWidth > 850) {
            photoWindow.style.width = (50 + ((fakeWindow.offsetHeight - photoWindow.offsetHeight) / fakeWindow.offsetHeight) * 100) + '%';
        }
    }
    if (photoWindow.offsetHeight < 250) {
        photoWindow.querySelector('svg').style.display = 'none';
        photoWindow.style.padding = '0px 20px';
    }
    else {
        photoWindow.querySelector('svg').style.display = 'block';
        photoWindow.style.padding = '100px 20px;';
    }
    if (photoWindow.offsetHeight < 140) {
        photoWindow.style.height = 140 + 'px';
    }
    if (scrollTop > 380) { //380
        document.querySelector('.navbarSearch').style.display = 'flex';
    }
    else {
        if (document.querySelector('.navbarSearch') != null) {
            document.querySelector('.navbarSearch').style.display = 'none';
        }
    }
}


export default PhotoWindow;