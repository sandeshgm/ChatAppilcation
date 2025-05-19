import base64js from "base64-js";
// Helper: GCD

function gcd(a, b) {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

// Modular inverse using Extended Euclidean Algorithm
function modInverse(a, m) {
  let m0 = m,
    x0 = 0n,
    x1 = 1n;
  while (a > 1n) {
    let q = a / m;
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0n ? x1 + m0 : x1;
}

function base64ToString(base64) {
  const bytes = base64js.toByteArray(base64);
  return new TextDecoder().decode(bytes);
}

// Modular exponentiation
function modPow(base, exponent, modulus) {
  let result = 1n;
  base %= modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = (result * base) % modulus;
    exponent >>= 1n;
    base = (base * base) % modulus;
  }
  return result;
}

// Naive prime checker
function isPrime(n) {
  if (n < 2n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false;
  for (let i = 3n; i * i <= n; i += 2n) {
    if (n % i === 0n) return false;
  }
  return true;
}

// Generate a small random prime
function generateSmallPrime() {
  while (true) {
    let num = BigInt(Math.floor(Math.random() * 100) + 100);
    if (isPrime(num)) return num;
  }
}

//Asynchronous RSA Key Generation (simulate non-blocking)
export const generateRSAKeys = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const p = generateSmallPrime();
      const q = generateSmallPrime();
      const n = p * q;
      const phi = (p - 1n) * (q - 1n);

      let e = 211n;
      while (gcd(e, phi) !== 1n) e += 2n;

      const d = modInverse(e, phi);

      resolve({
        publicKey: `${e.toString()}:${n.toString()}`,
        privateKey: `${d.toString()}:${n.toString()}`,
      });
    }, 0); // simulate async
  });

//Encrypt using public key (format: "e:n")
export const encryptMessage = (publicKey, message) => {
  const [eStr, nStr] = publicKey.split(":");
  const e = BigInt(eStr);
  const n = BigInt(nStr);
  return Array.from(message)
    .map((ch) => {
      const m = BigInt(ch.charCodeAt(0));
      return modPow(m, e, n).toString();
    })
    .join(",");
};

//Decrypt using private key (format: "d:n")
export const decryptMessage = (privateKey, encryptedMessage) => {
  // Try decoding base64 first — if fails, fallback to original string
  let decodedMessage;
  try {
    decodedMessage = base64ToString(encryptedMessage);
  } catch (error) {
    decodedMessage = encryptedMessage;
  }

  const [dStr, nStr] = privateKey.split(":");
  const d = BigInt(dStr);
  const n = BigInt(nStr);

  return decodedMessage
    .split(",")
    .map((part) => {
      const c = BigInt(part);
      const m = modPow(c, d, n);
      return String.fromCharCode(Number(m));
    })
    .join("");
};
