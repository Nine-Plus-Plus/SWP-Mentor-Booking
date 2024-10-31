// Button.js
import React, { useImperativeHandle, forwardRef, useRef, memo, useMemo } from 'react';

const CopyAction = memo(
  forwardRef((props, ref) => {
    const baseRef = useRef(null);

    useImperativeHandle(ref, () => ({
      instance() {
        return baseRef.current?.getInstance(); // Nếu bạn cần truy cập vào instance
      },
    }), [baseRef.current]);

    const independentEvents = useMemo(() => ["onClick", "onContentReady", "onDisposing", "onInitialized"], []);

    const templateProps = useMemo(() => [
      {
        tmplOption: "template",
        render: "render",
        component: "component"
      },
    ], []);

    return (
      <button 
        ref={baseRef} 
        onClick={props.onClick} 
        className={props.className}
        // Add other props as needed
      >
        {props.children}
      </button>
    );
  })
);

export default CopyAction;
