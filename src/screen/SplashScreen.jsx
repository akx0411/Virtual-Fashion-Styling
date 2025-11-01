import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // fallback in case video doesn't end properly
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Video
        source={require('../assets/SplashLogo.mp4')}
        style={styles.video}
        resizeMode="cover"
        onEnd={onFinish} // transition when video ends
        controls={false}
        repeat={false}
        muted
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;