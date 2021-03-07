import Select from 'antd/lib/select'
import Slider from 'antd/lib/slider'
import Switch from 'antd/lib/switch'
// import {Select,Slider,Switch} from 'antd'
import React from 'react'
// import useDispatch from 'react-redux/lib/hooks/useDispatch'
// import useSelector from 'react-redux/lib/hooks/useSelector'
import { useDispatch, useSelector } from 'react-redux'

import { setFilterStrictness, toggleEnabled } from '../../redux/actions/settings'
import { setFilterEffect, setTrainedModel } from '../../redux/actions/settings/index'
import { RootState } from '../../redux/reducers'
import { SettingsState } from '../../redux/reducers/settings'
import { StatisticsState } from '../../redux/reducers/statistics'

import { Container, DropdownRow, Stats } from './styles'

const { Option } = Select

export const Production: React.FC = (prop) => {
  const dispatch = useDispatch()
  const {
    enabled,
    filterStrictness,
    trainedModel,
    filterEffect
  } = useSelector<RootState>((state) => state.settings) as SettingsState
  const { totalBlocked } = useSelector<RootState>((state) => state.statistics) as StatisticsState

  return (
    <Container>
      <Stats>
        <span>Total blocked: {totalBlocked}</span>
      </Stats>

      <Switch checked={enabled}
        onChange={() => dispatch(toggleEnabled())} />

      <div>{enabled ? 'This extension is Enabled' : 'This extension is not enabled'}</div>

      <Slider
        min={1}
        max={100}
        onChange={(value: number) => dispatch(setFilterStrictness(value))}
        value={filterStrictness}
      />

      <DropdownRow>
        <span>Filter effect</span>
        <Select
          defaultValue={filterEffect}
          style={{ width: 140 }}
          onChange={value => dispatch(setFilterEffect(value))}
        >
          <Option value="hide">Hide</Option>
          <Option value="blur">Blur</Option>
        </Select>
      </DropdownRow>

      <DropdownRow>
        <span>Trained model</span>
        <Select
          defaultValue={trainedModel}
          style={{ width: 140 }}
          onChange={value => dispatch(setTrainedModel(value))}
        >
          <Option value={trainedModel}>{trainedModel}</Option>
        </Select>
      </DropdownRow>

    </Container>
  )
}
