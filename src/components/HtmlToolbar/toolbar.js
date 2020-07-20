import { mxConstants as MxConstants } from 'mxgraph/javascript/mxClient';

const logoIcon = require('@assets/logo.png');
const inputIcon = require('@assets/mxgraph/images/input.png');
const dataIcon = require('@assets/mxgraph/images/data.png');

const style = {
  // fillColor: 'transparent',
  strokeColor: '#333',
  strokeWidth: '1',
  shape: MxConstants.SHAPE_LABEL,
  align: MxConstants.ALIGN_CENTER,
  verticalAlign: MxConstants.ALIGN_CENTER,
  imageAlign: MxConstants.ALIGN_CENTER,
  imageVerticalAlign: MxConstants.ALIGN_CENTER
};
export const toolbarItems = [
  {
    icon: logoIcon,
    title: 'vue',
    width: 100,
    height: 100,
    style
  },
  {
    icon: inputIcon,
    title: '输入',
    width: 100,
    height: 100,
    style
  },
  {
    icon: dataIcon,
    title: '数据',
    width: 100,
    height: 100,
    style
  }
];
