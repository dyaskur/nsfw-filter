import { createStore } from 'redux'

import { createChromeStore } from '../popup/redux/chrome-storage'
import { rootReducer } from '../popup/redux/reducers'

import { DOMWatcher } from './DOMWatcher/DOMWatcher'
import { ImageFilter } from './Filter/ImageFilter'

const init = (): void => {
  const imageFilter = new ImageFilter()

  // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  //   console.log(tabs[0].url, 'ini dari content')
  // })

  createChromeStore({ createStore })(rootReducer)
    .then(store => {
      const { enabled, filterEffect } = store.getState().settings
      // console.log(enabled, filterEffect, 'apa ini', currentUrl, 'yaskur')

      const currentHost = new URL(window.location.href).hostname
      console.log(currentHost, window.location.href, 'yaskur url')

      if (enabled) {
        const domWatcher = new DOMWatcher(imageFilter)
        domWatcher.watch()
      }

      imageFilter.setSettings({ filterEffect })
    })
    .catch(error => {
      console.warn(error)
      imageFilter.setSettings({ filterEffect: 'blur' })
    })
}

// Ignore iframes, https://stackoverflow.com/a/326076/10432429
if (window.self === window.top) init()
