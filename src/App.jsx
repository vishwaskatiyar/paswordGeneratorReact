import { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function App() {
  const [length, setLength] = useState(12);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [characterAllowed, setCharacterAllowed] = useState(true);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(true);
  const [lowercaseAllowed, setLowercaseAllowed] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "";
    if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercaseAllowed) str += "abcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*";
    for (let i = 0; i < length; i++) {
      pass += str[Math.floor(Math.random() * str.length)];
    }
    setPassword(pass);

    // Estimate password strength based on character types
    const regex = new RegExp(
      `^(?=.*[A-Z])(?=.*[a-z])(?=.*${numberAllowed ? "\\d" : ""})(?=.*${
        characterAllowed ? "\\W" : ""
      }).{8,}$`
    );
    if (regex.test(pass)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Weak");
    }
  }, [
    length,
    numberAllowed,
    characterAllowed,
    lowercaseAllowed,
    uppercaseAllowed,
  ]);

  useEffect(() => {
    passwordRef.current?.select();
    passwordGenerator();
  }, [
    length,
    numberAllowed,
    characterAllowed,
    lowercaseAllowed,
    uppercaseAllowed,
    passwordGenerator,
  ]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
  }, [password]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl text-center text-blue-600 mb-8 font-semibold">
          Password Generator
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={password}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Generated Password"
            readOnly
            ref={passwordRef}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">
              Strength: {passwordStrength}
            </span>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              onClick={copyPasswordToClipboard}
            >
              Copy
            </button>
          </div>
          <div className="flex items-center mt-4">
            <input
              type="range"
              min={8}
              max={30}
              value={length}
              className="cursor-pointer text-blue-500"
              onChange={(e) => setLength(e.target.value)}
            />
            <span className="ml-2 text-gray-600">Length: {length}</span>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Options:</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Checkbox
                label="Include Uppercase Letters"
                checked={uppercaseAllowed}
                onChange={() => setUppercaseAllowed((prev) => !prev)}
              />
              <Checkbox
                label="Include Lowercase Letters"
                checked={lowercaseAllowed}
                onChange={() => setLowercaseAllowed((prev) => !prev)}
              />
              <Checkbox
                label="Include Numbers"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
              />
              <Checkbox
                label="Include Special Characters"
                checked={characterAllowed}
                onChange={() => setCharacterAllowed((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-2 text-blue-500 focus:ring-blue-400"
      />
      <label className="text-gray-700">{label}</label>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default App;
