// mqttService.ts
import mqtt from "mqtt";
import * as crypto from "crypto-js";

let mqttClient: mqtt.MqttClient | null = null;
let messageListeners: ((topic: string, payload: any) => void)[] = [];
let connectionStatus = "disconnected";

// AWS SigV4 Helper Functions
const getSignatureKey = (
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
) => {
  const kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
  const kRegion = crypto.HmacSHA256(regionName, kDate);
  const kService = crypto.HmacSHA256(serviceName, kRegion);
  const kSigning = crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
};

export const connectMqtt = async () => {
  if (typeof window === "undefined") return; // Only run on client-side

  console.log("Attempting to connect to MQTT...");
  console.log(
    "Environment variables available:",
    Boolean(process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT),
    Boolean(process.env.NEXT_PUBLIC_AWS_REGION),
    Boolean(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID)
  );

  if (!mqttClient) {
    try {
      // Get configuration from environment variables
      const endpoint = process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT;
      const region = process.env.NEXT_PUBLIC_AWS_REGION;
      const accessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
      const secretKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

      if (!endpoint || !region || !accessKey || !secretKey) {
        console.error(
          "Missing required environment variables for MQTT connection"
        );
        return null;
      }

      console.log(`Connecting to AWS IoT endpoint: ${endpoint}`);

      // Create a signature for AWS IoT WebSocket connection
      // Implementation based on AWS IoT WebSocket connection requirements

      // Generate a client ID that is unique for this session
      const clientId = `nextjs-client-${Math.floor(Math.random() * 1000000)}`;
      console.log(`Using client ID: ${clientId}`);

      // Create AWS SigV4 signed URL
      const date = new Date();
      const dateTime = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
      const dateStamp = dateTime.substring(0, 8);

      // AWS WebSocket URL protocol
      const service = "iotdevicegateway";
      const algorithm = "AWS4-HMAC-SHA256";
      const method = "GET";
      const canonicalUri = "/mqtt";

      // Create canonical request
      const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

      // Create signed headers
      const signedHeaders = "host";

      // URL parameters for AWS IoT WebSocket connection
      const queryParams = {
        "X-Amz-Algorithm": algorithm,
        "X-Amz-Credential": `${accessKey}/${credentialScope}`,
        "X-Amz-Date": dateTime,
        "X-Amz-SignedHeaders": signedHeaders,
      };

      // Build canonical query string
      const canonicalQueryString = Object.keys(queryParams)
        .sort()
        .map(
          (key: string) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              queryParams[key as keyof typeof queryParams]
            )}`
        )
        .join("&");

      // Build canonical request
      const canonicalHeaders = `host:${endpoint}\n`;
      const payloadHash = crypto.SHA256("").toString();

      const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

      // Create string to sign
      const stringToSign = `${algorithm}\n${dateTime}\n${credentialScope}\n${crypto
        .SHA256(canonicalRequest)
        .toString()}`;

      // Calculate signature
      const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
      const signature = crypto.HmacSHA256(stringToSign, signingKey).toString();

      // Add signature to query parameters
      const authorizedQueryString = `${canonicalQueryString}&X-Amz-Signature=${signature}`;

      // Build WebSocket URL
      const url = `wss://${endpoint}${canonicalUri}?${authorizedQueryString}`;

      // Connect to AWS IoT with signed URL
      mqttClient = mqtt.connect(url, {
        clientId,
        protocolId: "MQTT",
        protocolVersion: 4,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        keepalive: 60,
      });

      mqttClient.on("connect", () => {
        console.log("Connected to AWS IoT");
        connectionStatus = "connected";

        // Subscribe to topic
        console.log("Subscribing to topic: iot/mpu6050pub");
        mqttClient?.subscribe("iot/mpu6050pub", (err) => {
          if (err) {
            console.error("Error subscribing to topic:", err);
          } else {
            console.log("Successfully subscribed to iot/mpu6050pub");
          }
        });

        // For testing, try publishing a test message
        setTimeout(() => {
          console.log("Publishing test message");
          mqttClient?.publish(
            "iot/test",
            JSON.stringify({
              test: "Hello from client",
              timestamp: Date.now(),
            })
          );
        }, 2000);
      });

      mqttClient.on("message", (topic, payload) => {
        console.log(`Received message on topic ${topic}:`, payload.toString());
        try {
          const data = JSON.parse(payload.toString());
          notifyListeners(topic, data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      });

      mqttClient.on("error", (err) => {
        console.error("MQTT connection error:", err);
        connectionStatus = "error";
      });

      mqttClient.on("close", () => {
        console.log("MQTT connection closed");
        connectionStatus = "disconnected";
      });

      mqttClient.on("reconnect", () => {
        console.log("Attempting to reconnect to MQTT broker");
        connectionStatus = "reconnecting";
      });
    } catch (error) {
      console.error("Failed to initialize MQTT client:", error);
      return null;
    }
  }

  return mqttClient;
};

export const getConnectionStatus = () => {
  return connectionStatus;
};

export const subscribeToMessages = (
  callback: (topic: string, payload: any) => void
) => {
  console.log("Registering new message listener");
  messageListeners.push(callback);
  return () => {
    console.log("Removing message listener");
    messageListeners = messageListeners.filter(
      (listener) => listener !== callback
    );
  };
};

const notifyListeners = (topic: string, payload: any) => {
  console.log(
    `Notifying ${messageListeners.length} listeners about new message`
  );
  messageListeners.forEach((listener) => {
    listener(topic, payload);
  });
};

export const disconnectMqtt = () => {
  if (mqttClient) {
    console.log("Disconnecting MQTT client");
    mqttClient.end();
    mqttClient = null;
    connectionStatus = "disconnected";
  }
};

// For testing - populate with mock data
export const simulateMessage = () => {
  const mockData = {
    yaw1: Math.random() * 180 - 90,
    pitch1: Math.random() * 180 - 90,
    roll1: Math.random() * 180 - 90,
    ax1: Math.random() * 2 - 1,
    ay1: Math.random() * 2 - 1,
    az1: Math.random() * 2 - 1,
    gx1: Math.random() * 200 - 100,
    gy1: Math.random() * 200 - 100,
    gz1: Math.random() * 200 - 100,
    yaw2: Math.random() * 180 - 90,
    pitch2: Math.random() * 180 - 90,
    roll2: Math.random() * 180 - 90,
    ax2: Math.random() * 2 - 1,
    ay2: Math.random() * 2 - 1,
    az2: Math.random() * 2 - 1,
    gx2: Math.random() * 200 - 100,
    gy2: Math.random() * 200 - 100,
    gz2: Math.random() * 200 - 100,
    timestamp: Date.now(),
  };

  notifyListeners("iot/mpu6050pub", mockData);
  return mockData;
};
