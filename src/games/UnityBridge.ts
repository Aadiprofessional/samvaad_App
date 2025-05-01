/**
 * Unity Bridge
 * 
 * This file manages the communication between React Native and Unity
 * It provides methods to send messages to Unity and handle responses
 */

class UnityBridge {
  private static instance: UnityBridge;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): UnityBridge {
    if (!UnityBridge.instance) {
      UnityBridge.instance = new UnityBridge();
    }
    return UnityBridge.instance;
  }

  /**
   * Register a message handler for Unity messages
   * @param messageType The message type to listen for
   * @param handler The function to call when this message is received
   */
  public registerMessageHandler(messageType: string, handler: (data: any) => void): void {
    this.messageHandlers.set(messageType, handler);
  }

  /**
   * Unregister a message handler
   * @param messageType The message type to stop listening for
   */
  public unregisterMessageHandler(messageType: string): void {
    this.messageHandlers.delete(messageType);
  }

  /**
   * Handle a message from Unity
   * @param message The message received from Unity
   */
  public handleUnityMessage(message: { name: string; data: string }): void {
    const { name, data } = message;
    const handler = this.messageHandlers.get(name);
    
    if (handler) {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        handler(parsedData);
      } catch (error) {
        console.error(`Error parsing Unity message data for ${name}:`, error);
        // Still try to call the handler with the raw data if parsing fails
        handler(data);
      }
    } else {
      console.log(`No handler registered for Unity message type: ${name}`);
    }
  }

  /**
   * Utility method to parse JSON safely
   * @param jsonString JSON string to parse
   * @param fallback Fallback value if parsing fails
   */
  public static safeParseJSON(jsonString: string, fallback: any = null): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  }
}

export default UnityBridge.getInstance(); 