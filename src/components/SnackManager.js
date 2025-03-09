import { Snack } from 'snack-sdk';
import { useState, useEffect } from 'react';

const SnackManager = ({ webPreviewRef, onWebPreviewURLChange, onDownloadURLChange, onFilesChange, onError }) => {
  const [snackInstance, setSnackInstance] = useState(null);
  const [files, setFiles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeSnack = async () => {
      // Structure de fichiers Expo standard
      const initialFiles = {
        'app.json': {
          type: 'CODE',
          contents: `{
  "expo": {
    "name": "my-expo-app",
    "slug": "my-expo-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}`
        },
        'package.json': {
          type: 'CODE',
          contents: `{
  "name": "my-expo-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-constants": "~14.4.0",
    "expo-linking": "~5.0.0",
    "expo-router": "~4.0.17",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.5"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14"
  },
  "private": true
}`
        },
        'App.js': {
          type: 'CODE',
          contents: `import 'expo-router/entry';`
        },
        'app/_layout.tsx': {
          type: 'CODE',
          contents: `import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: 'Tabs' }} />
    </Stack>
  );
}`
        },
        'app/index.tsx': {
          type: 'CODE',
          contents: `import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Expo Router!</Text>
      <View style={styles.separator} />
      <Link href="/(tabs)" style={styles.link}>
        <Text style={styles.linkText}>Go to tabs</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});`
        },
        'app/(tabs)/_layout.tsx': {
          type: 'CODE',
          contents: `import { Tabs } from 'expo-router';
import { useColorScheme, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Utilisation de Text de React Native correctement
function TabBarIcon(props) {
  return <Text style={{ fontSize: 20, color: props.color }}>●</Text>;
}`
        },
        'app/(tabs)/index.tsx': {
          type: 'CODE',
          contents: `import { StyleSheet, Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <Text>
        This is an example tab. You can edit it in app/(tabs)/index.tsx.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
});`
        },
        'app/(tabs)/two.tsx': {
          type: 'CODE',
          contents: `import { StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} />
      <Text>
        This is another tab. You can edit it in app/(tabs)/two.tsx.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
});`
        },
        'app/modal.tsx': {
          type: 'CODE',
          contents: `import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} />
      <Text style={styles.text}>
        This is a modal screen. You can customize it as needed.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e78b7',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});`
        },
        'constants/colors.ts': {
          type: 'CODE',
          contents: `const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};`
        }
      };

      // Mettre à jour l'état des fichiers et les exposer via callback
      setFiles(initialFiles);
      if (onFilesChange) {
        onFilesChange(initialFiles);
      }

      const snack = new Snack({
        online: true,
        files: initialFiles,
        webPreviewRef,
        sdkVersion: "49.0.0",  // Version Expo spécifiée
        name: "My Expo App",
        description: "A standard Expo app with tabs navigation"
      });

      setSnackInstance(snack);

      // Ajouter un écouteur d'événements pour les logs et détecter les erreurs
      snack.addLogListener((log) => {
        // Filtrer uniquement les erreurs
        console.log(log);
        if (log.level === 'error') {
          console.error('Erreur de rendu Snack:', log);
          if (onError) {
            onError(log);
          }
        }
      });

      console.log(snack);

      snack.setOnline(true);
      const { url } = await snack.getStateAsync();
      console.log(url);
      snack.setOnline(false);
      const urls = await snack.getDownloadURLAsync();
      onDownloadURLChange(urls);
      console.log('Download URL: ' + urls);
      const { webPreviewURL } = snack.getState();
      onWebPreviewURLChange(webPreviewURL);
      const connectedClients = await snack.getPreviewAsync();
      console.log(connectedClients);
    };

    initializeSnack();
  }, [webPreviewRef, onWebPreviewURLChange, onDownloadURLChange, onFilesChange]);

  // Fonction pour mettre à jour le contenu d'un fichier
  const updateFileContent = async (fileName, newContent) => {
    if (!snackInstance) return;

    // Mettre à jour le fichier dans l'instance Snack
    snackInstance.updateFiles({
      [fileName]: {
        type: 'CODE',
        contents: newContent
      }
    });

    // Mettre à jour l'état local des fichiers
    const updatedFiles = {
      ...files,
      [fileName]: {
        ...files[fileName],
        contents: newContent
      }
    };
    setFiles(updatedFiles);

    // Mettre à jour l'URL de prévisualisation
    const { webPreviewURL } = snackInstance.getState();
    onWebPreviewURLChange(webPreviewURL);

    // Mettre à jour les fichiers dans le parent
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  // Exposer la fonction updateFileContent
  if (typeof window !== 'undefined') {
    window.updateFileContent = updateFileContent;
  }

  return null; // Ce composant ne rend rien visuellement
};

export default SnackManager;