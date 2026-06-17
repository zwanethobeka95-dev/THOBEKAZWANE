// Thobeka Zwane Web Platform Logic

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCheckout();
  initFAQ();
  initCalendar();
  initPersonalization();
});

/* ==========================================
   1. MOBILE NAVBAR
   ========================================== */
function initNavbar() {
  const burgerMenu = document.getElementById('burger-menu');
  const navLinks = document.getElementById('nav-links');

  if (burgerMenu && navLinks) {
    burgerMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Animate burger menu lines
      const spans = burgerMenu.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
}

/* ==========================================
   2. SIMULATED CHECKOUT FLOW
   ========================================== */
function initCheckout() {
  const triggers = document.querySelectorAll('.checkout-trigger');
  const overlay = document.getElementById('checkout-modal-overlay');
  const closeBtn = document.getElementById('close-checkout-modal');
  const checkoutForm = document.getElementById('checkout-form');
  const formContainer = document.getElementById('checkout-form-container');
  const loadingState = document.getElementById('checkout-loading-state');
  const progressBar = document.getElementById('checkout-progress-bar');
  const loadingHeading = document.getElementById('loading-heading');

  const selectedName = document.getElementById('selected-tier-name');
  const selectedPrice = document.getElementById('selected-tier-price');

  let activeTier = '';

  if (triggers.length > 0 && overlay) {
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const tierName = trigger.getAttribute('data-name');
        const tierPrice = trigger.getAttribute('data-price');
        activeTier = trigger.getAttribute('data-tier');

        if (selectedName && selectedPrice) {
          selectedName.textContent = tierName;
          selectedPrice.textContent = tierPrice;
        }

        // Show modal
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
      });
    });
  }

  // Close modal logic
  const closeModal = () => {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Release scroll
      
      // Reset form and state after modal transition finishes
      setTimeout(() => {
        if (formContainer && loadingState && checkoutForm) {
          formContainer.style.display = 'block';
          loadingState.style.display = 'none';
          checkoutForm.reset();
          if (progressBar) progressBar.style.width = '0%';
        }
      }, 300);
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  // Form submit (Simulate e-commerce checkout)
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('checkout-email').value;
      if (!emailInput) return;

      // Switch to loading state
      if (formContainer && loadingState) {
        formContainer.style.display = 'none';
        loadingState.style.display = 'block';
      }

      // Simulate payment processing progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }

        if (progress >= 40 && progress < 80) {
          if (loadingHeading) loadingHeading.textContent = 'Verifying Account Credentials...';
        } else if (progress >= 80) {
          if (loadingHeading) loadingHeading.textContent = 'Finalizing Enrollment Setup...';
        }

        if (progress >= 100) {
          clearInterval(interval);
          // Redirect to onboarding page with query params
          window.location.href = `onboarding.html?tier=${activeTier}&email=${encodeURIComponent(emailInput)}`;
        }
      }, 80); // 80ms * 25 steps = ~2 seconds
    });
  }
}

/* ==========================================
   3. INTERACTIVE FAQ ACCORDION
   ========================================== */
