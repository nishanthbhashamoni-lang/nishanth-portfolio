import fs from 'fs';
import path from 'path';

async function runProductionTests() {
  const baseUrl = 'http://localhost:5000';
  const results = {};

  console.log('--- Starting Comprehensive Production Server Test ---');

  // 1. Health Check Endpoint
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    results['1. GET /api/health'] = (res.status === 200 && data.status === 'ok');
    console.log('✓ Health check response:', data);
  } catch (e) {
    results['1. GET /api/health'] = false;
  }

  // 2. Production Frontend Root
  try {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    results['2. GET / (Serves Built Frontend HTML)'] = (res.status === 200 && html.includes('<div id="root">') && html.includes('Nishanth Bhashamoni'));
  } catch (e) {
    results['2. GET / (Serves Built Frontend HTML)'] = false;
  }

  // 3. Frontend /admin Routing
  try {
    const res = await fetch(`${baseUrl}/admin`);
    const html = await res.text();
    results['3. GET /admin (Client-side Routing Fallback)'] = (res.status === 200 && html.includes('<div id="root">'));
  } catch (e) {
    results['3. GET /admin (Client-side Routing Fallback)'] = false;
  }

  // 4. Public Categories Endpoint
  try {
    const res = await fetch(`${baseUrl}/api/categories`);
    const data = await res.json();
    results['4. GET /api/categories (Public Categories)'] = (res.status === 200 && data.success && Array.isArray(data.data) && data.count >= 4);
  } catch (e) {
    results['4. GET /api/categories (Public Categories)'] = false;
  }

  // 5. Public Projects Endpoint
  try {
    const res = await fetch(`${baseUrl}/api/projects`);
    const data = await res.json();
    results['5. GET /api/projects (Public Projects & Work)'] = (res.status === 200 && data.success && Array.isArray(data.data) && data.count >= 2);
  } catch (e) {
    results['5. GET /api/projects (Public Projects & Work)'] = false;
  }

  // 6. Resume Status & View Endpoints
  try {
    const statusRes = await fetch(`${baseUrl}/api/resume/status`);
    const statusData = await statusRes.json();
    results['6a. GET /api/resume/status'] = (statusRes.status === 200 && statusData.success);

    const viewRes = await fetch(`${baseUrl}/api/resume/view`);
    results['6b. GET /api/resume/view (Inline PDF stream)'] = (viewRes.status === 200 || viewRes.status === 404); // 404 is clean if un-uploaded
  } catch (e) {
    results['6. Resume Endpoints'] = false;
  }

  // 7. Admin Authentication
  let token = '';
  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin', password: 'adminpassword123' })
    });
    const loginData = await loginRes.json();
    token = loginData.token || '';
    results['7. POST /api/auth/login (JWT Generation)'] = (loginRes.status === 200 && loginData.success && Boolean(token));
  } catch (e) {
    results['7. POST /api/auth/login'] = false;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 8. Category CRUD Operations (Protected)
  let testCatId = '';
  try {
    const createCat = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Distributed Systems & Cloud',
        description: 'Microservices and cloud infrastructure.',
        icon: 'Cloud',
        sortOrder: 10,
        isActive: true
      })
    });
    const catData = await createCat.json();
    testCatId = catData.data?.id;
    results['8a. Create Category (Protected)'] = (createCat.status === 201 && catData.success);

    // Edit Category
    const editCat = await fetch(`${baseUrl}/api/categories/${testCatId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Distributed Systems & Cloud Architecture' })
    });
    const editData = await editCat.json();
    results['8b. Edit Category (Protected)'] = (editCat.status === 200 && editData.success);
  } catch (e) {
    results['8. Category CRUD'] = false;
  }

  // 9. Work / Project CRUD Operations (Protected)
  let testWorkId = '';
  try {
    const createWork = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'High-Throughput Log Aggregator',
        tagline: 'Distributed streaming pipeline',
        description: 'Scalable log indexing pipeline processing streaming logs.',
        workType: 'Project',
        categoryIds: [testCatId],
        technologies: ['Node.js', 'Redis', 'Docker'],
        status: 'Completed',
        featured: true
      })
    });
    const workData = await createWork.json();
    testWorkId = workData.data?.id;
    results['9a. Create Work Item (Protected)'] = (createWork.status === 201 && workData.success);

    // Edit Work Item
    const editWork = await fetch(`${baseUrl}/api/projects/${testWorkId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ tagline: 'Updated Distributed streaming engine' })
    });
    const editWorkData = await editWork.json();
    results['9b. Edit Work Item (Protected)'] = (editWork.status === 200 && editWorkData.success);
  } catch (e) {
    results['9. Work CRUD'] = false;
  }

  // 10. File Upload (Protected)
  try {
    const form = new FormData();
    const blob = new Blob(['sample test content'], { type: 'text/plain' });
    form.append('file', new File([blob], 'sample.pdf', { type: 'application/pdf' }));

    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    });
    const uploadData = await uploadRes.json();
    results['10. File / PDF Attachment Upload (Protected)'] = (uploadRes.status === 201 && uploadData.success);

    // Delete uploaded file
    if (uploadData.url) {
      await fetch(`${baseUrl}/api/upload`, {
        method: 'DELETE',
        headers: authHeaders,
        body: JSON.stringify({ url: uploadData.url })
      });
    }
  } catch (e) {
    results['10. File Upload'] = false;
  }

  // 11. Clean Up Test Work and Category
  try {
    if (testWorkId) {
      await fetch(`${baseUrl}/api/projects/${testWorkId}`, { method: 'DELETE', headers: authHeaders });
    }
    if (testCatId) {
      await fetch(`${baseUrl}/api/categories/${testCatId}`, { method: 'DELETE', headers: authHeaders });
    }
    results['11. Clean Up Test Data'] = true;
  } catch (e) {
    results['11. Clean Up Test Data'] = false;
  }

  // 12. Unauthorized visitor mutation block (401)
  try {
    const unauth = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker Category' })
    });
    results['12. Block Unauthenticated Mutations (401 Unauthorized)'] = (unauth.status === 401);
  } catch (e) {
    results['12. Unauthenticated Mutation Block'] = false;
  }

  console.log('\n====================================================');
  console.log('PROD SERVER VERIFICATION RESULTS:');
  console.log('====================================================');
  for (const [test, passed] of Object.entries(results)) {
    console.log(`${passed ? '✓ PASSED' : '❌ FAILED'}: ${test}`);
  }
  console.log('====================================================\n');

  const allPassed = Object.values(results).every(Boolean);
  process.exit(allPassed ? 0 : 1);
}

runProductionTests();