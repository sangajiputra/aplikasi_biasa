import { Animated } from "react-native";
import React from "react";

export default function FadeIn(props) {
  const [fade] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: 1
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fade
      }}
    >
      {props.children}
    </Animated.View>
  );
};

