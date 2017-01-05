const selector = {
    urlInput() {
        return document.querySelector('#url-input');
    },
    goButton() {
        return document.querySelector('#go-button');
    },
    createTabButton() {
        return document.querySelector('#create-tab-button');
    },
    tabBarDiv() {
        return document.querySelector('#tab-bar-div');
    },
    activeTabButton() {
        return document.querySelector('.tab-button.active');
    },
    activeTabWebview() {
        return document.querySelector('.tab-webview.active');
    },
    tabButton(tabIndex) {
        return document.querySelector(`[data-tabindex='${tabIndex}'].tab-button`);
    },
    tabWebview(tabIndex) {
        return document.querySelector(`[data-tabindex='${tabIndex}'].tab-webview`);
    }
};

module.exports = selector;
