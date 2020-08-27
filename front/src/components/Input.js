import React from 'react'
import './styles/Input.css';
import {t} from './Utils'


function InputField(params) {
  return (
    <>
    <label>{params.label}</label>
    <div className="input-group mb-3">
      <input id={params.id} type="text" className="form-control rounded-0" placeholder={params.label} aria-label="Username" aria-describedby="basic-addon1"></input>
    </div>
    </>
  )
}

function TextArea(params) {
  return (
    <>
    <label>{params.label}</label>
    <div className="input-group mb-3">
      <textarea id={params.id} type="text" rows='10' className="form-control rounded-0" placeholder={params.label}></textarea>
    </div>
    </>
  )
}


class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { showPass: false };
    this.showPassword = this.showPassword.bind(this)
  }
  showPopUp() {
    var popup = document.getElementById("popup");
    popup.classList.add("show");
  }
  closePopUp() {
    var popup = document.getElementById("popup");
    popup.classList.remove("show");
  }
  showPassword() {
    this.setState({
      showPass: !this.state.showPass
    })
  }
  render() {
    return (
      <>
      <label>{this.props.label}</label>
      <div className="input-group mb-3">
        <input type={this.state.showPass ? "text" : 'password'} className="form-control rounded-0" placeholder={this.props.label} aria-label='Password' aria-describedby="basic-addon2"></input>
        <div className="input-group-append">
          <span className="input-group-text popup rounded-0" onClick={this.showPassword} onMouseEnter={this.showPopUp} 
                onMouseLeave={this.closePopUp} id="basic-addon2">
                 {this.state.showPass ? "\u1F441" : "@"}
            <span className='popuptext' id='popup'>
              {this.state.showPass ? t('hide password') : t('show password')}
            </span>
          </span>
        </div>
      </div>
      </>
    )
  }
}

// function PasswordField(){
//   function showPopUp() {
//     var popup = document.getElementById("popup");
//     popup.classList.add("show");
//   }
//   function closePopUp() {
//     var popup = document.getElementById("popup");
//     popup.classList.remove("show");
//   }
//   function showPassword() {
//     this.setState({
//       showPass: !this.state.showPass
//     })
//     // this.state.showPass = !this.state.showPass;
//   }
// }

export { InputField, PasswordField, TextArea }