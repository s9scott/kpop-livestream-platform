import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import 'react-resizable/css/styles.css';

const DraggableResizable = ({ children, defaultWidth, defaultHeight, defaultX, defaultY, onResizeStop, onDragStop }) => {
  const [dimensions, setDimensions] = useState({
    width: defaultWidth,
    height: defaultHeight,
    x: defaultX,
    y: defaultY,
  });

  const handleDragStop = (e, d) => {
    const { x, y } = d;
    setDimensions((prev) => ({ ...prev, x, y }));
    onDragStop({ x, y });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const { width, height } = ref.style;
    const { x, y } = position;
    setDimensions({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      x,
      y,
    });
    onResizeStop({ size: { width: parseInt(width, 10), height: parseInt(height, 10) }, position: { x, y } });
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={{ x: dimensions.x, y: dimensions.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      dragHandleClassName="drag-handle"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      minWidth={100}
      minHeight={100}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {children}
        <line className="drag-handle" style={{ width: 20, height: 20, backgroundColor: '#6441a4', position: 'absolute', bottom: 400, right: -25, cursor: 'move' }} />
      </div>
    </Rnd>
  );
};

export default DraggableResizable;
