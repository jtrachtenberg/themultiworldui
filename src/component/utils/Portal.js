import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children, id }) => {
  const [el, setEl] = useState(document.createElement("div"))
  const mount = document.getElementById("portal-root");

  useEffect(() => {
    if (typeof(el) !== 'object')
      setEl(document.createElement("div"))
  }, [el, children])

  useEffect(() => {
    const elId = el.getAttribute('id')
    if (elId !== id) {
      el.id = id
      mount.appendChild(el)
    }
  }, [el, mount, id])

  useEffect(() => {
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

export default Portal;