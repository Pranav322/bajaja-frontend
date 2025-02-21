import { useState } from "react";

export default function BFHLFrontend() {
  const [numbers, setNumbers] = useState("");
  const [alphabets, setAlphabets] = useState("");
  const [response, setResponse] = useState(null);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const apiUrl = "https://bajaj-backend-shivraj-9762bbb2056d.herokuapp.com/bfhl";

  const handleSubmit = async () => {
    setIsLoading(true); // Disable button
    setErrorMessage(""); // Clear previous error message
    try {
      const dataToSend = {
        data: [...numbers.split(",").map(num => num.trim()), ...alphabets.split(",").map(alpha => alpha.trim())]
      };
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      
      // Ensure the highest alphabet is included in the alphabets list
      if (data.highest_alphabet && data.alphabets) {
        if (!data.alphabets.includes(data.highest_alphabet)) {
          data.alphabets.push(data.highest_alphabet);
        }
      }
      
      setResponse(data);
    } catch (error) {
      setErrorMessage("API error: " + error.message); // Show error message
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  const filteredResponse = () => {
    if (!response) return null;
    const { numbers, alphabets, highest_alphabet } = response;
    let filteredData = {};
    if (filter.includes("Numbers")) filteredData.numbers = numbers;
    if (filter.includes("Alphabets")) {
      // Flatten the alphabets array
      filteredData.alphabets = alphabets.flat();
    }
    if (filter.includes("Highest Alphabet")) filteredData.highest_alphabet = highest_alphabet;
    return filteredData;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", height: "100vh" }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>BFHL Frontend</h1>
      <input
        type="text"
        placeholder="Enter numbers (comma-separated)"
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        style={{ padding: "10px", width: "400px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <br />
      <input
        type="text"
        placeholder="Enter alphabets (comma-separated)"
        value={alphabets}
        onChange={(e) => setAlphabets(e.target.value)}
        style={{ padding: "10px", width: "400px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <br />
      <button 
        onClick={handleSubmit} 
        disabled={isLoading} // Disable button while loading
        style={{ padding: "10px 20px", marginBottom: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "white", border: "none", cursor: isLoading ? "not-allowed" : "pointer" }}
      >
        {isLoading ? "Loading..." : "Submit"} 
      </button>
      {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
      <br />
      <select 
        multiple 
        onChange={(e) => setFilter([...e.target.selectedOptions].map(o => o.value))} 
        style={{ padding: "10px", width: "200px", borderRadius: "5px", border: "1px solid #ccc" }}
      >
        <option value="Numbers">Numbers</option>
        <option value="Alphabets">Alphabets</option>
        <option value="Highest Alphabet">Highest Alphabet</option>
      </select>
      <br />
      {response && (
        <div style={{ marginTop: "20px", padding: "15px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "white", display: "inline-block", textAlign: "left" }}>
          <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}