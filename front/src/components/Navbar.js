import React from 'react'
import './styles/Navbar.css';
import { RegistrationModal, Modal } from './Modal';
import { InputField, PasswordField } from './Input'
import logo from "../images/favicon.ico"
import { t, getCookie } from './Utils'
import $ from 'jquery'
// import 'bootstrap'
import { addMask, showModal } from './CropPhotoModal'

function IconPack() {
    return (
        <div className='icon-block'>
            <a className='icon'>
                <img src={require('../images/heart-outline.svg')} width="30" height="30" />
                <p className='underwords mb-0'>{t('liked')}</p>
            </a>
            <a className='icon'>
                <img src={require('../images/cart.svg')} width="30" height="30" />
                <p className='underwords mb-0'>{t('cart')}</p>
            </a>
            <a className='icon'>
                <img src={require('../images/book.svg')} width="30" height="30" />
                <p className='underwords mb-0'>{t('history')}</p>
            </a>
        </div>
    )
}

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        let cookie_lang = getCookie('language');
        this.state = {
            modal: <>default modal</>,
            type: "",
            language: cookie_lang ? cookie_lang : 'russian',
        }
        this.languages = {
            'english': '🇺🇸',
            'russian': '🇷🇺'
        }
        this.setType = this.setType.bind(this)
        this.setTypeLogin = this.setTypeLogin.bind(this)
        this.setTypeRigister = this.setTypeRigister.bind(this)
        this.setEnglish = this.setEnglish.bind(this)
        this.setRussian = this.setRussian.bind(this)
    }
    setRussian() {
        sessionStorage.setItem('language', 'russian')
        this.setState({
            language: 'russian'
        })
    }
    setEnglish() {
        sessionStorage.setItem('language', 'english')
        this.setState({
            language: 'english'
        })
    }
    setType(newType) {
        this.setState({
            modal: newType
        })
    }
    setTypeLogin() {
        this.setState({
            modal: <>
                <InputField label={t('email')} />
                <PasswordField label={t('password')} />
            </>,
            type: 'login'
        })
    }
    setTypeRigister() {
        this.setState({
            modal: <>
                <InputField label={t('name_msg')} />
                <InputField label={t('e-mail_msg')} />
            </>,
            type: 'register'
        })
    }

    componentDidMount() {
        let input_btn = document.querySelector('#navbar_file')
        input_btn.addEventListener('change', function (e) {
            showModal(e.target.files)
        });
        input_btn.addEventListener('click', function (e) {
            this.value = '';
            addMask();
        });
        window.addEventListener('load',function(e){
            document.querySelector('#dropdownMenuButton').click()
        })
    }

    componentWillUnmount() {
        let input_btn = document.querySelector('#navbar_file')
        input_btn.removeEventListener('change')
        input_btn.removeEventListener('click')
        window.removeEventListener('load')
    }
    render() {
        return (
            <>
                <nav className="navbar navbar-expand-sm navbar-light bg-white">
                    <div className='navBarWrapper'>
                        <a className="navbar-brand" href="/">
                            <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
                        Sistemka
                        <form method='post' encType='multipart/form-data'>
                                <div className='navbarSearch'>
                                    <input type="file" name="file" id="navbar_file" className="box__file"></input>
                                    <label htmlFor="navbar_file"><strong className="box__button btn btn-dark">{t("chose-file_msg")}</strong></label>
                                </div>
                            </form>
                        </a>
                        <button className="navbar-toggler" type="button" onClick={collapseNavbar}>
                            <span className="navbar-toggler-icon"></span>
                        </button>


                        <div className="navbarTopBtn collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav w-100" id='navbar-nav'>
                            </ul>
                            {/* <IconPack /> remove comment */}
                            <div className="d-flex justify-content-center">

                                <div className="dropdown my-2 my-sm-0 one-line">
                                    <button className="btn btn-flag dropdown-toggle btn-outline-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {this.languages[this.state.language]}
                                    </button>
                                    <div className="dropdown-menu choose-flag" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item flag" onClick={this.setEnglish} href="#">🇺🇸</a> {/* USA flag */}
                                        <a className="dropdown-item flag" onClick={this.setRussian} href="#">🇷🇺</a> {/* Russia flag */}
                                    </div>
                                </div>

                                {/* <button className="btn btn-outline-dark my-2 my-sm-0 one-line" data-toggle="modal"
                                    data-target="#loginModal" onClick={this.setTypeRigister}>{t('register')}</button>
                                <button type="button" className="btn btn-dark my-2 my-sm-0 one-line" data-toggle="modal"
                                    data-target="#loginModal" onClick={this.setTypeLogin}>{t('login')}</button> */}
                            </div>
                        </div>
                    </div>
                </nav>
                <nav className='bottomBar d-none'> {/* remove d-none when functional ready*/}
                    <IconPack />
                </nav>
                <RegistrationModal
                    id="loginModal"
                    openLogin={this.setTypeLogin}
                    openRegister={this.setTypeRigister}
                    currentSelect={this.state.type}
                >
                    {this.state.modal}
                </RegistrationModal>
            </>
        )
    }
}

function toggleDropdown() {
    $('.dropdown-menu').toggleClass('show');
}

function collapseNavbar() {
    $('.collapse').collapse('toggle');
}

function handleNavbarClick(e) {
    let div = e.target.parentElement.querySelector('.dropdown-menu');
    countNavbarDropdownBorder(div);
}

function countNavbarDropdownBorder(dropdown) {
    if (dropdown != null) {
        let DOMvalues = dropdown.getBoundingClientRect();
        let parent = dropdown.parentElement;
        let parent_spawn = parent.getBoundingClientRect().x;
        let navbar_width = document.querySelector('nav').offsetWidth
        let space = navbar_width - (parent_spawn + DOMvalues.width);
        if (space <= 0) {
            dropdown.style.float = 'right';
            dropdown.style.borderRadius = ".25rem 0 .25rem .25rem";
            dropdown.style.position = 'unset'
        }
        else {
            dropdown.style = '';
            dropdown.style.position = ''
        }
    }
};

window.onresize = function () {
    let div = document.querySelector('.dropdown-menu.show');
    countNavbarDropdownBorder(div);
}

// if (document.querySelector('#navbarDropdown') != null){
//     document.querySelector('#navbarDropdowns').on('click', function () {
//         console.log('working')
//         let div = document.querySelector('.dropdown-menu.show');
//         countNavbarDropdownBorder(div);
//     })
// }


// $('#navbarDropdown').on('show.bs.dropdown', function () {
//     let div = document.querySelector('.dropdown-menu.show');
//     countNavbarDropdownBorder(div);
// })


export default Navbar;