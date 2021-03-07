import React from 'react'
import { render } from 'react-dom'

// import Provider from 'react-redux/lib/components/Provider'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import 'antd/dist/antd.min.css'

import { Popup } from './components'
import { createChromeStore } from './redux/chrome-storage'
import { rootReducer } from './redux/reducers'
import { Theme } from './styles/Theme'

chrome.tabs.query({ active: true, currentWindow: true }, _tab => {
  (async () => {
    chrome.runtime.connect()
    const store = await createChromeStore({ createStore })(rootReducer)
    const currentUrl = _tab[0].url ?? ''
    const el = window.document.getElementById('popup')
    if (el !== null) { el.setAttribute('url', currentUrl) }
    render(
      (
        <Provider store={store} >
          <Theme>
            <Popup/>
          </Theme>
        </Provider>
      ),
      document.getElementById('popup')
    )
  })()
})
