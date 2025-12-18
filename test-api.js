/**
 * API Test Script for S K ASSOCIATES - CA Worker Backend
 * 
 * This script tests all API endpoints to ensure they work correctly.
 * Run with: node test-api.js
 * 
 * Make sure the server is running on http://localhost:8080
 */

const BASE_URL = 'http://localhost:8080/api';
let adminToken = '';
let candidateToken = '';
let firmToken = '';
let candidateId = '';
let firmId = '';

// Test data
const testCandidate = {
  fullName: "Test Candidate",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  mobileNumber: "9876543210",
  email: "test.candidate@example.com",
  password: "Password123",
  address: "123 Test Street, Test City, Test State",
  highestQualification: "CA",
  certifications: "CPA, ACCA",
  yearsOfExperience: "3-5",
  currentPreviousEmployer: "Test Company",
  positionHeld: "Senior Accountant",
  areasOfExpertise: ["Taxation", "Auditing"],
  softwareProficiency: ["Tally", "SAP"],
  otherSoftware: "QuickBooks",
  documents: ["resume.pdf", "certificates.pdf"]
};

const testFirm = {
  firmName: "Test Associates",
  registrationNumber: "TEST123456",
  dateOfRegistration: "2020-01-01",
  panGstNumber: "ABCDE1234F",
  firmType: "Partnership",
  headOfficeAddress: "123 Business Street, Test City",
  cityStatePin: "Mumbai, Maharashtra, 400001",
  firmContactNumber: "9876543210",
  email: "test.firm@example.com",
  password: "Password123",
  website: "https://testassociates.com",
  partners: [
    {
      name: "Test Partner",
      qualification: "CA",
      membershipNo: "123456",
      designation: "Managing Partner",
      contact: "9876543210"
    }
  ],
  areasOfPractice: ["Taxation", "Auditing"],
  otherPracticeArea: "Corporate Law",
  documents: ["registration.pdf", "pan.pdf"]
};

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`${method} ${endpoint} - Status: ${response.status}`);
    
    if (!response.ok) {
      console.log('Error:', result);
      return { success: false, status: response.status, data: result };
    }
    
    return { success: true, status: response.status, data: result };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Test functions
async function testSystemEndpoints() {
  console.log('\n=== Testing System Endpoints ===');
  
  // Test root endpoint
  const rootResponse = await fetch('http://localhost:8080/');
  const rootData = await rootResponse.json();
  console.log('GET / - Status:', rootResponse.status);
  console.log('Response:', rootData.message);
  
  // Test health endpoint
  const healthResponse = await fetch('http://localhost:8080/health');
  const healthData = await healthResponse.json();
  console.log('GET /health - Status:', healthResponse.status);
  console.log('Response:', healthData.message);
  
  // Test API info endpoint
  const apiResponse = await fetch(`${BASE_URL}`);
  const apiData = await apiResponse.json();
  console.log('GET /api - Status:', apiResponse.status);
  console.log('Response:', apiData.message);
}

async function testAdminLogin() {
  console.log('\n=== Testing Admin Login ===');
  
  const loginData = {
    username: "admin",
    password: "admin123"
  };
  
  const result = await makeRequest('POST', '/admins/login', loginData);
  
  if (result.success && result.data.data.token) {
    adminToken = result.data.data.token;
    console.log('✅ Admin login successful');
    console.log('Admin:', result.data.data.admin.username);
    return true;
  } else {
    console.log('❌ Admin login failed');
    return false;
  }
}

async function testCandidateRegistration() {
  console.log('\n=== Testing Candidate Registration ===');
  
  const result = await makeRequest('POST', '/candidates/register', testCandidate);
  
  if (result.success && result.data.data.token) {
    candidateToken = result.data.data.token;
    candidateId = result.data.data.candidate.id;
    console.log('✅ Candidate registration successful');
    console.log('Candidate ID:', candidateId);
    return true;
  } else {
    console.log('❌ Candidate registration failed');
    return false;
  }
}

async function testCandidateLogin() {
  console.log('\n=== Testing Candidate Login ===');
  
  const loginData = {
    email: testCandidate.email,
    password: testCandidate.password
  };
  
  const result = await makeRequest('POST', '/candidates/login', loginData);
  
  if (result.success && result.data.data.token) {
    candidateToken = result.data.data.token;
    console.log('✅ Candidate login successful');
    return true;
  } else {
    console.log('❌ Candidate login failed');
    return false;
  }
}

async function testFirmRegistration() {
  console.log('\n=== Testing Firm Registration ===');
  
  const result = await makeRequest('POST', '/firms/register', testFirm);
  
  if (result.success && result.data.data.token) {
    firmToken = result.data.data.token;
    firmId = result.data.data.firm.id;
    console.log('✅ Firm registration successful');
    console.log('Firm ID:', firmId);
    return true;
  } else {
    console.log('❌ Firm registration failed');
    return false;
  }
}

