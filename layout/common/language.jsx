const { Component } = require('inferno');
const path = require("path");
const translationMap = require('../../../../translationMap');
const S = require("string");

function getLanguageDisplayName(s,languageDisplayNameMap){
    return languageDisplayNameMap&&languageDisplayNameMap[s]?languageDisplayNameMap[s]:s;
}
function getPath(lang,s,defaultLang){
    if(s==="[currentLanguage]")return s;
    if(lang==defaultLang)return path.join("/",s);
    else return path.join("/",lang,s);
}
function parseName(s){
    return S(s).latinise().replaceAll(" ","-").toString();
}

module.exports = class Language extends Component{
    render() {
        const {page,config,helper} = this.props;
        const currentLanguage = page.lang || page.language || config.language;
        const defaultLanguage = config.default_language;
        let languageIndexedList = {};
        let languageDisplayNameMap = config.lang_display_name;
        if(helper.is_page() && page.i18n){
            languageIndexedList = page.i18n;
        }else if(helper.is_post() && page.i18n){
            Object.keys(page.i18n).forEach(lang=>languageIndexedList[lang]=path.join('posts',page.i18n[lang]));
        }else if(helper.is_home()){
            Object.keys(languageDisplayNameMap).forEach(lang=>languageIndexedList[lang]='');
        }else if(helper.is_categories()){
            Object.keys(languageDisplayNameMap).forEach(lang=>languageIndexedList[lang]='categories');
        }else if(helper.is_tags()){
            Object.keys(languageDisplayNameMap).forEach(lang=>languageIndexedList[lang]='tags');
        }else if(helper.is_archive()){
            Object.keys(languageDisplayNameMap).forEach(lang=>languageIndexedList[lang]='archives');
        }else if(helper.is_category()){
            let rawMap = translationMap.category[currentLanguage][page.category];
            if(rawMap){
                Object.keys(rawMap).forEach(lang=>languageIndexedList[lang]=path.join('categories',parseName(rawMap[lang])));
            }
        }else if(helper.is_tag()){
            let rawMap = translationMap.tag[currentLanguage][page.tag];
            if(rawMap){
                Object.keys(rawMap).forEach(lang=>languageIndexedList[lang]=path.join('tags',parseName(rawMap[lang])));
            }
        }
        languageIndexedList[currentLanguage]="[currentLanguage]";
        return <span class="navbar-item language" title="语言 Language Ryannūs 言语ㄜㄙ">
            <i class="fas fa-language" style="margin-right: 0.5rem;"></i>
            <select>
                {Object.keys(languageIndexedList).sort((a,b)=>a==currentLanguage?-1:b==currentLanguage?1:0).map(lang=>{
                    return <option data-url={getPath(lang,languageIndexedList[lang],defaultLanguage)}>{getLanguageDisplayName(lang,languageDisplayNameMap)}</option>
                })}
            </select>
        </span>
    }
}