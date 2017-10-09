Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/components/InputTextWithLabel.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _InputTextWithLabel=require('../styles/components/InputTextWithLabel');var _InputTextWithLabel2=_interopRequireDefault(_InputTextWithLabel);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var InputTextWithLabel=function(_React$Component){_inherits(InputTextWithLabel,_React$Component);function InputTextWithLabel(){_classCallCheck(this,InputTextWithLabel);return _possibleConstructorReturn(this,(InputTextWithLabel.__proto__||Object.getPrototypeOf(InputTextWithLabel)).apply(this,arguments));}_createClass(InputTextWithLabel,[{key:'render',value:function render(){var _props=this.props,_props$multiline=_props.multiline,multiline=_props$multiline===undefined?false:_props$multiline,_props$value=_props.value,value=_props$value===undefined?'':_props$value;var textStyle=multiline?[_InputTextWithLabel2.default.input,_InputTextWithLabel2.default.input_multi_lines]:_InputTextWithLabel2.default.input;return _react2.default.createElement(_reactNative.View,{style:_InputTextWithLabel2.default.main,__source:{fileName:_jsxFileName,lineNumber:51}},_react2.default.createElement(_reactNative.Text,{style:_InputTextWithLabel2.default.label,__source:{fileName:_jsxFileName,lineNumber:52}},this.props.label,':'),_react2.default.createElement(_reactNative.TextInput,{style:textStyle,underlineColorAndroid:'transparent',multiline:multiline,numberOfLines:multiline?3:1,value:value,onChangeText:this.props.onChangeText,__source:{fileName:_jsxFileName,lineNumber:53}}));}}]);return InputTextWithLabel;}(_react2.default.Component);exports.default=InputTextWithLabel;