import React, { Component } from 'react'
import { Modal } from './Modal'
import $ from 'jquery';
import 'bootstrap'
import { t } from './Utils'
import { EnableLoadScreen, DisableLoadScreen } from './LoadScreen'
import { upload } from './API'


function cropImage() {
    let cropper = document.querySelector('.resizable')
    let x = cropper.offsetLeft;
    let y = cropper.offsetTop;
    let width = cropper.offsetWidth;
    let height = cropper.offsetHeight;
    let image = document.getElementById('cuttingImage');
    let coeffX = image.naturalWidth / image.width;
    let coeffY = image.naturalHeight / image.height;
    let imgBase64 = image.getAttribute('src');
    EnableLoadScreen();
    sessionStorage.setItem('image', imgBase64);
    // sessionStorage.setItem('croppedImage', dataURL);
    sessionStorage.setItem('coords', [x, y, width, height, coeffX, coeffY]);
    $.ajax({
        type: "POST",
        url: upload,
        traditional: true,
        data: {
            imgBase64: imgBase64,
            coords: JSON.stringify([x, y, width, height, coeffX, coeffY])
        },
    }).done(function (response) {
        // DisableLoadScreen();
        window.location.href = response;
    });
}


function addMask() {
    let imageCropper = document.querySelector('.imageCropper');
    let mask = document.querySelector('.resizable');
    if (mask) {
        imageCropper.removeChild(document.querySelector('.resizable'));
    }
    let d = document.createElement('div');
    d.classList.add('resizable');
    d.innerHTML = `
            <div class='resizers'>
                <div class='resizer top-left'></div>
                <div class='resizer top-right'></div>
                <div class='resizer bottom-left'></div>
                <div class='resizer bottom-right'></div>
            </div>
    `
    imageCropper.appendChild(d);
    makeResizableDiv('.resizable');
}

function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .resizer')
    const parent = document.querySelector('.imageCropper')
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    let original_x = 0;
    let original_y = 0;
    let parentX = parent.offsetLeft;
    let parentY = parent.offsetTop;
    let parentWidth = parent.offsetWidth;
    let parentHeight = parent.offsetHeight;
    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', function (e) {
            e.preventDefault()
            original_width = element.offsetWidth;
            original_height = element.offsetHeight;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            original_x = element.offsetLeft;
            original_y = element.offsetTop;
            parentX = parent.getBoundingClientRect().left;
            parentY = parent.getBoundingClientRect().top;
            parentWidth = parent.offsetWidth;
            parentHeight = parent.offsetHeight;
            window.addEventListener('mousemove', resize)
            window.addEventListener('mouseup', stopResize)
        })

        currentResizer.addEventListener('touchstart', function (e) {
            e.preventDefault()
            original_width = element.offsetWidth;
            original_height = element.offsetHeight;
            parentX = parent.getBoundingClientRect().left;
            parentY = parent.getBoundingClientRect().top;
            parentWidth = parent.offsetWidth;
            parentHeight = parent.offsetHeight;
            var touch = e.touches[0] || e.changedTouches[0];
            original_mouse_x = touch.pageX;
            original_mouse_y = touch.pageY;
            window.addEventListener('touchmove', resize)
            window.addEventListener('touchend', stopResize)
        })

        function resize(e) {
            let current_x = element.offsetLeft;
            let current_y = element.offsetTop;
            let currentWidth = element.offsetWidth;
            let currentHeight = element.offsetHeight;
            try {
                var touch = e.touches[0] || e.changedTouches[0];
            }
            catch (e) {
                var touch = e;
            }
            if (currentResizer.classList.contains('bottom-right')) {
                const width = ((e.pageX || touch.pageX) > (parentX + parentWidth)
                    ? parentWidth - current_x
                    : original_width + ((e.pageX || touch.pageX) - original_mouse_x));

                const height = ((e.pageY || touch.pageY) > (parentY + parentHeight)
                    ? parentHeight - current_y
                    : (original_height + ((e.pageY || touch.pageY) - original_mouse_y)));

                if (width > minimum_size) {
                    element.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                }
            }
            else if (currentResizer.classList.contains('bottom-left')) {
                const height = ((e.pageY || touch.pageY) > (parentY + parentHeight)
                    ? parentHeight - original_y
                    : original_height + ((e.pageY || touch.pageY) - original_mouse_y))

                const width = ((e.pageX || touch.pageX) < parentX
                    ? currentWidth
                    : original_width - ((e.pageX || touch.pageX) - original_mouse_x))

                if (height > minimum_size) {
                    element.style.height = height + 'px'
                }
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                    let left = ((e.pageX || touch.pageX) - (original_mouse_x - original_x))
                    if (left > 0) {
                        element.style.left = left + 'px';
                    } else {
                        element.style.left = '0px';
                    }
                }
            }
            else if (currentResizer.classList.contains('top-right')) {
                const width = ((e.pageX || touch.pageX) > (parentX + parentWidth)
                    ? parentWidth - original_x
                    : original_width + ((e.pageX || touch.pageX) - original_mouse_x))

                const height = ((e.pageY || touch.pageY) < parentY
                    ? currentHeight
                    : original_height - ((e.pageY || touch.pageY) - original_mouse_y))

                if (width > minimum_size) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                    let top = ((e.pageY || touch.pageY) - (original_mouse_y - original_y));
                    if (top > 0) {
                        element.style.top = top + 'px';
                    } else {
                        element.style.top = '0px';
                    }
                }
            }
            else {
                const width = ((e.pageX || touch.pageX) < parentX
                    ? currentWidth
                    : original_width - ((e.pageX || touch.pageX) - original_mouse_x))

                const height = ((e.pageY || touch.pageY) < parentY
                    ? currentHeight
                    : original_height - ((e.pageY || touch.pageY) - original_mouse_y))

                if (width > minimum_size) {
                    element.style.width = width + 'px'
                    let left = ((e.pageX || touch.pageX) - (original_mouse_x - original_x))
                    if (left > 0) {
                        element.style.left = left + 'px';
                    } else {
                        element.style.left = '0px';
                    }
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                    let top = ((e.pageY || touch.pageY) - (original_mouse_y - original_y));
                    if (top > 0) {
                        element.style.top = top + 'px';
                    } else {
                        element.style.top = '0px';
                    }
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize)
            window.removeEventListener('touchmove', resize)
        }
    }
}

function showModal(files) {
    if (files || files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#cuttingImage').attr('src', e.target.result);
        }
        reader.readAsDataURL(files[0]||files);
        $('#cutPhotoModal').modal('toggle');
    }
}

class CropPhotoModal extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        addMask();
        window.addEventListener('resize', function () {
            addMask();
        })
    }
    componentWillUnmount() {
        window.removeEventListener('resize');
        let input_btn = document.querySelector('#navbar_file')
        input_btn.removeEventListener('change');
        input_btn.removeEventListener('click');
    }
    render() {
        return (
            <Modal
                id='cutPhotoModal'
                title={t('crop_img_msg')}
                body={<div className='imageCropper'>
                    <img className='cuttingImage' id="cuttingImage" src="#" alt="your image" />
                </div>}
                buttons={<>
                    <button type="button" id='confirmCrop' onClick={cropImage} data-dismiss="modal" className="btn btn-dark my-2 my-sm-0 one-line w-100">{t('apply')}</button></>}
            />
        )
    }
}

// export default CropPhotoModal
export { CropPhotoModal, showModal, addMask }