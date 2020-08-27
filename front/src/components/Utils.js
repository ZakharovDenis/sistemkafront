import russian from '../src_files/russian'
import english from '../src_files/english'


function getCookie2(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

function getCookie(name){
    return sessionStorage.getItem(name)
}

function t(word){
    let language = getCookie('language')
    if (!language){
        sessionStorage.setItem('language', 'russian')
        return t(word);
    }
    if (language === 'russian'){
        let translate = russian[word];
        if (translate === undefined){
            return word;
        }
        return translate;
    }
    if (language === 'english'){
        let translate = english[word];
        if (translate === undefined){
            return word;
        }
        return translate;
    }
    return word;
}

export {getCookie, t}