import React, { Component } from 'react'
import { t } from './Utils'
import './styles/TryItOut.css';
import {getRandomPhotos} from './API'
// import { EnableLoadScreen, DisableLoadScreen } from './LoadScreen';


function uploadDemo(e){
    // e.preventDefault();
    // EnableLoadScreen();
    // window.onload(DisableLoadScreen())
    // let dataURL = e.querySelector('img').getAttrebute('src');
    // console.log(dataURL)
    // $.ajax({
    //     type: "POST",
    //     url: upload,
    //     data: { 
    //        imgBase64: dataURL
    //     },
    //   }).done(function(response) {
    //     console.log(response)
    //     DisableLoadScreen();
    //     window.location.href = response;
    //   });
}

class TryItOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }
    componentDidMount() {
        // fetch(getPartners, { cache: "no-store" })
        //     .then(response => response.json())
        //     .then(json => {
        //         this.setState({
        //             partners: json
        //         })
        //     })

        fetch(getRandomPhotos, {cache: "no-store"})
            .then(async response => response.json())
            .then(json => {
                this.setState({
                    items: json
                })
            })
        
    }
    render() {
        return (
            <div className='sampleBox'>
                <div className='sampleBoxText'>
                    <h2 className='sampleTitle'>{t('sample_title_text')}</h2>
                    <h3 className='sampleSubTitle'>{t('sample_subtitle_text')}</h3>
                </div>
                <div className='samplePhotosContainer'>
                    {this.state.items.map((item, index) => {
                        return (
                            <div className='photoContainer' key={index}>
                                <a id='demoLink' href = {"/result/"+item.link}>
                                    <img className='samplePhoto' src={item.image}/>
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default TryItOut;