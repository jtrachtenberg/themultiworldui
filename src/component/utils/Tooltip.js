import React, {useEffect, useState} from 'react';
import usePortal from 'react-cool-portal';

export const Tooltip = React.forwardRef((props, ref) => {
  const [isFadeOut, setIsFadeOut] = useState(false);
  const [className, setClassName] = useState(isFadeOut ? "modalFadeOut" : "")
  const { Portal, show, hide, isShow } = usePortal({
    defaultShow: false,
    escToHide: true,
    clickOutsideToHide: true,
    containerId: props.toolTipId,
  });

  const close = () => {
    setIsFadeOut(true);
    setClassName("modalFadeOut")
    props.modalReturn()
  };
  
  const handleClickBackdrop = (e) => {
    const { id } = e.target;
  
    if (id === "modal" || id === "modal-dialog") close();
  };
  
  const handleAnimEnd = () => {
    console.log(isFadeOut)
    if (!isFadeOut) return;
  
    setIsFadeOut(false);
    setClassName("")
    console.log('hide')
    hide();
  };

  useEffect(() => {
    console.log('useffect')
    console.log(props.showToolTip)
    console.log(isShow)
    if (props.showToolTip && !isShow) {
      console.log('show')
      show()
    }
    if (!props.showToolTip && isShow) {
      console.log('should hide')
      hide()
    }
    
    const handleKeyDown = (e) => {
      if (isShow && e.keyCode === 27) close();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });



  return (
    <div ref={ref}>
      <button onClick={show}>Open Modal</button>
      <button onClick={hide}>Close Modal</button>
      <Portal>
          <div
            id="modal"
            className={"modal" + className}
            /*css={[modal, isFadeOut && modalFadeOut]}*/
            onClick={handleClickBackdrop}
            onAnimationEnd={handleAnimEnd}
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div id="modal-dialog" className="modalDialog" role="document">
              <div className="modalContent" >
                <div className="modalHeader">
                  <h5 className="modalTitle" id="exampleModalLabel">
                    <span role="img" aria-label="Hello">
                      👋🏻
                    </span>{" "}
                    Hola
                  </h5>
                  <button
                    className="modalClose"
                    onClick={close}
                    type="button"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modalBody">
                  <p>
                    You can also close me by pressing the &quot;ESC&quot; key.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Portal>
    </div>
  );
})

  /*const { Portal, isShow, show, hide, toggle } = usePortal({
    containerId: 'my-portal-root', // Use your own portal container. If no set, we'll create it for you.
    defaultShow: false, // Default is true.
    clickOutsideToHide: true, // Default is true.
    escToHide: true, // Default is true.
    onShow: e => {
      // Triggered on show portal.
      // The event object will be: MouseEvent, KeyboardEvent, Your custom event.
    },
    onHide: e => {
      // Triggered on show portal.
      // The event object will be: MouseEvent, KeyboardEvent, Your custom event.
    }
  });*/

/*
const { Portal, isShow, show, hide, toggle } = usePortal({
  containerId: 'my-portal-root', // Use your own portal container. If no set, we'll create it for you.
  defaultShow: false, // Default is true.
  clickOutsideToHide: true, // Default is true.
  escToHide: true, // Default is true.
  onShow: e => {
    // Triggered on show portal.
    // The event object will be: MouseEvent, KeyboardEvent, Your custom event.
  },
  onHide: e => {
    // Triggered on show portal.
    // The event object will be: MouseEvent, KeyboardEvent, Your custom event.
  }
});


class ToolTip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vis:false, 
            x:0, 
            y:0, 
            type:"none"
        }
        this.toolref = React.createRef()
    }
    
    componentDidUpdate() {
        //this.refCallback(this.toolref)
    }
    refCallback = element => {
        if (element) {
          console.log(element)
          console.log(this.toolref)
          const rect = element.getBoundingClientRect()
          console.log(rect)
        }
    }

    render() {
        let visibility = this.state.vis ? "on" : "off"
        
        let style = {
        left: ((this.state.x + window.scrollX) + 'px'),
        top: ((this.state.y + window.scrollY) + 'px')
        }
        
        let classNames = {}
        
        if(this.state.type && this.state.type !== "none") {
            classNames[this.state.type] = true
        }
        
        classNames[visibility] = true
        
        return (
            <div ref={this.props.toolTip}><div ref={this.refCallback} id="tooltip" className={Object.keys(classNames).join(" ")} style={style}>
        <div className="tooltip-arrow"></div><div className="tooltip-inner">{this.props.tooltiptext}</div></div></div>
        )    
    }

    pastShow = (hoverRect) => {
    // position the tooltip after showing it
    console.log(this.props.tooltip.current)//
    //let ttNode = ReactDOM.findDOMNode(this)

        if(hoverRect) {
            let x = 0, y = 0
            
            //const   docWidth = document.documentElement.clientWidth,
              //      docHeight = document.documentElement.clientHeight
                
            let rx = hoverRect.x + hoverRect.width, // most right x
                lx = hoverRect.x, // most left x
                ty = hoverRect.y, // most top y
                by = hoverRect.y + hoverRect.height; // most bottom y
                
            // tool tip rectange
            let ttRect// = ttNode.getBoundingClientRect()
            
            let bRight = true//(rx + ttRect.width) <= (window.scrollX + docWidth)
            let bLeft = false//(lx - ttRect.width) >= 0
            
            let bAbove = false//(ty - ttRect.height) >= 0
            let bBellow = false//(by + ttRect.height) <= (window.scrollY + docHeight)
            
            let newState = {}
            
            // the tooltip doesn't fit to the right
            if(bRight) {
                x = rx
                y = ty// + (hoverRect.height - ttRect.height)
                if(y < 0) {
                    y = ty
                }
                newState.type = "right"
            } else if(bBellow) {
                y = by
                x = lx + (hoverRect.width - ttRect.width)
                if(x < 0) {
                    x = lx
                }
                
                newState.type = "bottom";
            } else if(bLeft) {
                x = lx// - ttRect.width          
                y = ty// + (hoverRect.height - ttRect.height)           
                if(y < 0) {
                    y = ty
                }
                
                newState.type = "left"
            } else if(bAbove) {
                y = ty - ttRect.height           
                x = lx + (hoverRect.width - ttRect.width)           
                if(x < 0)
                {
                    x = lx
                }
                
                newState.type = "top"
            }
            
            newState = {...newState, x:x, y:y}
                
            this.setState(newState);
        }
    }

    show = (hoverRect) => {
        //let {pastShow} = this;
        
        // setState will execute the pastShow with hoverRect as the tool tip becomes visible
        this.setState({vis:true}, this.pastShow(hoverRect))
    }
    
    hide = () => {
        this.setState({vis:false})
    }
}
/*
class Btn extends React.Component
{
	events = {}
	constructor(props)
  {
	  super(props);
    
    this.state = {
    	id:props.id,
      text:props.children
    };
    
    this.events.onMouseOver = props.onMouseOver;
    this.events.onMouseOut = props.onMouseOut;
  }
  render()
  {
  	return <button type="button" id={this.state.id} onMouseOver={this.events.onMouseOver} onMouseLeave={this.events.onMouseOut}>{this.state.text}</button>
  }
}

class App extends React.Component
{
	constructor(props)
  {
  	super(props);
  	console.log("* app constructor");
    
    this.setupRefs();
    
    this.setupEvents();
  }
  setupRefs()
  {
  	this.toolTip = React.createRef();
  }
  setupEvents()
  {
  	this.createBtn = this.createBtn.bind(this);
  	this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
  }
  handleOnMouseOut(evt)
  {
  	this.toolTip.current.hide();
  }
  handleOnMouseOver(evt)
  {
  	// get hovered element reference
  	let el = evt.currentTarget;
    
    if(el != null)
    {
    	let rect = el.getBoundingClientRect();
      
      this.toolTip.current.show(rect);
		}
  }
  createBtn(id, text)
  {
  	var {handleOnMouseOver, handleOnMouseOut} = this;
    
  	return <Btn id={id} onMouseOver={handleOnMouseOver} onMouseOut={handleOnMouseOut}>{text}</Btn>
	}
  render()
  {
  	let {createBtn} = this;
  	
    return <div>
      {createBtn("btnLeft", "click 1")}
      {createBtn("btnRight", "click 2")}
      {createBtn("btnBtmR", "click 3")}
      {createBtn("btnCenter", "click 4")}
      <ToolTip ref={this.toolTip} />
    </div>;
	}
  componentDidMount()
  {
  	
  }
}
*/