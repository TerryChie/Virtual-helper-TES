document.addEventListener('DOMContentLoaded', () => {

    const doneLabs = document.getElementById('doneLabs');
    let doneLabsNumber = parseInt(doneLabs.innerText);

    if(Number.isFinite(parseInt(localStorage.getItem('doneLabs')))) {
        doneLabsNumber = parseInt(localStorage.getItem('doneLabs'));
        doneLabs.innerText = doneLabsNumber;
    }

    const clickHere = document.getElementById('plusOne');
    clickHere.addEventListener('click', () => {
        doneLabsNumber += 1;
        doneLabs.innerText = doneLabsNumber;
        localStorage.setItem('doneLabs', `${doneLabsNumber}`)
    })
})