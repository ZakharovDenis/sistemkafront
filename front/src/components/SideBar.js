import React, { Component } from 'react'
import { t } from './Utils'
import './styles/SideBar.css';
import { getPictureInfo } from './API'
import $ from 'jquery'
import { CropPhotoModal, showModal } from './CropPhotoModal'


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}


class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.opened = true;
        this.state = {
            fullImage: null,
            coords: null,
            croppedImg: null,
            filters: {},
        };

        this.xDown = null;
        this.yDown = null;

        this.hideBar = this.hideBar.bind(this)
        this.openBar = this.openBar.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.handleTypeFilter = this.handleTypeFilter.bind(this)
        this.handleSort = this.handleSort.bind(this)
        this.handleCheckBoxFilter = this.handleCheckBoxFilter.bind(this)
        this.filterFilter = this.filterFilter.bind(this)
        this.resizeHandler = this.resizeHandler.bind(this)

        this.getTouches = this.getTouches.bind(this)
        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)

    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler)
        document.getElementById('cropAgain').addEventListener('click', function () {
            showModal(dataURLtoFile(this.state.fullImage, 'prevPhoto.png'));
        }.bind(this))
        let input_btn = document.querySelector('#sidebar_file')
        input_btn.addEventListener('change', function (e) {
            showModal(e.target.files)
        });

        // document.querySelector('.minimizeBtn').addEventListener('touchstart', this.handleTouchStart);
        // document.querySelector('.minimizeBtn').addEventListener('touchmove', this.handleTouchMove);

    }

    componentWillUnmount() {
        window.removeEventListener('resize')
        document.getElementById('cropAgain').removeEventListener('click');
        let input_btn = document.querySelector('#sidebar_file')
        input_btn.removeEventListener('change');
    }

    componentDidUpdate() {
        let fullImage = this.props.image_info.image;
        let coords = this.props.image_info.coords;
        let image = document.createElement('img');
        image.setAttribute('src', fullImage);
        image.setAttribute('width', 0);
        image.setAttribute('height', 0);
        let canvas = document.createElement("canvas");
        let [x, y, width, height, coeffX, coeffY] = coords;
        canvas.setAttribute('width', width + 'px');
        canvas.setAttribute('height', height + 'px');
        let ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';

        image.addEventListener('load', function () {
            ctx.drawImage(image, x * coeffX, y * coeffY, width * coeffX, height * coeffY, 0, 0, width, height);
            let dataURL = canvas.toDataURL();
            canvas.setAttribute('width', width + 'px');
            canvas.setAttribute('height', height + 'px');
            if (!this.state.croppedImg) {
                this.setState({
                    croppedImg: dataURL,
                    fullImage: fullImage,
                });
            }
        }.bind(this));
    }


    getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }
    
    handleTouchStart(evt) {
        const firstTouch = this.getTouches(evt)[0];
        this.xDown = firstTouch.clientX;
        this.yDown = firstTouch.clientY;
    };
    
    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }
    
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
    
        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;
        
        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 10) {
                this.hideBar({target: document.querySelector('.minimizeBtn')})
            } else if (xDiff < -10) {
                this.openBar({target: document.querySelector('.minimizeBtn')});
            }
        } else {
            if (yDiff > 20) {
                /* up swipe */
            } else {
                /* down swipe */
            }
        }
        /* reset values */
        this.xDown = null;
        this.yDown = null;
    };




    resizeHandler() {
        let e = { target: document.querySelector('.minimizeBtn') }
        if (this.opened) {
            return this.openBar(e);
        }
        return this.hideBar(e);
    }

    clickHandler(e) {
        if (this.opened) {
            this.opened = !this.opened;
            return this.hideBar(e);
        }
        this.opened = !this.opened;
        return this.openBar(e);
    }

    hideBar(e) {
        let sidebar = e.target.parentElement.querySelector('.sidebar');
        let grid = document.querySelector('.resultGrid');
        let minBtn = document.querySelector('.minimizeBtn');

        minBtn.classList.add('minimizedSidebar');
        grid.style.marginLeft = '0';
        sidebar.parentElement.style.left = -sidebar.offsetWidth + 'px';
    }

    openBar(e) {
        let sidebar = e.target.parentElement.querySelector('.sidebar');
        let grid = document.querySelector('.resultGrid');
        let minBtn = document.querySelector('.minimizeBtn');

        minBtn.classList.remove('minimizedSidebar');
        grid.style.marginLeft = sidebar.offsetWidth + 'px';
        sidebar.parentElement.style.left = '0';
    }

    handleFilter(e) {
        let button = e.target;
        if (button.classList.contains('btn-dark')) {
            button.classList.remove('btn-dark')
            button.classList.add('btn-outline-dark')
            let removeFilter = this.props.removeFilter
            return removeFilter(button.getAttribute('filter'), button.getAttribute('value'))
        }
        else {
            button.classList.add('btn-dark')
            button.classList.remove('btn-outline-dark')
            let addFilter = this.props.addFilter
            return addFilter(button.getAttribute('filter'), button.getAttribute('value'))
        }
    }

    handleCheckBoxFilter(e) {
        let input = e.target;
        if (input.nodeName == 'INPUT') {
            if (input.checked) {
                let addFilter = this.props.addFilter
                return addFilter(input.getAttribute('filter'), input.getAttribute('value'))
            }
            else {
                let removeFilter = this.props.removeFilter
                return removeFilter(input.getAttribute('filter'), input.getAttribute('value'))
            }
        }
    }

    handleTypeFilter(e) {
        let box = e.target.classList.contains('foundItem') ? e.target : e.target.parentElement;
        if (box.classList.contains('activeType')) {
            box.classList.remove('activeType')
            let removeFilter = this.props.removeFilter
            return removeFilter(box.getAttribute('filter'), box.getAttribute('value'))
        }
        else {
            box.classList.add('activeType')
            let addFilter = this.props.addFilter
            return addFilter(box.getAttribute('filter'), box.getAttribute('value'))
        }
    }

    filterFilter(e, filter) {
        let filterValues = Object.assign([], this.props.filters[filter]);
        let matchedFilters = []
        let input = e.target;
        let search_value = input.value.toLowerCase();
        filterValues.map((filter_val, _) => {
            if (filter_val.toLowerCase().match(search_value)) {
                matchedFilters.push(filter_val)
            }
        })

        this.setState({
            filters: Object.assign(this.state.filters, { [filter]: matchedFilters })
        })
    }

    handleSort(e) {
        let button = e.target.nodeName == "I" ? e.target.parentElement : e.target
        let sort_param = button.getAttribute('value')
        let icon = button.querySelector('i')
        let sortType = icon.getAttribute('value')
        let addSort = this.props.addSort
        if (sortType) {
            if (sortType == 'asc') {
                icon.setAttribute('value', 'desc')
                icon.textContent = '↓'
                return addSort(sort_param, 'desc')
            }
            else if (sortType == 'desc') {
                icon.setAttribute('value', 'asc')
                icon.textContent = '↑'
                return addSort(sort_param, 'asc')
            }
        }
        else {
            let all_buttons = button.parentElement.querySelectorAll('button')
            all_buttons.forEach(node => {
                let ic = node.querySelector('i')
                ic.textContent = ''
                ic.removeAttribute('value')
            })
            icon.setAttribute('value', 'asc')
            icon.textContent = '↑'
            return addSort(sort_param, 'asc')
        }
    }

    render() {
        return (
            <>
                <div className='sidebarBox'>
                    <div className='sidebar'>
                        <div className='croppedPhoto' id='cropAgain'>
                            <img src={this.state.croppedImg} />
                            <div className='cropAgain'>{t("crop-again-msg")}</div>
                        </div>
                        <div className='sidebarButtons'>
                            <form method='post' encType='multipart/form-data'>
                                <div className='sidebarSearch'>
                                    <input type="file" name="file" id="sidebar_file" className="box__file"></input>
                                    <label htmlFor="sidebar_file"><strong className="box__button btn btn-dark">{t("chose-file_msg")}</strong></label>
                                </div>
                            </form>
                        </div>
                        <div className='foundClothesBox'>
                            {this.props.found_clothes ?
                                this.props.found_clothes.map((item, index) => {
                                    return (
                                        <div className='foundItem' key={index} filter='type' value={item.type} onClick={this.handleTypeFilter}>
                                            <img src={item.image} />
                                            <div className='foundItemName'>{t(item.type)}</div>
                                        </div>
                                    )
                                })
                                : <></>
                            }
                        </div>
                        <div className='sortByBox'>
                            <div className='sortTitle'>{t('sort_msg')}</div>
                            <div className='sortButtonsBox'>
                                {this.props.sort ?
                                    this.props.sort.map((val, index) => {
                                        return (
                                            <button key={index} className="btn btn-outline-dark one-line mt-2 ml-0 mb-0" value={val} onClick={this.handleSort}>
                                                {t(val + '_msg')}
                                                <i className='arrow'></i>
                                            </button>
                                        )
                                    })
                                    : <></>}
                            </div>
                        </div>
                        <div className='filterList'>
                            {this.props.filters ? Object.keys(this.props.filters).map((filter, index) => {
                                return (
                                    <div className='filterBox' key={index}>
                                        <div className='filterTitle'>{t(filter + '_filter_msg')}</div>
                                        <div className='filterMinimizeArea'>
                                            <input type="text" className="form-control" filter={filter} onChange={(e) => { this.filterFilter(e, filter) }} placeholder={t('search_input_msg')}></input>
                                            <div className='filtersList'>
                                                {(this.state.filters[filter] || this.props.filters[filter]).map((exactFilter, index) => {
                                                    return (
                                                        <div key={index} className="form-check c-p" onClick={this.handleCheckBoxFilter}>
                                                            <input className="form-check-input c-p filterCheckBox" filter={filter} value={exactFilter} type="checkbox" id={"defaultCheck" + index + filter} />
                                                            <label className="form-check-label c-p w-100 filterLabel " htmlFor={"defaultCheck" + index + filter}>{t(exactFilter)}</label>
                                                        </div>
                                                        // {/* <button key={index} className="btn btn-outline-dark my-2 one-line" filter={filter} value={exactFilter} onClick={this.handleFilter}>{t(exactFilter)}</button> */ }
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                                : <></>}
                        </div>
                    </div>
                    <button onClick={this.clickHandler} className='minimizeBtn' id='menu-toggle'></button>
                </div>
                <CropPhotoModal />
            </>
        )
    }
}

export default SideBar