async function testFirmLogin() {
  console.log('\n=== Testing Firm Login ===');
  
  const loginData = {
    email: testFirm.email,
    password: testFirm.password
  };
  
  const result = await makeRequest('POST', '/firms/login', loginData);
  
  if (result.success && result.data.data.token) {
    firmToken = result.data.data.token;
    console.log('✅ Firm login successful');
    return true;
  } else {
    console.log('❌ Firm login failed');
    return false;
  }
}

async function testAdminEndpoints() {
  console.log('\n=== Testing Admin Endpoints ===');
  
  // Get all candidates
  const candidatesResult = await makeRequest('GET', '/candidates', null, adminToken);
  console.log(candidatesResult.success ? '✅ Get all candidates' : '❌ Get all candidates failed');
  
  // Get all firms
  const firmsResult = await makeRequest('GET', '/firms', null, adminToken);
  console.log(firmsResult.success ? '✅ Get all firms' : '❌ Get all firms failed');
  
  // Get dashboard stats
  const statsResult = await makeRequest('GET', '/dashboard/stats', null, adminToken);
  console.log(statsResult.success ? '✅ Get dashboard stats' : '❌ Get dashboard stats failed');
  
  if (statsResult.success) {
    console.log('Dashboard Stats:', statsResult.data.data);
  }
  
  // Update candidate status
  if (candidateId) {
    const statusResult = await makeRequest('PUT', `/candidates/${candidateId}/status`, { status: 'Approved' }, adminToken);
    console.log(statusResult.success ? '✅ Update candidate status' : '❌ Update candidate status failed');
  }
  
  // Update firm status
  if (firmId) {
    const statusResult = await makeRequest('PUT', `/firms/${firmId}/status`, { status: 'Approved' }, adminToken);
    console.log(statusResult.success ? '✅ Update firm status' : '❌ Update firm status failed');
  }
}

async function testCandidateEndpoints() {
  console.log('\n=== Testing Candidate Endpoints ===');
  
  // Get candidate profile
  const profileResult = await makeRequest('GET', '/candidates/profile/me', null, candidateToken);
  console.log(profileResult.success ? '✅ Get candidate profile' : '❌ Get candidate profile failed');
  
  // Update candidate profile
  if (candidateId) {
    const updateData = { certifications: 'Updated certifications' };
    const updateResult = await makeRequest('PUT', `/candidates/${candidateId}`, updateData, candidateToken);
    console.log(updateResult.success ? '✅ Update candidate profile' : '❌ Update candidate profile failed');
  }
}

async function testFirmEndpoints() {
  console.log('\n=== Testing Firm Endpoints ===');
  
  // Get firm profile
  const profileResult = await makeRequest('GET', '/firms/profile/me', null, firmToken);
  console.log(profileResult.success ? '✅ Get firm profile' : '❌ Get firm profile failed');
  
  // Update firm profile
  if (firmId) {
    const updateData = { website: 'https://updated-testassociates.com' };
    const updateResult = await makeRequest('PUT', `/firms/${firmId}`, updateData, firmToken);
    console.log(updateResult.success ? '✅ Update firm profile' : '❌ Update firm profile failed');
  }
}

async function testValidationErrors() {
  console.log('\n=== Testing Validation Errors ===');
  
  // Test invalid candidate registration
  const invalidCandidate = {
    fullName: "",
    email: "invalid-email",
    password: "123",
    mobileNumber: "123"
  };
  
  const result = await makeRequest('POST', '/candidates/register', invalidCandidate);
  console.log(result.success ? '❌ Validation should have failed' : '✅ Validation errors working');
  
  // Test invalid login
  const invalidLogin = {
    email: "nonexistent@example.com",
    password: "wrongpassword"
  };
  
  const loginResult = await makeRequest('POST', '/candidates/login', invalidLogin);
  console.log(loginResult.success ? '❌ Invalid login should have failed' : '✅ Invalid login properly rejected');
}

async function testUnauthorizedAccess() {
  console.log('\n=== Testing Unauthorized Access ===');
  
  // Test accessing admin endpoint without token
  const result = await makeRequest('GET', '/candidates');
  console.log(result.success ? '❌ Should require authentication' : '✅ Authentication required');
  
  // Test accessing admin endpoint with candidate token
  const candidateAsAdminResult = await makeRequest('GET', '/candidates', null, candidateToken);
  console.log(candidateAsAdminResult.success ? '❌ Should require admin role' : '✅ Role authorization working');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  try {
    // Check if server is running
    const serverCheck = await fetch('http://localhost:8080/health');
    if (!serverCheck.ok) {
      throw new Error('Server is not running. Please start the server first.');
    }
    
    await testSystemEndpoints();
    
    const adminLoginSuccess = await testAdminLogin();
    if (!adminLoginSuccess) {
      console.log('❌ Cannot continue without admin access');
      return;
    }
    
    await testCandidateRegistration();
    await testCandidateLogin();
    await testFirmRegistration();
    await testFirmLogin();
    
    await testAdminEndpoints();
    await testCandidateEndpoints();
    await testFirmEndpoints();
    
    await testValidationErrors();
    await testUnauthorizedAccess();
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.log('Install with: npm install node-fetch');
  console.log('Or use Node.js 18+');
  process.exit(1);
}

// Run tests
runAllTests();