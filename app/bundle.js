(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const selector = require('./selector');
const tabManagerFactory = require('./tab-manager-factory');

document.addEventListener('DOMContentLoaded', () => {
    const tabManager = tabManagerFactory(selector.activeTabWebview().src);
    selector.goButton().addEventListener('click', tabManager.goToPage);
    selector.urlInput().addEventListener('keyup', (e) => {
        // enter
        if (e.keyCode === 13) {
            tabManager.goToPage();
        }
    });
    selector.createTabButton().addEventListener('click', tabManager.createNewTabButton);
    // bind tab click handler to initial tab
    tabManager.bindTabHandlers(0);
});

},{"./selector":2,"./tab-manager-factory":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./selector":2}]},{},[1]);
