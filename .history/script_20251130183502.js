// Step 1: Parentheses
const step1 = 3 + 3;       
const step2 = 2 + 1;       // 3

// Step 2: Multiplication inside brackets
const step3 = 5 * step2;   

// Step 3: Braces
const step4 = 12 - step3;  

// Step 4: Division and multiplication
const step5 = 18 / step1 * 4; // 18/6*4 = 12

// Step 5: Combine with braces and exponent
const step6 = step5 - step4 + 7 ** 2; // 12 - (-3) + 49 = 64

console.log(step6); // 64
