Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _class,_temp,_initialiseProps,_jsxFileName='src/screens/EditScreen.js';var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _reactRedux=require('react-redux');var _styles=require('../styles/');var _screens=require('../styles/screens');var _StatusBarButtonHolder=require('../components/StatusBarButtonHolder');var _StatusBarButtonHolder2=_interopRequireDefault(_StatusBarButtonHolder);var _InputTextWithLabel=require('../components/InputTextWithLabel');var _InputTextWithLabel2=_interopRequireDefault(_InputTextWithLabel);var _ListSelectable=require('../components/ListSelectable');var _ListSelectable2=_interopRequireDefault(_ListSelectable);var _NormalButton=require('../components/NormalButton');var _NormalButton2=_interopRequireDefault(_NormalButton);var _DB=require('../constants/DB');var _WordActions=require('../api/WordActions');var _AsyncDB=require('../api/AsyncDB');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var EditScreen=(_temp=_class=function(_React$Component){_inherits(EditScreen,_React$Component);function EditScreen(props){_classCallCheck(this,EditScreen);var _this=_possibleConstructorReturn(this,(EditScreen.__proto__||Object.getPrototypeOf(EditScreen)).call(this,props));_initialiseProps.call(_this);var params=_this.props.navigation.state.params;_this.state={id:typeof params==='undefined'?-1:params.word[_DB.INDEX],word:typeof params==='undefined'?'':params.word[_DB.WORD],oldWord:typeof params==='undefined'?'':params.word[_DB.WORD],def:typeof params==='undefined'?'':params.word[_DB.DEFINITION],n:typeof params==='undefined'?false:params.word[_DB.NOUN],v:typeof params==='undefined'?false:params.word[_DB.VERB],adj:typeof params==='undefined'?false:params.word[_DB.ADJECTIVE],adv:typeof params==='undefined'?false:params.word[_DB.ADVERB]};return _this;}_createClass(EditScreen,[{key:'render',value:function render(){var _this2=this;var vocabTypes=[{key:'Noun',fill:this.state.n,onPress:function onPress(){return _this2.setState(function(prevState){return{n:!prevState.n};});}},{key:'Verb',fill:this.state.v,onPress:function onPress(){return _this2.setState(function(prevState){return{v:!prevState.v};});}},{key:'Adjective',fill:this.state.adj,onPress:function onPress(){return _this2.setState(function(prevState){return{adj:!prevState.adj};});}},{key:'Adverb',fill:this.state.adv,onPress:function onPress(){return _this2.setState(function(prevState){return{adv:!prevState.adv};});}}];return _react2.default.createElement(_reactNative.View,{style:_screens.screenGeneral,__source:{fileName:_jsxFileName,lineNumber:114}},_react2.default.createElement(_InputTextWithLabel2.default,{multiline:false,label:'Word',value:this.state.word,onChangeText:function onChangeText(text){return _this2.setState({word:text});},__source:{fileName:_jsxFileName,lineNumber:115}}),_react2.default.createElement(_InputTextWithLabel2.default,{multiline:true,label:'Definition',value:this.state.def,onChangeText:function onChangeText(text){return _this2.setState({def:text});},__source:{fileName:_jsxFileName,lineNumber:118}}),_react2.default.createElement(_ListSelectable2.default,{items:vocabTypes,__source:{fileName:_jsxFileName,lineNumber:121}}),_react2.default.createElement(_NormalButton2.default,{onPress:this._onEdit,__source:{fileName:_jsxFileName,lineNumber:122}}));}}]);return EditScreen;}(_react2.default.Component),_class.navigationOptions=function(_ref){var navigation=_ref.navigation;var params=navigation.state.params;return{title:'Edit Word',headerTintColor:'white',headerStyle:_styles.appBarStyle,headerRight:_react2.default.createElement(_StatusBarButtonHolder2.default,{onDelete:function onDelete(){return console.log('Delete: '+params.word['word']);},__source:{fileName:_jsxFileName,lineNumber:75}})};},_initialiseProps=function _initialiseProps(){var _this3=this;this._onEdit=function(){var obj={};obj[_DB.INDEX]=_this3.state.id;obj[_DB.WORD]=_this3.state.word;obj[_DB.DEFINITION]=_this3.state.def;obj[_DB.NOUN]=_this3.state.n;obj[_DB.VERB]=_this3.state.v;obj[_DB.ADJECTIVE]=_this3.state.adj;obj[_DB.ADVERB]=_this3.state.adv;var wordNotExisted=true;var theSameWords=_this3.state.word.toLowerCase()===_this3.state.oldWord.toLowerCase();if(theSameWords){(0,_AsyncDB.mergeItem)(_this3.state.oldWord,obj);}else{wordNotExisted=_this3.props.allWords.findIndex(function(wordObj,index){return wordObj[_DB.WORD]===_this3.state.word;})===-1;if(wordNotExisted){(0,_AsyncDB.deleteItem)(_this3.state.oldWord,function(){(0,_AsyncDB.setItem)(_this3.state.word,obj);});}else{_reactNative.Alert.alert('Possible duplication','The word '+_this3.state.word+' already exists. '+'The old word will be replaced. Do you wish to continue?',[{text:'Cancel'},{text:'Delete',onPress:function onPress(){(0,_AsyncDB.multiRemove)([_this3.state.oldWord,_this3.state.word],function(){(0,_AsyncDB.setItem)(_this3.state.word,obj);});}}],{cancelable:false});}}_this3.props.onEdit(_this3.state.id,_this3.state.word,_this3.state.def,_this3.state.n,_this3.state.v,_this3.state.adj,_this3.state.adv,_this3.state.oldWord,wordNotExisted);_this3.props.navigation.goBack();};},_temp);var mapStateToProps=function mapStateToProps(state,ownProps){return{allWords:state.wordData.ALL_WORDS};};var mapDispatchToProps=function mapDispatchToProps(dispatch,ownProps){return{onEdit:function onEdit(id,word,def,n,v,adj,adv){return dispatch((0,_WordActions.editWord)(id,word,def,n,v,adj,adv));}};};exports.default=(0,_reactRedux.connect)(mapStateToProps,mapDispatchToProps)(EditScreen);