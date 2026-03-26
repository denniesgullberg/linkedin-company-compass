const SUPABASE_URL = 'https://sfudvvyitglrhpmvbdwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdWR2dnlpdGdscmhwbXZiZHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTM1ODYsImV4cCI6MjA5MDEyOTU4Nn0.OWw7N5oFwOr-dxDtQikFp3gkuCGzJfmKw-gTGv1GhjM';

let currentSession = null;

// Auth functions
async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data;
}

async function signUp(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data;
}

function showAuth() {
  document.getElementById('auth-view').style.display = 'block';
  document.getElementById('main-view').style.display = 'none';
}

function showMain(session) {
  currentSession = session;
  document.getElementById('auth-view').style.display = 'none';
  document.getElementById('main-view').style.display = 'block';
  document.getElementById('user-email').textContent = session.user.email;
  loadCompany();
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  const stored = await chrome.storage.local.get(['session']);
  if (stored.session && stored.session.access_token) {
    showMain(stored.session);
  } else {
    showAuth();
  }
  
  // Score slider
  const scoreSlider = document.getElementById('score');
  const scoreDisplay = document.getElementById('score-display');
  scoreSlider.addEventListener('input', () => {
    scoreDisplay.textContent = scoreSlider.value;
    const val = parseInt(scoreSlider.value);
    scoreDisplay.style.color = val >= 70 ? '#00ff88' : val >= 40 ? '#ffaa00' : '#ff4444';
  });
  
  // Auth buttons
  document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const status = document.getElementById('auth-status');
    try {
      const session = await signIn(email, password);
      await chrome.storage.local.set({ session });
      showMain(session);
    } catch (e) {
      status.textContent = e.message;
      status.className = 'status error';
    }
  });
  
  document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const status = document.getElementById('auth-status');
    try {
      const data = await signUp(email, password);
      if (data.access_token) {
        await chrome.storage.local.set({ session: data });
        showMain(data);
      } else {
        status.textContent = 'Check your email to confirm signup';
        status.className = 'status success';
      }
    } catch (e) {
      status.textContent = e.message;
      status.className = 'status error';
    }
  });
  
  document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await chrome.storage.local.remove('session');
    currentSession = null;
    showAuth();
  });
  
  // Submit
  document.getElementById('submit-btn').addEventListener('click', submitRating);
});

async function loadCompany() {
  const stored = await chrome.storage.local.get(['currentCompany']);
  const companyName = stored.currentCompany;
  
  if (!companyName) {
    document.getElementById('no-company').style.display = 'block';
    document.getElementById('rating-form').style.display = 'none';
    return;
  }
  
  document.getElementById('no-company').style.display = 'none';
  document.getElementById('rating-form').style.display = 'block';
  document.getElementById('company-name-display').textContent = companyName;
  
  // Fetch existing ratings
  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/get-ratings?company=${encodeURIComponent(companyName)}`,
      { headers: { 'apikey': SUPABASE_ANON_KEY } }
    );
    const data = await res.json();
    if (data.company && data.company.total_ratings > 0) {
      const c = data.company;
      const interviewRate = c.ratings ? 
        Math.round((c.ratings.filter(r => r.got_interview).length / c.ratings.length) * 100) : 0;
      const personalRate = c.ratings ?
        Math.round((c.ratings.filter(r => r.response_type === 'personal').length / c.ratings.length) * 100) : 0;
      
      document.getElementById('existing-summary').innerHTML = `
        <div class="existing-ratings">
          <div class="rating-summary">
            <div class="stat">
              <div class="stat-value" style="color:${Math.round(c.avg_score) >= 70 ? '#00ff88' : Math.round(c.avg_score) >= 40 ? '#ffaa00' : '#ff4444'}">${Math.round(c.avg_score)}</div>
              <div class="stat-label">Avg Score</div>
            </div>
            <div class="stat">
              <div class="stat-value">${personalRate}%</div>
              <div class="stat-label">Personal Reply</div>
            </div>
            <div class="stat">
              <div class="stat-value">${interviewRate}%</div>
              <div class="stat-label">Interview Rate</div>
            </div>
          </div>
          <div style="font-size:10px;color:#666;margin-bottom:12px">${c.total_ratings} total rating${c.total_ratings !== 1 ? 's' : ''}</div>
        </div>
      `;
    }
  } catch (e) {
    console.error('Failed to load ratings', e);
  }
}

async function submitRating() {
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('submit-status');
  btn.disabled = true;
  
  const stored = await chrome.storage.local.get(['currentCompany']);
  const responseType = document.querySelector('input[name="response"]:checked');
  
  if (!responseType) {
    status.textContent = 'Please select a response type';
    status.className = 'status error';
    btn.disabled = false;
    return;
  }
  
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${currentSession.access_token}`,
      },
      body: JSON.stringify({
        companyName: stored.currentCompany,
        overallScore: parseInt(document.getElementById('score').value),
        responseType: responseType.value,
        gotInterview: document.getElementById('interview').checked,
        comment: document.getElementById('comment').value || null,
      }),
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    
    status.textContent = 'Rating submitted!';
    status.className = 'status success';
    loadCompany(); // Refresh
  } catch (e) {
    status.textContent = e.message;
    status.className = 'status error';
  } finally {
    btn.disabled = false;
  }
}
