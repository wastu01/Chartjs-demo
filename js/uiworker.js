function I(id) {
    return document.getElementById(id);
}

console.log(I('start'));

// async

function hideButton() {
    I('start').classList.add('hide');   
}


function hideChart() {
    I('chart').classList.add('hide');   
}

function showButton() {
    I('start').classList.remove('hide');   
}


function showChart() {
    I('chart').classList.remove('hide');   
}



