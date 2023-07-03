import { HeaderStyleInterpolators, TransitionSpecs } from "@react-navigation/stack";

export default {
  gestureDirection: "horizontal",
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: next ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -150]
            }) : current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0]
            }),
            scale: next ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.85]
            }) : current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1]
            }),
          }
        ]
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.7]
        })
      }
    };
  }
};
