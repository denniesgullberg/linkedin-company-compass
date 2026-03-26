const SUPABASE_URL = 'https://sfudvvyitglrhpmvbdwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdWR2dnlpdGdscmhwbXZiZHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTM1ODYsImV4cCI6MjA5MDEyOTU4Nn0.OWw7N5oFwOr-dxDtQikFp3gkuCGzJfmKw-gTGv1GhjM';

// Extract company name from LinkedIn job posting pages
function getCompanyName() {
  // Job posting page
  const selectors = [
    '.job-details-jobs-unified-top-card__company-name a',
    '.jobs-unified-top-card__company-name a',
    '.topcard__org-name-link',
    '.company-name-text',
    '[data-tracking-control-name="public_jobs_topcard-org-name"]',
  ];
  
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) return el.textContent.trim();
  }
  
  // Company page
  const h1 = document.querySelector('.org-top-card-summary__title');
  if (h1) return h1.textContent.trim();
  
  return null;
}

// Fetch ratings for a company
async function fetchRatings(companyName) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/get-ratings?company=${encodeURIComponent(companyName)}`,
      { headers: { 'apikey': SUPABASE_ANON_KEY } }
    );
    const data = await res.json();
    return data.company;
  } catch (e) {
    console.error('HireScore: Failed to fetch ratings', e);
    return null;
  }
}

// Create the badge element
function createBadge(company) {
  const existing = document.getElementById('hirescore-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'hirescore-badge';
  
  const score = Math.round(company.avg_score);
  const total = company.total_ratings;
  const color = score >= 70 ? '#00ff88' : score >= 40 ? '#ffaa00' : '#ff4444';
  
  badge.innerHTML = `
    <div class="hs-badge" style="--score-color: ${color}">
      <div class="hs-score">${score}</div>
      <div class="hs-label">
        <span class="hs-title">HIRESCORE</span>
        <span class="hs-count">${total} rating${total !== 1 ? 's' : ''}</span>
      </div>
    </div>
  `;
  
  // Try to inject near company name
  const targets = [
    '.job-details-jobs-unified-top-card__company-name',
    '.jobs-unified-top-card__company-name',
    '.topcard__content-left',
    '.org-top-card-summary__title',
  ];
  
  for (const sel of targets) {
    const target = document.querySelector(sel);
    if (target) {
      target.parentElement.insertBefore(badge, target.nextSibling);
      return;
    }
  }
  
  // Fallback: fixed position
  badge.classList.add('hs-fixed');
  document.body.appendChild(badge);
}

function showNoBadge() {
  const existing = document.getElementById('hirescore-badge');
  if (existing) existing.remove();
  
  const badge = document.createElement('div');
  badge.id = 'hirescore-badge';
  badge.innerHTML = `
    <div class="hs-badge hs-badge--empty">
      <div class="hs-score">?</div>
      <div class="hs-label">
        <span class="hs-title">HIRESCORE</span>
        <span class="hs-count">No ratings yet</span>
      </div>
    </div>
  `;
  
  const targets = [
    '.job-details-jobs-unified-top-card__company-name',
    '.jobs-unified-top-card__company-name',
    '.topcard__content-left',
    '.org-top-card-summary__title',
  ];
  
  for (const sel of targets) {
    const target = document.querySelector(sel);
    if (target) {
      target.parentElement.insertBefore(badge, target.nextSibling);
      return;
    }
  }
  
  badge.classList.add('hs-fixed');
  document.body.appendChild(badge);
}

// Main logic
async function init() {
  const companyName = getCompanyName();
  if (!companyName) return;
  
  // Store for popup
  chrome.storage.local.set({ currentCompany: companyName });
  
  const company = await fetchRatings(companyName);
  if (company && company.total_ratings > 0) {
    createBadge(company);
  } else {
    showNoBadge();
  }
}

// Run on page load and URL changes (LinkedIn is SPA)
init();

let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(init, 1500);
  }
});
observer.observe(document.body, { childList: true, subtree: true });
