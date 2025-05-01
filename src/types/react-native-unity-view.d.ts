declare module 'react-native-unity-view' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface UnityViewProps extends ViewProps {
    /**
     * Callback that is invoked when a message is received from Unity.
     */
    onMessage?: (message: { name: string; data: string }) => void;
    
    /**
     * Callback that is invoked when Unity view is loaded.
     */
    onUnityMessage?: (handler: any) => void;
  }

  export default class UnityView extends Component<UnityViewProps> {
    /**
     * Post a message to a specific Unity GameObject
     * @param gameObject The name of the Unity GameObject to receive the message
     * @param methodName The name of the method to call on the GameObject
     * @param message The message data to send to Unity
     */
    postMessage(gameObject: string, methodName: string, message: string): void;

    /**
     * Pause Unity player
     */
    pause(): void;

    /**
     * Resume Unity player
     */
    resume(): void;

    /**
     * Unmount Unity player
     */
    unmount(): void;
  }
} 