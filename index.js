let owm=require("./owm-supported-cities")
let countries=require("./countries")
let fs=require("fs")

countries=countries
.filter((c)=>c.capital.length>0)
.filter((c)=>c.capital[0].length>0)
.map((c)=>{
    return {
        code:c.cca2,
        capital:c.capital[0]
    }
})

/*
{
    "id": 707860,
    "name": "Hurzuf",
    "country": "UA",
    "coord": {
      "lon": 34.283333,
      "lat": 44.549999
    }
*/

function clean(str){
    let replacements=[
        ["City of Victoria","Central"],//japoneses locos (?)
        ["Rome","Roma"],//Si
        ["South Tarawa","Tarawa"],//Hay 2 tarawa en owm, me quedo con la primera (no la del sur)
        ["El Aaiún","Laayoune / El Aaiun"],
        ["Asmera","Asmara"],
        ["Palikir - National Government Center","Palikir"],
        ["Nay Pyi Taw","Naypyidaw"],//typo de ellos
        ["King Edward Point","South Georgia and the South Sandwich Islands"],//Asigno una distinta directamente
        ["Ngerulmud","Koror Town"],//la capital no figura, pongo la vieja
        ["ș","s"],
        ["ă","a"],
        ["å","a"],
        ["ñ","n"],
        ["ç","c"],
        ["'",""],
        ["St.","Saint"],
        ["á","a"],
        ["é","e"],
        ["í","i"],
        ["ó","o"],
        ["ú","u"],
        ["City of",""],
        ["city of",""],
        ["city",""],
        ["-"," "],
        [" ",""],
        [",",""],
        ["ē","e"]
        
        
    ]
    let strf=str
    for(r of replacements){
        strf=strf.replace(r[0],r[1])
    }
    strf=strf.toLocaleLowerCase()
    for(r of replacements){
        strf=strf.replace(r[0],r[1])
    }
    return strf
}
function capitalSupported(country){
    for (city of owm){
        if(city.country == country.code 
            && clean(city.name)==clean(country.capital)){
            
            return city.name

        }
    }
    return null
}
let matching=[]
let notMatching=[]
for (country of countries){
    console.log(country)
    let capitalName=capitalSupported(country)
    if(capitalName){
        matching.push(capitalName + "," + country.code)
    }else{
        notMatching.push(country.capital + "," + country.code)
    }
}

fs.writeFileSync("./matched-cities.json",JSON.stringify(matching,null,2),"utf-8")
fs.writeFileSync("./unmatched-cities.json",JSON.stringify(notMatching,null,2),"utf-8")