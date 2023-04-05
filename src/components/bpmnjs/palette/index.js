import FlowablePaletteProvider from './FlowablePaletteProvider';

export default {
  // 可以考虑覆盖自带的 paletteProvider 全部自己定义
  __init__: ['paletteProvider'],
  paletteProvider: ['type', FlowablePaletteProvider],
};
