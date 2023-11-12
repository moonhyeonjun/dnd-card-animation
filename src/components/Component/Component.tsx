import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COMPONENT } from "constants/constants";
import { ComponentProps } from "types";
import "./Component.css";

const Component: React.FC<ComponentProps> = ({ data, components, path }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT,
    item: { type: COMPONENT, id: data.id, path },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = components[data.id];

  return (
    <div ref={ref} style={{ opacity }} className="component draggable">
      <div>{data.id}</div>
      <div>{component.content}</div>
    </div>
  );
};

export default Component;
