import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './styles/DraggableResizable.css';
import 'react-resizable/css/styles.css';
import DragHandle from './DragHandle';

const DraggableResizable = ({
  defaultWidth,
  defaultHeight,
  defaultX,
  defaultY,
  onResizeStop,
  onDragStop,
  children,
}) => {
  const [bounds, setBounds] = useState({
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setBounds({
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const { width, height } = ref.style;
    const { x, y } = position;
    setBounds({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      x,
      y,
    });
    onResizeStop({ size: { width: parseInt(width, 10), height: parseInt(height, 10) }, position: { x, y } });
  };

  return (
    <Rnd
      default={{
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: defaultHeight,
      }}
      bounds="window"
      minWidth={450}
      minHeight={300}
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
      resizeHandleClasses={{
        top: 'resize-handle-top',
        right: 'resize-handle-right',
        bottom: 'resize-handle-bottom',
        left: 'resize-handle-left',
        topRight: 'resize-handle-top-right',
        bottomRight: 'resize-handle-bottom-right',
        bottomLeft: 'resize-handle-bottom-left',
        topLeft: 'resize-handle-top-left',
      }}
      style={{
        border: '2px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
        position: 'absolute',
      }}
      dragHandleClassName="drag-handle"
      onDragStop={(e, d) => {
        onDragStop({ x: d.x, y: d.y });
      }}
      onResizeStop={handleResizeStop}
    >
      <div className="drag-handle p-2 border-b border-secondary text-black text-lg bg-accent cursor-move">
        Drag Here
      </div>
      {children}
    </Rnd>
  );
};

export default DraggableResizable;
