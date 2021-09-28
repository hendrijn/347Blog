(function(){
    const button = document.querySelector('#btn');
    const body = document.querySelector('body');

    button.addEventListener('click', changeColor);

    function changeColor(){
        hex = '#' + document.querySelector('input').value;
        body.style.backgroundColor = hex;
    }
} ) ();