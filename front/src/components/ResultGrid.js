import React, { Component } from 'react'
import { t } from './Utils'
import './styles/ResultGrid.css';
import {EnableLoadScreen, DisableLoadScreen} from './LoadScreen'
import {upload} from './API'
import $ from 'jquery'

class ResultGrid extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        const items = props.items;
        this.state = { items: props.items }
    }

    handleFindSimilar(e){
        e.preventDefault()
        console.log(e.target)
        console.log(e.target.parentElement.parentElement.parentElement)
        let img = e.target.parentElement.parentElement.parentElement.querySelector('img')
        $.ajax({
            type: "POST",
            url: upload,
            traditional: true,
            data: {
                imgBase64: img.getAttribute('src'),
                // coords: JSON.stringify([0, 0, img.naturalWidth, img.naturalHeight, 1, 1])
            },
        }).done(function (response) {
            window.location.href = response;
        });
    }

    render() {
        const items = this.props.items;
        let actualItems = this.props.items ? Object.assign([], this.props.items) : undefined;
        let filters = this.props.filter;
        if (filters) {
            Object.keys(filters).map((filter, _) => {
                items.map((item, _) => {
                    if (filters[filter].length > 0 && filters[filter].indexOf(item[filter]) == -1) {
                        actualItems.splice(actualItems.indexOf(item), 1);
                    }
                })
            })
        }
        if (actualItems && this.props.sort) {
            let sorting = this.props.sort
            let sort_param = sorting.sort_option
            if (sorting.sort_arrange == "asc") {
                actualItems.sort(function (a, b) {
                    return a[sort_param] - b[sort_param]
                })
            }
            else if (sorting.sort_arrange == "desc") {
                actualItems.sort(function (a, b) {
                    return b[sort_param] - a[sort_param]
                })
            }
        }
        return (
            <div className='resultGridWrapper'>
                <div className='resultGrid ml-400'>
                    {actualItems ?
                        actualItems.map((item, index) => {
                            return (
                                <a href={item.href} className='suggestion' key={index}>
                                    <img src={item.image} />
                                    <div className='infoWrapper'>
                                        <div className='infoRow justify-content-between'>
                                            <div className='price'>{item.price ? parseFloat(item.price).toFixed(2)+" "+t('currency_msg') : ""} </div>
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none" stroke="#a1a1a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={item.liked ? 'liked' : ''}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> */}
                                        </div>
                                        <div className='infoRow'>
                                            <div className='brand'>{item.brand}</div>
                                            <span className='model'>{item.model}</span>
                                        </div>
                                        <div className='infoRow'>
                                            <div>{t("seller_msg")}</div>
                                            <div className='seller'>{item.seller}</div>
                                        </div>
                                        <div className='infoRow justify-content-center'>
                                            <button onClick={this.handleFindSimilar} className='findSimilar btn btn-outline-dark'>{t('find_similar_msg')}</button>
                                        </div>
                                    </div>
                                </a>)
                        })
                        : <></>}
                </div>
            </div>
        )
    }
}

export default ResultGrid