import React from "react";
import ReactDOMServer from "react-dom/server";

export function renderReactComponent(component, props) {
  const reactElement = React.createElement(component, props);
  const blazeHTML = ReactDOMServer.renderToString(reactElement);
  // @ts-ignore
  return new Spacebars.SafeString(blazeHTML);
}
