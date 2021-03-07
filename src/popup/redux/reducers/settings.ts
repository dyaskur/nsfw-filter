
import { SettingsActionTypes } from '../actions/settings'
import {
  TOGGLE_ENABLED,
  TOGGLE_LOGGING,
  SET_FILTER_EFFECT,
  SET_TRAINED_MODEL,
  SET_FILTER_STRICTNESS,
  SET_WHITELIST
} from '../actions/settings/settingsTypes'

export type SettingsState = {
  logging: boolean
  filterEffect: 'hide' | 'blur'
  enabled: boolean
  trainedModel: 'MobileNet_v1.1'
  whitelist: string[]
  filterStrictness: number
}

const initialState: SettingsState = {
  logging: false,
  enabled: true,
  filterEffect: 'blur',
  trainedModel: 'MobileNet_v1.1',
  whitelist: ['unknown'],
  filterStrictness: 55
}

export function settings (state = initialState, action: SettingsActionTypes): SettingsState {
  switch (action.type) {
    case TOGGLE_LOGGING:
      return { ...state, logging: !state.logging }
    case TOGGLE_ENABLED:
      return { ...state, enabled: !state.enabled }
    case SET_FILTER_EFFECT:
      return { ...state, filterEffect: action.payload.filterEffect }
    case SET_TRAINED_MODEL:
      return { ...state, trainedModel: action.payload.trainedModel }
    case SET_FILTER_STRICTNESS:
      return { ...state, filterStrictness: action.payload.filterStrictness }
    case SET_WHITELIST:
      return { ...state, whitelist: action.payload.whitelist }
    default:
      return state
  }
}
