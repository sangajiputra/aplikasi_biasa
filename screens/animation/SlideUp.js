import { Animated,Easing } from "react-native";
import React from "react";

export default function SlideUp(props){
  const [fade] = React.useState(new Animated.Value(0.7));
  const [slide] = React.useState(new Animated.Value(100));
  const [scale] = React.useState(new Animated.Value(0.8));

  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
    }).start();
    Animated.timing(slide, {
      toValue: 0,
    }).start();
    Animated.timing(scale, {
      toValue: 1,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fade,
        transform: [
          {
            translateY: slide
          },
          {
            scale: scale
          }
        ]
      }}
    >
      {props.children}
    </Animated.View>
  );
};

