import React, { Component } from 'react'
import { t } from './Utils'
import './styles/LoadScreen.css';
import $ from 'jquery';


function LoadScreen(params) {
    let loading_msgs = ['load_msg1', 'load_msg2', 'load_msg3', 'load_msg4', 'load_msg5']
    return (
        <div className='loadScreen' style={{display:  + params.display? 'flex' : 'none'}} id='loadScreen'>
            {loading_msgs.map(load_msg => {
                return (
                    <h2 key={load_msg}>{t(load_msg)}</h2>
                )
            })}
        </div>
    )
}

function EnableLoadScreen(){
    let load_screen = document.querySelector('#loadScreen');
    load_screen.style.display = 'flex';
}

function DisableLoadScreen(){
    let load_screen = document.querySelector('#loadScreen');
    load_screen.style.display = 'none';
}

function injector(t, splitter, klass, after) {
    var a = t.text().split(splitter), inject = '';
    if (a.length) {
        $(a).each(function (i, item) {
            inject += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after
        });
        t.empty().append(inject)
    }
}
var methods = {
    init: function () {
        return this.each(function () {
            injector($(this), '', 'char', '')
        })
    },
    words: function () {
        return this.each(function () { injector($(this), ' ', 'word', ' ') })
    }, lines: function () { return this.each(function () { var r = "eefec303079ad17405c889e092e105b0"; injector($(this).children("br").replaceWith(r).end(), r, 'line', '') }) }
}; $.fn.lettering = function (method) { if (method && methods[method]) { return methods[method].apply(this, [].slice.call(arguments, 1)) } else if (method === 'letters' || !method) { return methods.init.apply(this, [].slice.call(arguments, 0)) } $.error('Method ' + method + ' does not exist on jQuery.lettering'); return this };

$(document).ready(function () {
    $("#loadScreen > h2").css('opacity', 1).lettering('words').children("span").lettering().children("span").lettering();
})

export {LoadScreen, EnableLoadScreen, DisableLoadScreen}
export default LoadScreen