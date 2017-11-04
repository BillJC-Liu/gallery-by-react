require('normalize.css/normalize.css');
require('styles/App.css');
import ReactDOM from 'react-dom';
// 这里得到的只是图片信息
let imageDatas =  require('../Data/imageDatas.json');

import React from 'react';



//将图片的信息（图片名），转换为图片的真实路径
function genImageURL(imageDatasArr){
	for(var i=0, j=imageDatasArr.length;i<j; i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData
	}
	return imageDatasArr;
}


imageDatas = genImageURL(imageDatas);

class ImgFigure extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	
	/**
	 * [handleClick imgFigure的点击处理函数]
	 * @return {[type]} [description]
	 */
	handleClick(e){
		//点击图片后
		//判断图片是否居中，是居中的图片就让其调用inverse翻转函数，不是居中的图片则调用center居中函数
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render(){

		var  styleObj = {};

		// 如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		// 如果图片的旋转角度有值并且不为0 ， 添加旋转角度
		if(this.props.arrange.rotate){
			(['Moz','Webkit','Mx','']).forEach((value) => {
			  styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
			});
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11; 
		}

		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? " is-inverse":""; 

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img  src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title"> {this.props.data.title} </h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}
	
	/**
	 * [get30DegRandom  获取0-30度之间的一个任意正负值]
	 * @return {[type]} [description]
	 */
	let get30DegRandom = () => {
		return ((Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random() * 30) );
	}

/**
 * [getRangeRandom 获取区间内一个随机值]
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 * @return {[type]}      [description]
 */
function getRangeRandom(low,high){
	return Math.floor( Math.random() * (high - low) + low ) ;
}

//控制组件 
class ControllersUnit extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e){

		//如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	}

	render(){
		var controllersUnitClassName = "controller-unit";
			//如果对应的是居中图片，显示控制按钮的居中态
			if(this.props.arrange.isCenter){
				controllersUnitClassName += " is-center";
				
				//如果同时对应的是翻转图片，显示控制按钮的翻转态
				if(this.props.arrange.isInverse){
					controllersUnitClassName += " is-inverse";
				}
			}
			
		return (
			<span className={controllersUnitClassName} onClick={this.handleClick}></span>
		);
	}
}

// 主要入口
class AppComponent extends React.Component {
	
	constructor(props){
		super(props);
		this.Constant = {
			centerPos:{  
				left:0,
				right:0
			},
			hPosRange:{  //水平方向的取值范围
				leftSecX:[0,0],
				rightSecX:[0,0],
				y:[0,0]
			},
			vPosRange:{	 //垂直方向的取值范围
				x:[0,0],
				topY:[0,0]
			},
		};

		this.state = {
	      imgsArrangeArr: [
	        //{
	        //  pos:{
	        //    left:'0',
	        //    top:'0'
	        //  },
	        //    rotate:0, //旋转角度
	        //isInverse:false //图片正反面标记  false为正面  true 反面
	        //isCenter:false 图片是否居中
	        //}
	      ]
	    };
	}

	/**
	 * [inverse 翻转图片函数]
	 * @param  {[type]} index [输入当前被执行inverse操作的图片对应的图片信息数组的index值]
	 * @return {[type]}       [这是一个闭包函数，其中return一个真正待被执行的函数]
	 */
	inverse(index){
		return () => {
			let imgsArrangArr = this.state.imgsArrangeArr;

			// 取反 正面变反面，反面变正面
			imgsArrangArr[index].isInverse = ! imgsArrangArr[index].isInverse;

			// 修改state 重新渲染
			this.setState({
				imgsArrangeArr:imgsArrangArr
			})
		}
	}


	/**
	 * [rearrange 重新布局所有的图片]
	 * @param  {[type]} centerIndex [用来指定居中哪个图片]
	 * @return {[type]}             [description]
	 */
	rearrange(centerIndex){
		// 拿变量
		let imgsArrangeArr = this.state.imgsArrangeArr,
	      	Constant = this.Constant,
	      	centerPos = Constant.centerPos,
	      	hPosRange = Constant.hPosRange,
	      	vPosRange = Constant.vPosRange,
		    hPosRangeLeftSecX = hPosRange.leftSecX,
		    hPosRangeRightSecX = hPosRange.rightSecX,
	      	hPosRangeY = hPosRange.y,
	      	vPosRangeTopY = vPosRange.topY,
	      	vPosRangeX = vPosRange.x,

			// 上侧区域图片的状态信息
			imgsArrangeTopArr = [],
			
			// 放在上侧区域的图片数量，0个或者1个
			topImgNum = Math.floor( Math.random() * 2 ),

			// 标记放在上侧区域的图片
			topImgSpliceIndex = 0,

			// 居中图片的数组
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			// 首先居中 canterIndex 的图片,居中的 centerindex 图片不需要旋转,居中标记
			imgsArrangeCenterArr[0] = {
				pos : centerPos,
				rotate : 0,
				isCenter:true
			}
			
			// 取出要布局上侧图片的状态信息
			topImgSpliceIndex = Math.floor( Math.random() * (imgsArrangeArr.length - topImgNum));
			
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			// 布局位于上侧的图片 上侧图片可能是0个 或者 1个,若是0个 则不会进入forEach 
			imgsArrangeTopArr.forEach((value,index)=>{
				imgsArrangeTopArr[index] = {
					pos :{
						top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter:false
				}
					
			});

			// 布局左右两侧的图片
			for(var i=0, j=imgsArrangeArr.length, k=j / 2; i<j; i++){
				let hPosRangeL_or_R = null;

				//前半部分 布局左边
				if(i<k){
					hPosRangeL_or_R = hPosRangeLeftSecX;
				}else{
					hPosRangeL_or_R = hPosRangeRightSecX;
				}

				imgsArrangeArr[i]= {
					pos : {
						top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left:getRangeRandom(hPosRangeL_or_R[0],hPosRangeL_or_R[1])
					},
					rotate:get30DegRandom(),
					isCenter:false				
				}
			}

			// 将上侧图片重新填回图片组
			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
			}

			// 将中心图片重新填回图片组
			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			})
	}	
	
	/**
	 * [center 利用rearrange 函数，居中对应的index图片]
	 * @param  {[type]} index 	[需要被居中的图片对应的图片信息组的index值]
	 * @return {[type]}             [返回一个函数]
	 */
	center(index){
		return () => {
			this.rearrange(index);
		}
	}


	// 组件加载后，为每张图片计算其位置的范围
	componentDidMount(){
		
		// 首先拿到舞台的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,

			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到一个 imgFigures 的大小 因为所有的图片一样大小，
		// 也就是哪一张图片的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH /2);

		// 计算中心位置
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		// 计算水平位置  左侧
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		
		// 右侧
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
   		// Y轴取值范围
    	this.Constant.hPosRange.y[0] = -halfImgH;
    	this.Constant.hPosRange.y[1] = stageH - halfImgH;

    	// 计算上侧区域图片排布的取值范围
    	this.Constant.vPosRange.topY[0] = -halfImgH;
	    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

	    this.Constant.vPosRange.x[0] = halfStageW - imgW;
	    this.Constant.vPosRange.x[1] = halfStageW;

	    // 先居中第一张图片
	    this.rearrange(0);
	}

	render(){

		var controllersUnits = [],
			imgFigures = [];

		imageDatas.forEach((value,index) => {

			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			}

		imgFigures.push(<ImgFigure data={value} key={index} 
						ref={"imgFigure"+index}
						arrange={this.state.imgsArrangeArr[index]}
						inverse={this.inverse(index)}
						center={this.center(index)}
		/>)

		controllersUnits.push(<ControllersUnit key={index}
						arrange={this.state.imgsArrangeArr[index]}
						inverse={this.inverse(index)}		
						center={this.center(index)}
		/>);

		})

		return(
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllersUnits}
				</nav>
			</section>
		);
	}
}
// ES6写法
AppComponent.defaultProps = {};

export default AppComponent;