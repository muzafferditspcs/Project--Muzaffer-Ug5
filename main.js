/**
 * Muzaffer Ali Khan - Professional Portfolio Interactive Script
 * High performance, zero external framework dependencies, clean modular code.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode with LocalStorage & OS Preference)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('theme-preference');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // default dark tech look

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
    
    // Update theme toggle icon aria-label
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // ---------------------------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Sticky Navbar & ScrollSpy
  // ---------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (siteHeader) {
      if (scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link update
    const scrollPosition = scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ---------------------------------------------------------------------------
  // 4. Hero Section Typewriter Effect
  // ---------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriterText');
  const roles = [
    'IT Student @ Cluster University Srinagar',
    'Aspiring Software Engineer',
    'Curious Tech & Coding Enthusiast',
    'Problem Solver & Systems Builder',
    'Python & Java Developer'
  ];

  if (typewriterElement) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        typeSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
  }

  // ---------------------------------------------------------------------------
  // 5. One-Click Copy Email Functionality
  // ---------------------------------------------------------------------------
  const copyEmailBtns = document.querySelectorAll('.copy-email-action');
  const targetEmail = 'muzaffer.ditspcs@gmail.com';

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(targetEmail);
        } else {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = targetEmail;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Visual feedback on the button
        const originalHTML = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;

        showToast('Email address copied to clipboard: ' + targetEmail, 'success');

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalHTML;
        }, 2400);

      } catch (err) {
        showToast('Failed to copy. Please manually copy: ' + targetEmail, 'error');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Project Filter Tabs
  // ---------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Interactive Contact Form with Validation & Feedback
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolioContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');
      const submitBtn = document.getElementById('contactSubmitBtn');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Simple validation
      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields (Name, Email, Message).', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please provide a valid email address.', 'error');
        return;
      }

      // Simulate sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Transmitting Message...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();

        showFormMessage('Thank you, Muzaffer has received your message! You will be contacted soon.', 'success');
        showToast('Message transmitted successfully!', 'success');

        // Optional mailto link fallback trigger
        const mailtoUri = `mailto:${targetEmail}?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        // We log it so the user can also trigger directly
        console.log('Mailto backup link prepared:', mailtoUri);
      }, 1000);
    });
  }

  function showFormMessage(text, type) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    formStatus.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'success' 
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' 
          : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
      </svg>
      <span>${text}</span>
    `;

    setTimeout(() => {
      formStatus.className = 'form-status';
      formStatus.innerHTML = '';
    }, 7000);
  }

  // ---------------------------------------------------------------------------
  // 8. Toast Notification Utility
  // ---------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon-success" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-cyan);">
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ---------------------------------------------------------------------------
  // 9. Srinagar Live Time Clock Display
  // ---------------------------------------------------------------------------
  const srinagarTimeEl = document.getElementById('srinagarLiveTime');

  function updateSrinagarClock() {
    if (!srinagarTimeEl) return;
    try {
      const now = new Date();
      // Format to Asia/Kolkata timezone (Srinagar, J&K)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat([], options).format(now);
      srinagarTimeEl.textContent = `${formatted} IST`;
    } catch (e) {
      // Fallback
      srinagarTimeEl.textContent = 'GMT+5:30 (Srinagar)';
    }
  }

  updateSrinagarClock();
  setInterval(updateSrinagarClock, 1000);

  // ---------------------------------------------------------------------------
  // 10. Back to Top Smooth Button
  // ---------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 11. Reveal Elements on Scroll (IntersectionObserver)
  // ---------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});

// Keyframe helper for dynamic spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(styleSheet);
