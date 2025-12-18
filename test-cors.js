// Simple CORS test script
const testData = {
  fullName: "Test User",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  mobileNumber: "9876543210",
  email: "test@example.com",
  password: "Password123",
  address: "123 Test Street, Test City",
  highestQualification: "Graduate",
  certifications: "None",
  yearsOfExperience: "1-3",
  currentPreviousEmployer: "Test Company",
  positionHeld: "Test Position",
  areasOfExpertise: ["Taxation"],
  softwareProficiency: ["Tally"],
  documents: []
};

async function testCandidateRegistration() {
  try {
    console.log('Testing candidate registration...');
    
    const response = await fetch('http://localhost:8080/api/candidates/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or you need to install node-fetch');
  process.exit(1);
}

testCandidateRegistration();