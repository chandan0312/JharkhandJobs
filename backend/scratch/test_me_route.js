const runTest = async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLWpoYXJraGFuZGpvYnMwMyIsImlhdCI6MTc4MDM4MjcyNSwiZXhwIjoxNzgyOTc0NzI1fQ.yCz7J7A8LDyGaAz8Z120Lz15JtUbVFSvsqOAZEqN3mA';
  try {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error message:', err.message);
  }
};

runTest();
