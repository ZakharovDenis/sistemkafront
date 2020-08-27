import React from 'react'
import './styles/Modal.css';
import {t} from './Utils'

function Modal(params) {
    return (
        <div className="modal fade" id={params.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div className={'modal-dialog ' + (params.lg == 'true' ? 'modal-lg' : '')} role="document">
                <div className={(params.transparent ? 'transparent' : "") + " modal-content"}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{params.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {params.body}
                    </div>
                    <div className="modal-footer">
                        {params.buttons}
                    </div>
                </div>
            </div>
        </div>
    )
}



function RegistrationModal(props){
    let login_methods = ['google', 'apple', 'facebook', 'vk']
    return (
        <div className="modal fade" tabIndex="-1" role="dialog" id={props.id}>
            <div className="modal-dialog modal-dialog-centered " role="document">
                <div className="modal-content transparent">
                    <div className="modal-logo">
                        {/* <h5 className="modalLogo" id="exampleModalLabel">Sistemka</h5> */}
                        <div className='loginModalOptions'>
                            <span onClick={props.openLogin} className={(props.currentSelect==='login' ? "optionActive" : "") + " loginModalOption float-left" }>{t('login')}</span>
                            <span onClick={props.openRegister}  className={(props.currentSelect==='register' ? "optionActive" : "") + " loginModalOption float-right" }>{t('register')}</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        {props.children != null ? props.children : <></>}
                        <div className='divider'>
                            <hr className='line' />
                                <span className='divider-text'>{t('or')}</span>
                            <hr className='line'/>
                        </div>
                        <div className='buttonBox'>
                            {login_methods.map(login_method => {
                                return(
                                    <div className={login_method+'Button buttonBoxButton'} key={login_method}>
                                        <img src={require('../images/'+login_method+'Logo.svg') } width="15" height="15" />
                                    </div> 
                                )
                            })}
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">Save changes</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

class RegistrationModal2 extends React.Component {
    constructor(params) {
        super(params);
        this.params = params;
        this.state = { isLogin: params.type }
        this.setState = this.setState.bind(this)
    }
    changeType(newType) {
        this.setState({
            isLogin: newType,
        })
    }
    render() {
        let rndr = <></>
        if (this.params.children != null){
            rndr = this.params.children
            // {this.params.children.map(row => {
            //     return row
            // })}
        }
        // console.log(this.params.children)
        return (
            <div className="modal fade" tabIndex="-1" role="dialog" id={this.params.id}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content transparent">
                        <div className="modal-logo">
                            <h5 className="modalLogo" id="exampleModalLabel">Botissimo</h5>
                            <div className='loginModalOptions'>
                                <span className='loginModalOption float-left'>Login</span>
                                <span className='loginModalOption float-right'>Register</span>
                            </div>
                        </div>
                        <div className="modal-body">
                            {this.params.children != null ? this.params.children : <></>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Save changes</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>


            // <div className="modal fade login-modal" id={this.params.id} tabIndex="-1" role="dialog" aria-labelledby={this.params.id + "Label"}
            //     aria-hidden="true">
            //     <div className="modal-dialog" role="document">
            //         <div className='modalContent'>
            //             <div className="modal-logo transparent">
            //                 <h5 className="modalLogo" id="exampleModalLabel">Botissimo</h5>
            //                 <div className='loginModalOptions'>
            //                     <span className='loginModalOption float-left'>Login ::after</span>
            //                     <span className='loginModalOption float-right'>Register ::after</span>
            //                 </div>
            //                 {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            //                     <span aria-hidden="true">&times;</span>
            //                 </button> */}
            //             </div>
            //             <div className="modal-body">
            //                 {this.params.children.map(row => {
            //                     return (<>{row}</>)
            //                 })}
            //             </div>
            //             <div className="modal-footer">
            //                 <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            //                 <button type="button" className="btn btn-primary">Save changes</button>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        )
    }
}

export { Modal, RegistrationModal };