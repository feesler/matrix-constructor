import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { CanvasFrame } from '../../shared/utils/CanvasFrame/CanvasFrame.ts';

export interface CreateFrameParams {
  width: number;
  height: number;
}

export interface Canvas2DElement {
  elem: HTMLCanvasElement | null;
  createFrame: (frameProps: CreateFrameParams) => CanvasFrame | null;
  drawFrame: (frame: CanvasFrame) => void;
  clear: () => void;
}

export type Canvas2DRef = Canvas2DElement | null;

export type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

export const Canvas2D = forwardRef<
  Canvas2DRef,
  CanvasProps
>((props, ref) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const createFrame = (frameProps: CreateFrameParams): CanvasFrame | null => {
    const { width, height } = frameProps;
    if (!contextRef.current || !width || !height) {
      return null;
    }

    const image = contextRef.current.createImageData(Number(width), Number(height));
    return new CanvasFrame(image);
  };

  const drawFrame = (frame: CanvasFrame) => {
    if (!contextRef.current || !frame?.image) {
      return;
    }

    contextRef.current.putImageData(frame.image, 0, 0);
  };

  const clear = () => {
    if (!contextRef.current || !props.width || !props.height) {
      return;
    }

    contextRef.current.clearRect(0, 0, Number(props.width), Number(props.height));
  };

  const innerRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle<
    Canvas2DElement,
    Canvas2DElement
  >(ref, () => ({
    elem: innerRef.current,
    createFrame,
    drawFrame,
    clear,
  }));

  useEffect(() => {
    if (!innerRef.current) {
      return;
    }

    contextRef.current = innerRef.current.getContext('2d');
  }, []);

  return (
    <canvas {...props} ref={innerRef} />
  );
});

Canvas2D.displayName = 'Canvas2D';
