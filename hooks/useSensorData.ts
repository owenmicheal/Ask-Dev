// hooks/useSensorData.ts
import { useState, useEffect } from "react";
import {
  connectMqtt,
  subscribeToMessages,
  getConnectionStatus,
  simulateMessage,
} from "../services/mqttService";

interface SensorData {
  yaw1: number;
  pitch1: number;
  roll1: number;
  ax1: number;
  ay1: number;
  az1: number;
  gx1: number;
  gy1: number;
  gz1: number;
  yaw2: number;
  pitch2: number;
  roll2: number;
  ax2: number;
  ay2: number;
  az2: number;
  gx2: number;
  gy2: number;
  gz2: number;
  timestamp?: number;
}

export const useSensorData = (debugMode = false) => {
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let connectionCheckInterval: NodeJS.Timeout | null = null;
    let isComponentMounted = true;

    const initMqtt = async () => {
      try {
        // If in debug mode, bypass MQTT connection
        if (debugMode) {
          console.log("Debug mode enabled, using simulated data");
          startSimulation();
          return;
        }

        console.log("Initializing MQTT connection");
        const client = await connectMqtt();

        // Check if component is still mounted after async operation
        if (!isComponentMounted) return;

        if (client) {
          console.log("MQTT client initialized successfully");
          setConnected(true);
          setConnectionError(null);
          
          // Start a connection status checker
          connectionCheckInterval = setInterval(() => {
            const status = getConnectionStatus();
            if (status !== 'connected' && isComponentMounted) {
              console.log(`Connection status changed to: ${status}`);
              setConnected(status === 'connected');
              
              if (status === 'error' || status === 'disconnected') {
                setConnectionError(`Connection ${status}. Please check your AWS IoT settings or enable debug mode.`);
                
                // If we've disconnected and debug mode is on, start simulation
                if (debugMode) {
                  startSimulation();
                }
              }
            }
          }, 2000);
        } else {
          console.log("Failed to initialize MQTT client");
          setConnected(false);
          setConnectionError("Failed to initialize MQTT client. Check AWS IoT credentials and configuration.");
          setConnectionAttempts(prev => prev + 1);

          // If in debug mode or after 3 failed attempts, use mock data
          if (debugMode || connectionAttempts >= 2) {
            console.log("Using simulated data after connection failures");
            startSimulation();
          }
        }
      } catch (error) {
        if (!isComponentMounted) return;
        
        console.error("Failed to connect to MQTT:", error);
        setConnected(false);
        setConnectionError(`Connection error: ${error}`);
        setConnectionAttempts(prev => prev + 1);

        // If in debug mode or after 3 failed attempts, use mock data
        if (debugMode || connectionAttempts >= 2) {
          console.log("Using simulated data after error");
          startSimulation();
        }
      }
    };

    const startSimulation = () => {
      // Clear any existing simulation
      if (interval) {
        clearInterval(interval);
      }
      
      // Set as connected in debug mode
      setConnected(true);
      setConnectionError(null);
      
      // Generate initial mock data immediately
      const initialMockData = simulateMessage();
      setCurrentData(initialMockData);
      setHistoricalData([initialMockData]);
      
      // Then continue generating mock data every 2 seconds
      console.log("Starting mock data simulation");
      interval = setInterval(() => {
        if (!isComponentMounted) return;
        
        const mockData = simulateMessage();
        console.log("Generated mock data:", mockData);
      }, 2000);
    };

    // Set up the subscription
    console.log("Setting up message subscription");
    const unsubscribe = subscribeToMessages((topic, payload) => {
      if (!isComponentMounted) return;
      
      console.log(`Received message on topic ${topic}:`, payload);
      if (topic === "iot/mpu6050pub") {
        const dataWithTimestamp = {
          ...payload,
          timestamp: payload.timestamp || Date.now(),
        };

        setCurrentData(dataWithTimestamp);
        setHistoricalData((prev) => {
          const updated = [...prev, dataWithTimestamp];
          // Keep only the last 100 data points to prevent memory issues
          if (updated.length > 100) {
            return updated.slice(-100);
          }
          return updated;
        });
      }
    });

    // Initialize connection
    initMqtt();

    // Cleanup function
    return () => {
      console.log("Cleaning up MQTT resources");
      isComponentMounted = false;
      unsubscribe();
      if (interval) {
        clearInterval(interval);
      }
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
    };
  }, [debugMode, connectionAttempts]);

  return {
    connected,
    connectionError,
    currentData,
    historicalData,
  };
};
