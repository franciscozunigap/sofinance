import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { statusBarConfig } from '../platform/ios';

interface IOSStatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  translucent?: boolean;
}

const IOSStatusBar: React.FC<IOSStatusBarProps> = ({
  backgroundColor = statusBarConfig.backgroundColor,
  barStyle = statusBarConfig.barStyle,
  translucent = statusBarConfig.translucent,
}) => {
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
    />
  );
};

export default IOSStatusBar;
