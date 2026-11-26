import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ebox.app', // mantenha o seu appId atual
  appName: 'E-BOX',
  webDir: 'dist',
  server: {
    androidScheme: 'http', // evita bloqueio de Mixed Content com o IP local da ESP32
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;