import { DropDownSelectionParam, useStore } from '@jezvejs/react';
import { useCallback } from 'react';

import { useAppContext } from 'context/index.ts';

import { resizeBuffer, resizeCharacter } from 'store/actions.ts';
import { actions } from 'store/reducer.ts';

import { fontWeightsItems } from 'shared/constants.ts';
import type { AppState } from 'shared/types.ts';

import { RangeInputField } from './components/RangeInputField/RangeInputField.tsx';
import { ReadOnlyField } from './components/ReadOnlyField/ReadOnlyField.tsx';
import { SelectField } from './components/SelectField/SelectField.tsx';
import { SettingsPanelCollapsible } from './components/SettingsPanelCollapsible/SettingsPanelCollapsible.tsx';
import { SwitchField } from './components/SwitchField/SwitchField.tsx';

import './SettingsPanel.css';

export const SettingsPanel = () => {
  const context = useAppContext();
  const { getState, dispatch } = useStore<AppState>();
  const state = getState();

  const onToggleIntro = useCallback(() => {
    const st = getState();
    dispatch(actions.setIntro(!st.intro));
  }, []);

  const onChangeSpeed = useCallback((value: number) => {
    dispatch(actions.setSpeed(value));
  }, []);

  const onChangeGlitchesRatio = useCallback((value: number) => {
    dispatch(actions.setGlitchesRatio(value));
    dispatch(resizeBuffer(context));
  }, []);

  const onChangeThreadsRatio = useCallback((value: number) => {
    dispatch(actions.setThreadsRatio(value));
    dispatch(resizeBuffer(context));
  }, []);

  // Font collapsible block
  const onToggleFontCollapsible = useCallback(() => {
    dispatch(actions.toggleFontCollapsible());
  }, []);

  const onChangeFontSize = useCallback((value: number) => {
    dispatch(actions.setFontSize(value));
    dispatch(resizeCharacter(context));

    const { canvasWidth, canvasHeight } = getState();
    dispatch(actions.setCanvasSize({ canvasWidth, canvasHeight }));

    dispatch(resizeBuffer(context));
  }, []);

  const onChangeFontWeight = useCallback((selected: DropDownSelectionParam) => {
    if (selected && !Array.isArray(selected)) {
      dispatch(actions.setFontWeight(selected.id));
    }
  }, []);

  const onChangeCharWidth = useCallback((value: number) => {
    dispatch(actions.setCharWidth(value));
  }, []);

  const onChangeCharHeight = useCallback((value: number) => {
    dispatch(actions.setCharHeight(value));
  }, []);

  const onChangeHue = useCallback((value: number) => {
    dispatch(actions.setHue(value));
  }, []);

  // Wave effect collapsible block
  const onToggleWaveEffectCollapsible = useCallback(() => {
    dispatch(actions.toggleWaveEffectCollapsible());
  }, []);

  const onToggleWaveEffectOnClick = useCallback(() => {
    const st = getState();
    dispatch(actions.setWaveEffectOnClick(!st.waveEffectOnClick));
  }, []);

  const onChangeWaveEffectSize = useCallback((value: number) => {
    dispatch(actions.setWaveEffectSize(value));
  }, []);

  const onChangeWaveEffectSpeed = useCallback((value: number) => {
    dispatch(actions.setWaveEffectSpeed(value));
  }, []);

  return (
    <section className="data-section">

      <SwitchField
        id="introSwitch"
        name="introSwitch"
        label="Intro"
        checked={state.intro}
        onChange={onToggleIntro}
      />

      <ReadOnlyField
        id="threadscount"
        title="Threads"
        value={state.threads?.length ?? 0}
      />
      <ReadOnlyField
        id="glitchescount"
        title="Glitches"
        value={state.glitches?.length ?? 0}
      />
      <ReadOnlyField
        id="perfvalue"
        title="Performance"
        value={state.perfValue}
      />

      <RangeInputField
        id="speedInp"
        title="Speed"
        min={0}
        max={1000}
        step={1}
        value={state.speed}
        onChange={onChangeSpeed}
      />

      <RangeInputField
        id="threadsInp"
        title="Threads ratio"
        min={0}
        max={10}
        step={0.01}
        value={state.threadsRatio}
        onChange={onChangeThreadsRatio}
      />

      <RangeInputField
        id="glitchesInp"
        title="Glitches ratio"
        min={0}
        max={1}
        value={state.glitchesRatio}
        onChange={onChangeGlitchesRatio}
      />

      <SettingsPanelCollapsible
        title="Font"
        onStateChange={onToggleFontCollapsible}
        expanded={state.fontSettingsExpanded}
        animated
      >
        <RangeInputField
          id="fontSizeInp"
          title="Font size"
          min={0}
          max={100}
          step={0.01}
          value={state.fontSize}
          onChange={onChangeFontSize}
        />

        <SelectField
          id="fontWeightSelect"
          title="Font weight"
          items={fontWeightsItems}
          onChange={onChangeFontWeight}
          static
        />

        <RangeInputField
          id="charWidthInp"
          title="Char width"
          min={0}
          max={100}
          step={1}
          value={state.charWidth}
          onChange={onChangeCharWidth}
        />

        <RangeInputField
          id="charHeightInp"
          title="Char height"
          min={0}
          max={100}
          step={1}
          value={state.charHeight}
          onChange={onChangeCharHeight}
        />

        <RangeInputField
          id="hueInp"
          title="Hue"
          min={0}
          max={360}
          step={1}
          value={state.textColorHue}
          onChange={onChangeHue}
        />
      </SettingsPanelCollapsible>

      <SettingsPanelCollapsible
        title="Wave effect"
        onStateChange={onToggleWaveEffectCollapsible}
        expanded={state.waveEffectSettingsExpanded}
        animated
      >
        <SwitchField
          id="waveEffectSwitch"
          name="waveEffectSwitch"
          label="Create wave on click"
          checked={state.waveEffectOnClick}
          onChange={onToggleWaveEffectOnClick}
        />

        <RangeInputField
          id="waveEffectSizeInp"
          title="Size"
          min={1}
          max={50}
          step={1}
          value={state.waveEffectSize}
          onChange={onChangeWaveEffectSize}
        />

        <RangeInputField
          id="waveEffectSizeInp"
          title="Size"
          min={1}
          max={500}
          step={1}
          value={state.waveEffectSpeed}
          onChange={onChangeWaveEffectSpeed}
        />
      </SettingsPanelCollapsible>

      <div className="data-footer">
      </div>
    </section>
  );
};
