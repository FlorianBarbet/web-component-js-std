console.log('common loading...');
// this file should be independent of others !

if (!String.prototype.format)
    /*Cannot be a Lambda*/
    String.prototype.format = function (toFormat) {
        /*That's not optimize, should use sed or something like that to make it better*/
        let str = this;
        Object.entries(toFormat).forEach(([k,v]) => {
            str = str.replaceAll(`{${k}}`, v);
        });
        return str;
    };


function openControlPad(){
    if (document.querySelector('.control-pad').style.display === 'flex') {
        exitControlPad();
        return;
    }
    document.querySelector('.control-pad').style.display = 'flex';
}

function exitControlPad(){
    document.querySelector('.control-pad').style.display = 'none';
}