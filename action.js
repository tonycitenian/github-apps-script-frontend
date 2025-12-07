/**
 * GitHub Apps Script Frontend - Action Handler
 * Manages API interactions and DOM updates
 */

const API_URL = "https://script.google.com/macros/s/AKfycbxidJ9lEVzLKQ3QB-zmsnhJgOB5PXDgVuYQC8biBizHkErDCc_PyrdINLCCiaovoUuKsg/exec";

/**
 * Display output to the DOM
 * @param {string|object} data - Data to display
 */
function show(data) {
  const outputElement = document.getElementById("output");
  if (outputElement) {
    outputElement.textContent =
      typeof data === "string" ? data : JSON.stringify(data, null, 2);
  }
}

/**
 * JSONP Wrapper - Makes cross-origin requests
 * @param {string} url - The URL to fetch
 * @returns {Promise} - Promise that resolves with the response data
 */
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = "cb_" + Math.random().toString(36).substring(2);

    window[callbackName] = (data) => {
      delete window[callbackName];
      resolve(data);
    };

    const script = document.createElement("script");
    script.src = url.replace("callback=cb", "callback=" + callbackName);
    script.onerror = () => {
      delete window[callbackName];
      reject(new Error("Script load failed"));
    };

    document.body.appendChild(script);
  });
}

/**
 * Test GET Request
 */
async function testGet() {
  show("Loading...");
  try {
    const url = API_URL + "?callback=cb&source=github";
    const data = await jsonp(url);
    show(data);
  } catch (error) {
    show("Error: " + error.message);
    console.error("GET Error:", error);
  }
}

/**
 * Test POST Request
 */
async function testPost() {
  show("Loading...");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "github",
        timestamp: new Date().toISOString(),
      }),
      mode: "no-cors",
    });

    show("POST request sent successfully");
  } catch (error) {
    show("Error: " + error.message);
    console.error("POST Error:", error);
  }
}

/**
 * Initialize the application
 */
function init() {
  console.log("Action.js loaded successfully");
  // Add any additional initialization code here
}

// Initialize when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
