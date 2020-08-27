import React, { Component } from 'react'
import { t } from './Utils'
import './styles/Partners.css';
import { Modal } from './Modal'
import { InputField, TextArea } from './Input'
import $ from 'jquery'
import { sendPartnerInfo, getPartnerCount, getPartner, getPartners } from './API'


function ourPartners(partners) {
    return (
        <div className='partnersLogoBox'>
            {partners.map((partner, index) => {
                return (
                    <div className='partnerLogoBox' key={index}>
                        <img className='partnerLogo' src={partner} />
                    </div>
                )
            })}
        </div>
    )
}

function sendPartnerApplication() {
    let info = {
        name: document.querySelector('#partnerName').value,
        company: document.querySelector('#partnerCompany').value,
        contact: document.querySelector('#chosenContact').value,
        eplanation: document.querySelector('#partnerExplanation').value
    }
    $.ajax({
        url: sendPartnerInfo,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('#target').html(data.msg);
        },
        data: JSON.stringify(info)
    });
}

class Partners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partners: []
        }
    }
    componentDidMount() {

        fetch(getPartners, { cache: "no-store" })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    partners: json
                })
            })


        // fetch(getPartnerCount)
        //     .then(response => response.text())
        //     .then(count => {
        //         for (let i = 0; i < count; i++) {
        //             fetch(getPartner, { cache: "no-store" })
        //                 .then(response => response.blob())
        //                 .then(blob => {
        //                     var reader = new FileReader();
        //                     reader.readAsDataURL(blob);
        //                     var base64data;
        //                     reader.onloadend = function () {
        //                         base64data = reader.result;
        //                         this.setState({
        //                             partners: this.state.partners.concat(base64data)
        //                         })
        //                     }.bind(this)
        //                 })
        //         }
        //     })
    }
    render() {
        return (
            <div className='partnersBox'>
                <h2 className='partnersTitle'>{t('our_partners_msg')}</h2>
                {this.state.partners.length > 0 ? ourPartners(this.state.partners) : null}
                <h3 className='becomeApartner'>{t('become_a_partner_msg')}</h3>
                <p className='partnershipExplanation'>{t('partnership_msg')}</p>
                <button type="button" className="btn btn-dark my-2 my-sm-0 one-line m-0" data-toggle="modal"
                    data-target="#partnerModal">{t('become_a_partner_btn_msg')}</button>
                <Modal
                    id='partnerModal'
                    title={t('become_a_partner_msg')}
                    body={<>
                        <InputField id='partnerName' label={t('name_label_msg')} />
                        <InputField id='partnerCompany' label={t('company_label_msg')} />
                        <InputField id='chosenContact' label={t('chosen_contact_msg')} />
                        <TextArea id='partnerExplanation' label={t('explain_partnership_msg')} />
                    </>}
                    buttons={<>
                        <button type="button" id='sendPartnerApplication' onClick={sendPartnerApplication} data-dismiss="modal" className="btn btn-dark my-2 my-sm-0 one-line w-100">{t('send_msg')}</button></>}
                />
            </div>
        )
    }
}


export default Partners