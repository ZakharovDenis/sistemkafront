import React from 'react'
import { t } from './Utils'
import './styles/Footer.css'

function Footer(props) {
    let links = ['blog','vacancy','about_us','privacy','terms'];
    return (
        <footer className='footer'>
            <div className='linksBox'>
                {links.map(link =>{
                    return (<div className='footerLink' key={link}>
                        <a href={link} >
                            {t(link+'_msg')}
                        </a>
                    </div>)
                })}
            </div>
            <div className="divider"><hr className="line"></hr></div>
            <p>© SISTEMKA, {new Date().getFullYear()}</p>
        </footer>
    )
}

export default Footer