import { useRef } from "react";

interface ImageWithFallbackProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  fallbackSrc: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallbackSrc,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    if (imgRef.current) {
      imgRef.current.src = fallbackSrc;
    }
  };

  return (
    <img
      alt=""
      ref={imgRef}
      onError={handleError}
      {...props}
      src={props.src || fallbackSrc}
    />
  );
};
