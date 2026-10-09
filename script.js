/**
 * ALEX RIVERA — FREELANCE PORTFOLIO & SERVICES INTERACTIVE LOGIC
 * High-performance Vanilla JavaScript for Smooth UX, Calculations, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initThemeToggle();
  initHeaderScrollSpy();
  initMobileNav();
  initStatsCounter();
  initAmbientCursor();
  initProjectFilters();
  initCostCalculator();
  initFaqAccordion();
  initContactForm();
  initDirectCopyActions();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light) with LocalStorage
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to dark
  const savedTheme = localStorage.getItem('ar_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('ar_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, '🎨');
    });
  }
}

/* --------------------------------------------------------------------------
   2. Sticky Header & Scroll Spy Navigation
   -------------------------------------------------------------------------- */
function initHeaderScrollSpy() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy active link
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  function openMobileNav() {
    mobileDrawer.classList.add('open');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileDrawer.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   4. Number Counter Animation on Scroll
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseFloat(el.getAttribute('data-target'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || (el.innerText.includes('%') ? '%' : '+');
          
          animateValue(el, 0, targetVal, 1600, prefix, suffix);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));

  function animateValue(obj, start, end, duration, prefix, suffix) {
    let startTimestamp = null;
    const isFloat = end % 1 !== 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = (t) => t * (2 - t);
      const currentVal = easeOutQuad(progress) * (end - start) + start;

      obj.innerHTML = `${prefix}${isFloat ? currentVal.toFixed(1) : Math.floor(currentVal)}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* --------------------------------------------------------------------------
   5. Mouse Spotlight / Cursor Glow Effect
   -------------------------------------------------------------------------- */
function initAmbientCursor() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/* --------------------------------------------------------------------------
   6. Project Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Project Cost & Timeline Estimator
   -------------------------------------------------------------------------- */
function initCostCalculator() {
  const typeBtns = document.querySelectorAll('.calc-option-btn');
  const featureCheckboxes = document.querySelectorAll('.calc-feature-input');
  const timelinePills = document.querySelectorAll('.timeline-pill');
  
  const calcTotalPriceEl = document.getElementById('calcTotalPrice');
  const summaryProjectTypeName = document.getElementById('summaryProjectTypeName');
  const summaryEstimatedWeeks = document.getElementById('summaryEstimatedWeeks');
  const summaryFeatureCount = document.getElementById('summaryFeatureCount');
  const summaryFeaturesTags = document.getElementById('summaryFeaturesTags');
  const applyEstimateBtn = document.getElementById('applyEstimateToContactBtn');

  // State object
  let calcState = {
    basePrice: 4500,
    baseWeeks: 3,
    typeName: 'Full SaaS / Web App',
    multiplier: 1.0,
    timelineLabel: 'Standard (4-5 weeks)',
    selectedFeatures: [
      { name: 'Auth & Multi-Tenant RBAC', price: 600, extraDays: 3 },
      { name: 'Stripe Subscriptions Billing', price: 850, extraDays: 4 },
      { name: 'Admin Analytics Dashboard', price: 750, extraDays: 3 }
    ]
  };

  // Project Type Selection
  typeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      calcState.basePrice = parseFloat(btn.getAttribute('data-base-price'));
      calcState.baseWeeks = parseFloat(btn.getAttribute('data-base-weeks'));
      calcState.typeName = btn.querySelector('.opt-title').innerText;

      updateCalculation();
    });
  });

  // Features Selection
  featureCheckboxes.forEach((chk) => {
    chk.addEventListener('change', () => {
      updateSelectedFeatures();
      updateCalculation();
    });
  });

  function updateSelectedFeatures() {
    calcState.selectedFeatures = [];
    featureCheckboxes.forEach((chk) => {
      if (chk.checked) {
        calcState.selectedFeatures.push({
          name: chk.getAttribute('data-name'),
          price: parseFloat(chk.getAttribute('data-price')),
          extraDays: parseFloat(chk.getAttribute('data-extra-days'))
        });
      }
    });
  }

  // Timeline Multiplier Selection
  timelinePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      timelinePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      calcState.multiplier = parseFloat(pill.getAttribute('data-multiplier'));
      calcState.timelineLabel = pill.getAttribute('data-timeline-label');

      updateCalculation();
    });
  });

  // Calculate & Render
  function updateCalculation() {
    const featuresTotal = calcState.selectedFeatures.reduce((sum, item) => sum + item.price, 0);
    const extraDaysTotal = calcState.selectedFeatures.reduce((sum, item) => sum + item.extraDays, 0);
    
    const subtotal = calcState.basePrice + featuresTotal;
    const finalPrice = Math.round(subtotal * calcState.multiplier);

    const calculatedWeeks = Math.max(1, (calcState.baseWeeks + (extraDaysTotal / 7)) / (calcState.multiplier === 1.5 ? 1.4 : 1)).toFixed(1);

    // Update DOM
    if (calcTotalPriceEl) {
      calcTotalPriceEl.innerText = finalPrice.toLocaleString();
    }
    if (summaryProjectTypeName) {
      summaryProjectTypeName.innerText = calcState.typeName;
    }
    if (summaryEstimatedWeeks) {
      summaryEstimatedWeeks.innerText = `${calculatedWeeks} - ${(parseFloat(calculatedWeeks) + 1).toFixed(1)} Weeks`;
    }
    if (summaryFeatureCount) {
      summaryFeatureCount.innerText = `${calcState.selectedFeatures.length} Add-on${calcState.selectedFeatures.length === 1 ? '' : 's'}`;
    }

    // Render tags
    if (summaryFeaturesTags) {
      summaryFeaturesTags.innerHTML = '';
      calcState.selectedFeatures.forEach((feat) => {
        const span = document.createElement('span');
        span.className = 'summary-feat-pill';
        span.innerText = `+ ${feat.name}`;
        summaryFeaturesTags.appendChild(span);
      });
      if (calcState.selectedFeatures.length === 0) {
        summaryFeaturesTags.innerHTML = '<span class="summary-feat-pill">Core Base Features Only</span>';
      }
    }
  }

  // Initial Calculation Run
  updateCalculation();

  // Apply Estimate to Contact Form
  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', () => {
      const serviceSelect = document.getElementById('serviceSelect');
      const projectMessage = document.getElementById('projectMessage');
      const contactSection = document.getElementById('contact');

      // Autofill service
      if (serviceSelect) {
        if (calcState.typeName.includes('SaaS')) {
          serviceSelect.value = 'Full-Stack Web App / SaaS';
        } else if (calcState.typeName.includes('MVP')) {
          serviceSelect.value = 'MVP Sprint (3-4 Weeks)';
        } else if (calcState.typeName.includes('Landing')) {
          serviceSelect.value = 'High-Converting Landing Page';
        }
      }

      // Format custom message
      const featNames = calcState.selectedFeatures.map((f) => f.name).join(', ') || 'Standard Core Specs';
      const estimateSummary = `[Estimated via Project Calculator: ${calcState.typeName} (~$${calcTotalPriceEl.innerText} USD, Timeline: ${summaryEstimatedWeeks.innerText}, Features: ${featNames})]\n\nHello Alex, I'd like to discuss building...`;

      if (projectMessage) {
        projectMessage.value = estimateSummary;
      }

      // Smooth scroll to contact
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Estimate transferred into inquiry form!', '✨');
        setTimeout(() => {
          document.getElementById('clientName')?.focus();
        }, 600);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Contact Form Validation & Simulated Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('clientContactForm');
  const submitBtn = document.getElementById('submitFormBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const messageInput = document.getElementById('projectMessage');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, true);
      isValid = false;
    } else {
      showError(nameInput, false);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, true);
      isValid = false;
    } else {
      showError(emailInput, false);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, true);
      isValid = false;
    } else {
      showError(messageInput, false);
    }

    if (isValid) {
      // Simulate submission state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-text">Sending Inquiry...</span>
        <svg style="animation: spin 1s linear infinite" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Inquiry sent successfully! ', '🚀');
      }, 1200);
    }
  });

  function showError(inputEl, hasError) {
    const parent = inputEl.closest('.form-group');
    if (hasError) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
  }
}

