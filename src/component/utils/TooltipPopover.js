import React, { useEffect } from "react";
//import debounce from "lodash/debounce";

const TooltipPopover = ({ children, coords }) => {
  //const updateCoords = debounce(updateTooltipCoords, 100);
  //const [isOn, setOn] = useState(false); // toggles dropdown visibility
  //const [coords, setCoords] = useState({}); // takes current button coordinates

  /*const updateTooltipCoords = el => {
    const rect = el.getBoundingClientRect();
    setCoords({
      left: rect.x + rect.width / 2, // add half the width of the button for centering
      top: rect.y + window.scrollY // add scrollY offset, as soon as getBountingClientRect takes on screen coords
    });
  };*/

  useEffect(() => {
    //window.addEventListener("resize", updateCoords);
    //return () => window.removeEventListener("resize", updateCoords);
  }, []);

  return (
    <div
      style={{ ...styles.popover, ...coords }}
      className="ant-popover ant-popover-placement-top"
    >
      <div className="ant-popover-content">
        <div className="ant-popover-arrow" />
        <div className="ant-popover-inner" role="tooltip">
          <div>
            <div className="ant-popover-title">Title</div>
            <div className="ant-popover-inner-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  popover: {
    position: "absolute",
    width: 200,
    transform: "translate(-100px, -100%)"
  }
};

export default TooltipPopover;
