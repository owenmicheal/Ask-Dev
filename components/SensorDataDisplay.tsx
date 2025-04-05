import React, { useState, useEffect } from "react";
import { useSensorData } from "@/hooks/useSensorData";

const SensorDataDisplay: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);
  const { connected, connectionError, currentData } = useSensorData(debugMode);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showAdvancedHelp, setShowAdvancedHelp] = useState(false);

  useEffect(() => {
    if (currentData?.timestamp) {
      setLastUpdated(new Date(currentData.timestamp).toLocaleTimeString());
    }
  }, [currentData]);

  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev);
  };

  const toggleAdvancedHelp = () => {
    setShowAdvancedHelp((prev) => !prev);
  };

  if (!connected) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4 text-lg font-medium">Connecting to AWS IoT...</p>

        {connectionError && (
          <div className="text-red-600 bg-red-100 p-4 rounded-lg mb-4">
            <p className="font-bold">Connection Error:</p>
            <p>{connectionError}</p>

            <button
              onClick={toggleAdvancedHelp}
              className="mt-2 text-sm text-blue-600 underline"
            >
              {showAdvancedHelp
                ? "Hide troubleshooting"
                : "Show troubleshooting"}
            </button>

            {showAdvancedHelp && (
              <div className="mt-3 text-sm text-left bg-gray-50 p-3 rounded">
                <p className="font-medium">Troubleshooting steps:</p>
                <ol className="list-decimal list-inside">
                  <li>Verify your AWS IoT endpoint is correct in .env.local</li>
                  <li>Check that your AWS credentials have IoT permissions</li>
                  <li>
                    Verify that the device is publishing to topic
                    "iot/mpu6050pub"
                  </li>
                  <li>
                    Try enabling debug mode to verify the application works
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={toggleDebugMode}
            className={`${
              debugMode
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
          >
            {debugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
          </button>

          <p className="text-sm text-gray-600">
            {debugMode
              ? "Debug mode is active. Displaying simulated data."
              : "Enable debug mode to see simulated data while troubleshooting."}
          </p>
        </div>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4 text-lg">Waiting for sensor data...</p>

        <div className="flex flex-col items-center space-y-2">
          {debugMode ? (
            <>
              <p className="text-yellow-600 bg-yellow-50 p-2 rounded">
                Debug mode is ON. Simulated data should appear momentarily.
              </p>
              <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
            </>
          ) : (
            <button
              onClick={toggleDebugMode}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Enable Debug Mode
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Live MPU6050 Sensor Data</h1>
        <div>
          <span
            className={`inline-block px-2 py-1 rounded mr-2 ${
              debugMode ? "bg-yellow-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {debugMode ? "Debug Mode" : "Live Data"}
          </span>
          <button
            onClick={toggleDebugMode}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 text-sm rounded"
          >
            {debugMode ? "Switch to Live" : "Use Mock Data"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-black">
          <h2 className="text-xl font-semibold mb-2 text-black">Sensor 1</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Orientation</h3>
              <p>Yaw: {currentData.yaw1.toFixed(2)}°</p>
              <p>Pitch: {currentData.pitch1.toFixed(2)}°</p>
              <p>Roll: {currentData.roll1.toFixed(2)}°</p>
            </div>
            <div>
              <h3 className="font-medium">Acceleration</h3>
              <p>X: {currentData.ax1.toFixed(4)}</p>
              <p>Y: {currentData.ay1.toFixed(4)}</p>
              <p>Z: {currentData.az1.toFixed(4)}</p>
            </div>
            <div>
              <h3 className="font-medium">Gyroscope</h3>
              <p>X: {currentData.gx1.toFixed(2)}</p>
              <p>Y: {currentData.gy1.toFixed(2)}</p>
              <p>Z: {currentData.gz1.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-black">
          <h2 className="text-xl font-semibold mb-2">Sensor 2</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Orientation</h3>
              <p>Yaw: {currentData.yaw2.toFixed(2)}°</p>
              <p>Pitch: {currentData.pitch2.toFixed(2)}°</p>
              <p>Roll: {currentData.roll2.toFixed(2)}°</p>
            </div>
            <div>
              <h3 className="font-medium">Acceleration</h3>
              <p>X: {currentData.ax2.toFixed(4)}</p>
              <p>Y: {currentData.ay2.toFixed(4)}</p>
              <p>Z: {currentData.az2.toFixed(4)}</p>
            </div>
            <div>
              <h3 className="font-medium">Gyroscope</h3>
              <p>X: {currentData.gx2.toFixed(2)}</p>
              <p>Y: {currentData.gy2.toFixed(2)}</p>
              <p>Z: {currentData.gz2.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Latest data received at:{" "}
        {lastUpdated || new Date().toLocaleTimeString()}
        {debugMode && (
          <span className="ml-2 text-yellow-600">(Simulated Data)</span>
        )}
      </div>
    </div>
  );
};

export default SensorDataDisplay;
