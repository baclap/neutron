const selector = require('./selector');

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
        bindTabClickHandler(nextTabIndex);
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

    function bindTabClickHandler(tabIndex) {
        selector.tabButton(tabIndex).addEventListener('click', () => { changeActiveTab(tabIndex); });
    }

    return {
        createNewTabButton,
        goToPage,
        changeActiveTab,
        bindTabClickHandler
    };
};