/* --------------------------------------------------------------------------
   10. Direct Copy Actions & Toasts
   -------------------------------------------------------------------------- */
function initDirectCopyActions() {
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyCodeBtn = document.getElementById('copyCodeSnippetBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'jyotishmansb4U@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!', '📋');
      });
    });
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const code = `const developer = { name: "Jyotishman", role: "Full-Stack Engineer", email: "jyotishmansb4u@gmail.com" };`;
      navigator.clipboard.writeText(code).then(() => {
        showToast('Code config copied to clipboard!', '💻');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   11. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message, icon = '✨') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* --------------------------------------------------------------------------
   12. Case Study Modal Data & Handlers
   -------------------------------------------------------------------------- */
const CASE_STUDIES_DATA = {
  1: {
    title: 'AuraCloud — Multi-Tenant Cloud Telemetry & Observability SaaS',
    tag: 'Full-Stack SaaS Platform',
    client: 'AuraCloud Inc. (Seed to Series A)',
    stats: [
      { val: '+310%', desc: 'MRR Growth in 90 Days' },
      { val: '5M+', desc: 'Daily Telemetry Events' },
      { val: '< 50ms', desc: 'Avg Query Response' }
    ],
    overview: 'AuraCloud needed an enterprise-grade cloud observability portal capable of rendering real-time telemetry streams, managing granular user roles, and processing automated recurring seat billing with Stripe.',
    challenge: 'Handling burst traffic ingestion from thousands of agent servers while keeping client-side dashboard queries responsive and under 50 milliseconds.',
    solution: 'Engineered a Next.js 14 frontend with WebGL canvas streaming charts paired with a high-throughput ClickHouse and Redis pipeline. Implemented Stripe Customer Portal for seamless self-serve upgrades.',
    tech: ['Next.js 14', 'TypeScript', 'Node.js', 'ClickHouse', 'Redis', 'Stripe Billing', 'Tailwind CSS']
  },
  2: {
    title: 'Synthetix AI — Visual Workflow Orchestration Studio',
    tag: 'AI System & Visual Canvas',
    client: 'Synthetix AI Labs',
    stats: [
      { val: '24,000+', desc: 'Active Monthly Creators' },
      { val: '1.2M+', desc: 'Automations Executed' },
      { val: '4.9/5', desc: 'Product Hunt Rating' }
    ],
    overview: 'Synthetix wanted a low-code visual playground where marketing teams and developers could build chained LLM agent loops, conditional logic branches, and export automated webhook endpoints.',
    challenge: 'Designing a frictionless infinite-canvas node editor that supports zoom, pan, real-time node validation, and live streaming token outputs without UI stutter.',
    solution: 'Leveraged React Flow with custom Web Workers for heavy schema validation, integrated OpenAI streaming APIs, and built robust cost-control token throttling.',
    tech: ['React Flow', 'FastAPI', 'Python', 'OpenAI API', 'PostgreSQL', 'WebSockets']
  },
  3: {
    title: 'Veloce Horology — Headless Luxury Watch Store with 3D Configurator',
    tag: 'Headless E-Commerce & 3D WebGL',
    client: 'Veloce Timepieces Switzerland',
    stats: [
      { val: '$1.8M', desc: 'First Quarter Revenue' },
      { val: '0.7s', desc: 'Global Page Load Time' },
      { val: '99/100', desc: 'Lighthouse Performance' }
    ],
    overview: 'A bespoke digital flagship store for an ultra-luxury Swiss horology brand featuring a 3D real-time watch material and strap customizer.',
    challenge: 'Delivering cinematic 3D graphics on mobile devices while maintaining instantaneous page loads and flawless Shopify checkout integration.',
    solution: 'Built a lightweight Three.js renderer with progressive texture loading and paired it with Next.js static site generation and the Shopify Storefront GraphQL API.',
    tech: ['Three.js', 'Next.js', 'Shopify Storefront API', 'GSAP Animations', 'Vanilla CSS']
  },
  4: {
    title: 'Nexus Cybersecurity — Interactive Threat Simulation Platform',
    tag: 'High-Converting Enterprise Landing',
    client: 'Nexus Security Inc.',
    stats: [
      { val: '+185%', desc: 'Demo Conversion Rate' },
      { val: '42s', desc: 'Avg Engagement Time' },
      { val: '100/100', desc: 'Core Web Vitals' }
    ],
    overview: 'An interactive product landing experience that lets enterprise CTOs simulate cyberattack vectors and test defensive responses in real-time right in their browser.',
    challenge: 'Communicating complex zero-trust architecture concepts visually in a captivating way that converts enterprise decision-makers.',
    solution: 'Crafted dynamic HTML5 canvas interactive particle simulations with smooth scroll-driven storytelling and automated CRM lead qualification.',
    tech: ['HTML5 Canvas', 'Vanilla CSS3', 'TypeScript', 'HubSpot API', 'Vercel Edge']
  },
  5: {
    title: 'PayForge Global — Multi-Currency Treasury & FX Settlement',
    tag: 'Fintech & Real-Time Banking',
    client: 'PayForge Global Ltd.',
    stats: [
      { val: '$40M+', desc: 'Monthly Volume Handled' },
      { val: '99.99%', desc: 'Uptime Reliability' },
      { val: '0.3s', desc: 'FX Lock Execution' }
    ],
    overview: 'A secure, SOC2-compliant corporate treasury dashboard for multinational companies managing currency exchanges and automated wire payouts across 35 countries.',
    challenge: 'Ensuring absolute zero latency on volatile foreign exchange rates and bank-grade authentication flows.',
    solution: 'Architected WebSocket streaming feeds, Redis Pub/Sub channels, biometric WebAuthn 2FA, and strict role-based audit logs.',
    tech: ['React', 'NestJS', 'Redis', 'PostgreSQL', 'Plaid API', 'WebSockets']
  },
  6: {
    title: 'Scriptify — AI Creator Script Studio & Hook Engine',
    tag: 'AI SaaS & Creator Tool',
    client: 'Scriptify Creator Lab (Acquired)',
    stats: [
      { val: '$3.2M', desc: 'Successful Acquisition' },
      { val: '65,000+', desc: 'Scripts Generated' },
      { val: '4.8x', desc: 'Creator Workflow Speed' }
    ],
    overview: 'An AI-powered video scriptwriter that analyzes viral YouTube and TikTok patterns to generate high-retention hooks and outlines.',
    challenge: 'Creating a clean, distraction-free markdown text editor that allows inline AI commands (like slash commands) while keeping the UX snappy.',
    solution: 'Built an extensible TipTap-based rich text editor connected to fine-tuned Claude & GPT models with instant version history snapshots.',
    tech: ['Next.js', 'TipTap Editor', 'Supabase', 'OpenAI', 'Tailwind CSS']
  }
};

window.openCaseStudy = function(projectId) {
  const modal = document.getElementById('caseStudyModal');
  const container = document.getElementById('caseStudyContent');
  const data = CASE_STUDIES_DATA[projectId];

  if (!modal || !container || !data) return;

  container.innerHTML = `
    <div class="case-modal-header">
      <div class="case-modal-tag">${data.tag} • ${data.client}</div>
      <h3 class="case-modal-title">${data.title}</h3>
    </div>

    <div class="case-stats-row">
      ${data.stats.map(s => `
        <div class="case-stat-box">
          <div class="case-stat-num">${s.val}</div>
          <div class="case-stat-desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>

    <div class="case-section-block">
      <h4>📌 Overview</h4>
      <p>${data.overview}</p>
    </div>

    <div class="case-section-block">
      <h4>⚡ The Core Challenge</h4>
      <p>${data.challenge}</p>
    </div>

    <div class="case-section-block">
      <h4>💡 Architecture & Execution</h4>
      <p>${data.solution}</p>
    </div>

    <div class="case-section-block">
      <h4>🛠️ Tech Stack Employed</h4>
      <div class="case-tech-list">
        ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </div>

    <div class="case-modal-footer">
      <a href="#contact" class="btn btn-primary" onclick="closeAllModals(); document.getElementById('projectMessage').value = 'Hi Alex, I saw your case study on ${data.title.replace(/'/g, "")} and would like to build something similar...';">
        <span>Build a Project Like This</span>
        <span>→</span>
      </a>
      <button class="btn btn-glass btn-sm" onclick="closeAllModals()">Close Preview</button>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

// Modal Close Triggers
document.getElementById('closeCaseStudyBtn')?.addEventListener('click', closeAllModals);
document.getElementById('closeCalendlyBtn')?.addEventListener('click', closeAllModals);

document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeAllModals();
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach((m) => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   13. Booking Modal & Quick Package Selection
   -------------------------------------------------------------------------- */
window.openBookingModal = function(serviceName) {
  const serviceSelect = document.getElementById('serviceSelect');
  const projectMessage = document.getElementById('projectMessage');
  const contactSection = document.getElementById('contact');

  if (serviceSelect) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (projectMessage) {
    projectMessage.value = `Hi Alex, I am interested in inquiring about your "${serviceName}" service for my project...`;
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`Inquiring about: ${serviceName}`, '✨');
  }
};

window.selectPricingPlan = function(planName, price) {
  const serviceSelect = document.getElementById('serviceSelect');
  const projectMessage = document.getElementById('projectMessage');
  const contactSection = document.getElementById('contact');

  if (projectMessage) {
    projectMessage.value = `Hi Alex, I would like to proceed with the "${planName}" package (${price}). Here are my project requirements...`;
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`Selected Package: ${planName}`, '💎');
  }
};

window.openCalendlyMock = function() {
  const modal = document.getElementById('calendlyModal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

window.confirmTimeSlot = function(timeStr) {
  closeAllModals();
  showToast(`Meeting requested for ${timeStr}! Confirmation email dispatched.`, '📅');
};
