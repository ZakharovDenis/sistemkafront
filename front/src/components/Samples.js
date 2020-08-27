import React, { Component } from 'react'
import logo from "../images/favicon.ico"
import { t, getCookie } from './Utils'
import $ from 'jquery'
import './styles/Samples.css';


function fetchPhotos(number){
    $.ajax({
        type: "POST",
        url: upload,
        data: { 
           imgBase64: dataURL
        },
      }).done(function(response) {
        console.log(response)
        DisableLoadScreen();
        window.location.href = response;
      });
}

function Samples(){
    return(
        <div className='sampleBox'>
            <div className='sampleBoxText'>
                <h2 className='sampleTitle'>{t('sample_title_text')}</h2>
                <h3 className='sampleSubTitle'>{t('sample_subtitle_text')}</h3>
            </div>
            <div className='samplePhotoContainer'>

            </div>
        </div>
    )
}

export default Samples