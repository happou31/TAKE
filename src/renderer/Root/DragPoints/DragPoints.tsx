import React, { useState } from "react";
import { Rect } from "../../../utils/types";

type Props = {
  onMouseDown: (rect: Rect) => void;
  onMouseDrag: (rect: Rect) => void;
  onMouseUp: (rect: Rect) => void;
  children?: React.ReactNode;
};

export default (props: Props) => {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(-1);
  const [startY, setStartY] = useState(-1);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY);

    props.onMouseDown({
      top: e.pageY,
      left: e.pageX,
      // クリック開始時の右下は左上と同じ座標を返す
      right: e.pageX,
      bottom: e.pageY,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      props.onMouseDrag({
        top: startY,
        left: startX,
        right: e.pageX,
        bottom: e.pageY,
      });
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    setDragging(false);

    const fixedStartX = startX <= e.pageX ? startX : e.pageX;
    const endX = e.pageX > startX ? e.pageX : startX;

    const fixedStartY = startY <= e.pageY ? startY : e.pageY;
    const endY = e.pageY > startY ? e.pageY : startY;

    props.onMouseUp({
      top: fixedStartY,
      left: fixedStartX,
      right: endX,
      bottom: endY,
    });
    setStartX(-1);
    setStartY(-1);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{ width: "100%", height: "100%" }}
    >
      {props.children}
    </div>
  );
};
