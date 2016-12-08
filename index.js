(function() {
    const urlInput = document.querySelector('#url-input');
    const goButton = document.querySelector('#go-button');
    const webpageIframe = document.querySelector('#webpage-iframe');

    function goToPage() {
        // TODO ensure http at beginning
        const url = urlInput.value;
        webpageIframe.src = url;
    }

    goButton.addEventListener('click', goToPage);

    urlInput.addEventListener('keyup', (e) => {
        // enter
        if (e.keyCode === 13) {
            goToPage();
        }
    });
})();
