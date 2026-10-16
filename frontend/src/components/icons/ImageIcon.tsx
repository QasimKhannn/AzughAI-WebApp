import React from "react";

type ImageIconProps = {
  name: string; // e.g. "Summer.svg"
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
};

const ImageIcon: React.FC<ImageIconProps> = ({
  name,
  alt = "",
  width = 20,
  height = 20,
  className = "",
  style,
  onClick,
}) => {
  const src = `/assets/icons/${name}`;
  return (
    <img
      src={src}
      alt={alt || name.replace(/\.\w+$/, "")}
      width={width}
      height={height}
      className={className}
      style={style}
      loading="lazy"
      draggable={false}
      onClick={onClick}
    />
  );
};

export default ImageIcon;