function initFAQ() {
  const faqHeaders = document.querySelectorAll('.accordion-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================
   4. DYNAMIC LIVE CALENDAR
   ========================================== */
function initCalendar() {
  const monthYearLabel = document.getElementById('calendar-month-year');
  const daysContainer = document.getElementById('calendar-days-container');
  const prevBtn = document.getElementById('calendar-prev-month');
  const nextBtn = document.getElementById('calendar-next-month');

  // Elements for details panel
  const detailsTitle = document.getElementById('session-title-display');
  const detailsTime = document.getElementById('session-time-display');
  const detailsDesc = document.getElementById('session-description-display');
  const detailsZoom = document.getElementById('session-zoom-button');
  const detailsBox = document.getElementById('session-details-box');

  if (!daysContainer) return;

  // Let's set a fixed starting month for the cohort kickoff (June 2026)
  let currentYear = 2026;
  let currentMonth = 5; // 0-indexed (June is 5)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Specific highlighted session days for June 2026
  const liveSessions = {
    "2026-5-9": {
      title: "Cohort Kickoff & AI Environment Settings",
      time: "Tuesday, June 9, 2026 at 6:00 PM (GMT+2)",
      desc: "Meet the cohort. Set up Cursor IDE, configure API endpoints, configure custom LLM developer instructions, and align team goals.",
      zoom: "https://zoom.us/j/mock-meeting-id-kickoff"
    },
    "2026-5-16": {
      title: "Academic Syllabus Context-Mapping",
      time: "Tuesday, June 16, 2026 at 6:00 PM (GMT+2)",
      desc: "Learn how to convert curriculum syllabus plans and dense PDFs into smart flashcard decks and prompt maps using Claude projects.",
      zoom: "https://zoom.us/j/mock-meeting-id-curriculum"
    },
    "2026-5-23": {
      title: "Vercel v0 Layout & Design Generation",
      time: "Tuesday, June 23, 2026 at 6:00 PM (GMT+2)",
      desc: "Prompt UI components directly. Learn how to draft beautiful, production-ready React / HTML blocks and style parameters.",
      zoom: "https://zoom.us/j/mock-meeting-id-v0layout"
    },
    "2026-5-30": {
      title: "Portfolio Pipeline & GitHub Publishing",
      time: "Tuesday, June 30, 2026 at 6:00 PM (GMT+2)",
      desc: "Final module deployment. Version-control your student portfolio, link custom subdomains, and finalize live review assets.",
      zoom: "https://zoom.us/j/mock-meeting-id-deploy"
    }
  };

  function renderCalendar(year, month) {
    if (monthYearLabel) {
      monthYearLabel.textContent = `${monthNames[month]} ${year}`;
    }

    daysContainer.innerHTML = '';

    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Total days in the month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill in empty slots for previous month offset
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day empty';
      emptyDiv.style.opacity = '0.3';
      daysContainer.appendChild(emptyDiv);
    }

    // Fill in days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      
      const numSpan = document.createElement('span');
      numSpan.className = 'calendar-day-num';
      numSpan.textContent = day;
      
      // Highlight "Today" (Assuming mock today is June 9, 2026)
      if (year === 2026 && month === 5 && day === 9) {
        numSpan.classList.add('today');
      }

      dayDiv.appendChild(numSpan);

      // Check if this date has a live cohort session
      const dateKey = `${year}-${month}-${day}`;
      if (liveSessions[dateKey]) {
        dayDiv.classList.add('active-session');
        
        // Add click listener to display details
        dayDiv.addEventListener('click', () => {
          showSessionDetails(liveSessions[dateKey]);
          
          // Visual selection indicator
          document.querySelectorAll('.calendar-day').forEach(d => {
            d.style.borderColor = 'var(--border-color)';
          });
          dayDiv.style.borderColor = 'var(--accent)';
        });
      }

      daysContainer.appendChild(dayDiv);
    }
  }

  function showSessionDetails(session) {
    if (detailsBox && detailsTitle && detailsTime && detailsDesc && detailsZoom) {
      detailsTitle.textContent = session.title;
      detailsTime.textContent = `Time: ${session.time}`;
      detailsDesc.textContent = session.desc;
      detailsZoom.setAttribute('href', session.zoom);
      
      // Smooth fade transition
      detailsBox.style.opacity = '0';
      setTimeout(() => {
        detailsBox.style.opacity = '1';
      }, 100);
    }
  }

  // Event Listeners for Navigating Month
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentYear, currentMonth);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentYear, currentMonth);
    });
  }

  // Initial Calendar Load
  renderCalendar(currentYear, currentMonth);
}

/* ==========================================
   5. PERSONALIZATION LOGIC (ONBOARDING)
   ========================================== */
function initPersonalization() {
  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeMsg = document.getElementById('welcome-message');

  if (!welcomeTitle || !welcomeMsg) return;

  // Read URL Query Parameters
  const params = new URLSearchParams(window.location.search);
  const tier = params.get('tier');
  const email = params.get('email');

  const greetingEmail = email ? ` (${decodeURIComponent(email)})` : '';

  if (tier === 'high-school') {
    welcomeTitle.textContent = "Welcome to High School Foundations!";
    welcomeMsg.innerHTML = `
      Hi there${greetingEmail}! You've successfully secured your seat. We are excited to help you master your curriculum subjects, study efficiently, and build amazing things using AI tools. Keep an eye on your calendar.
    `;
  } else if (tier === 'university') {
    welcomeTitle.textContent = "Welcome to University Undergrad Elite!";
    welcomeMsg.innerHTML = `
      Welcome onboard${greetingEmail}! You're registered for the Elite cohort. We're going to dive into advanced varsity modules, workflow acceleration, and practical code projects. Let's maximize your study potential.
    `;
  } else if (tier === 'career') {
    welcomeTitle.textContent = "Welcome to Career Switcher / Adult!";
    welcomeMsg.innerHTML = `
      Hello and welcome${greetingEmail}! Your registration is active. We are dedicated to helping you construct a practical web design portfolio and pivot your professional workflow using state-of-the-art AI.
    `;
  } else {
    // Default greeting if page is accessed directly
    welcomeTitle.textContent = "Welcome to Thobeka Zwane Cohorts!";
    welcomeMsg.textContent = "We are glad to have you in our student dashboard. Below you will find onboarding links, FAQs, and live class times.";
  }
}
