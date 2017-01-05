const selector = require('./selector');

function isActiveTab(tabWebview) {
    return tabWebview.classList.contains('active');
}

function buildTabWebview(nextTabIndex) {
    const tabWebview = document.createElement('webview');
    tabWebview.src = 'new-tab-page.html';
    tabWebview.className = 'tab-webview active';
    tabWebview.setAttribute('data-tabindex', nextTabIndex);
    return tabWebview;
}

function buildTabButton(nextTabIndex) {
    const tabButton = document.createElement('button');
    tabButton.textContent = 'New Tab';
    tabButton.className = 'tab-button active';
    tabButton.setAttribute('data-tabindex', nextTabIndex);
    return tabButton;
}

function deactiveCurrentActiveTabs() {
    selector.activeTabButton().classList.remove('active');
    selector.activeTabWebview().classList.remove('active');
}

module.exports = function tabManagerFactory(blankPageUrl) {
    let nextTabIndex = 1;

    function createNewTabButton() {
        deactiveCurrentActiveTabs();
        const tabButton = buildTabButton(nextTabIndex);
        const tabWebview = buildTabWebview(nextTabIndex);
        document.body.appendChild(tabWebview);
        selector.tabBarDiv().insertBefore(tabButton, selector.createTabButton());
        bindTabHandlers(nextTabIndex);
        nextTabIndex += 1;
        selector.urlInput().value = 'http://';
    }

    function goToPage() {
        // TODO ensure http at beginning
        const urlInput = selector.urlInput();
        const url = urlInput.value;
        selector.activeTabWebview().src = url;
    }

    function changeActiveTab(newActiveTabIndex) {
        deactiveCurrentActiveTabs();
        selector.tabButton(newActiveTabIndex).classList.add('active');
        selector.tabWebview(newActiveTabIndex).classList.add('active');
        let activeTabSrc = selector.activeTabWebview().src;
        if (activeTabSrc === blankPageUrl) {
            activeTabSrc = 'http://';
        }
        selector.urlInput().value = activeTabSrc;
    }

    function bindTabHandlers(tabIndex) {
        const tabButton = selector.tabButton(tabIndex);
        tabButton.addEventListener('click', () => { changeActiveTab(tabIndex); });
        const tabWebview = selector.tabWebview(tabIndex);
        tabWebview.addEventListener('will-navigate', (e) => {
            if (isActiveTab(tabWebview)) {
                selector.urlInput().value = e.url;
            }
        });
        tabWebview.addEventListener('did-navigate', () => {
            tabButton.textContent = tabWebview.getTitle();
        });
    }

    return {
        createNewTabButton,
        goToPage,
        changeActiveTab,
        bindTabHandlers
    };
};
