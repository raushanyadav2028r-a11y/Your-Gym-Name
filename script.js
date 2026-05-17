document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation & Scroll Highlighting
  const navbar = document.querySelector('.navbar');
  const navBurger = document.querySelector('.nav-burger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change Navbar Appearance on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNavLink();
  });

  // Mobile Menu Toggle
  if (navBurger) {
    navBurger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navBurger.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });
  }

  // Close Mobile Menu on NavLink click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = navBurger.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });

  // Dynamically highlight active link based on current page URL
  const currentPath = window.location.pathname;
  // Clear all active classes first on load
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Set initial active state based on URL if not on homepage
  if (!currentPath.endsWith('/') && !currentPath.endsWith('index.html') && currentPath.split('/').pop() !== '') {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && currentPath.includes(href)) {
        link.classList.add('active');
      }
    });
  }

  function highlightNavLink() {
    // Include both sections and the header hero
    const sections = document.querySelectorAll('section[id], header[id]');
    // Navbar height offset plus a little buffer
    const navHeight = navbar.offsetHeight || 80;
    let scrollPos = window.scrollY + navHeight + 50;

    // Only apply scroll highlighting on the homepage
    if (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath.split('/').pop() === '') {
      let currentSectionId = '';
      
      sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });
      
      if (currentSectionId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `index.html#${currentSectionId}` || href === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      } else if (window.scrollY < 50) {
        // Fallback for absolute top
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#home' || link.getAttribute('href') === 'index.html#home') {
            link.classList.add('active');
          }
        });
      }
    }
  }
  
  // Initial call to set correct state
  highlightNavLink();

  // 2. Equipment Gallery Tabs Filter (Static and subpages)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-page .gallery-item, .gallery-grid .gallery-item');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');

      const filter = btn.dataset.tab;

      galleryItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 3. Testimonials Slider/Carousel
  const testimonialTrack = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  const prevBtn = document.querySelector('.testimonial-ctrl-btn.prev');
  const nextBtn = document.querySelector('.testimonial-ctrl-btn.next');
  let currentSlide = 0;
  let autoPlayInterval;

  if (slides.length > 0) {
    // Dynamically create navigation dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function updateDots() {
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(n) {
      currentSlide = n;
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
      resetAutoPlay();
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      goToSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(currentSlide);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto Play Testimonials
    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();
  }

  // 4. Interactive Lightbox Gallery
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);

  const lightboxContent = document.createElement('div');
  lightboxContent.classList.add('lightbox-content');
  lightbox.appendChild(lightboxContent);

  const lightboxImg = document.createElement('img');
  lightboxContent.appendChild(lightboxImg);

  const lightboxClose = document.createElement('button');
  lightboxClose.classList.add('lightbox-close');
  lightboxClose.innerHTML = '&times;';
  lightbox.appendChild(lightboxClose);

  // Bind lightbox trigger to gallery images (excluding specific text items)
  const triggers = document.querySelectorAll('.gallery-item img, .about-story-img img, .collage-img img, .trainer-img-wrapper img');
  triggers.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // 5. Interactive BMI Calculator
  const bmiForm = document.getElementById('bmi-form');
  const bmiValEl = document.getElementById('bmi-val');
  const bmiStatusEl = document.getElementById('bmi-status');
  const bmiMessageEl = document.getElementById('bmi-message');

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const height = parseFloat(document.getElementById('bmi-height').value);
      const weight = parseFloat(document.getElementById('bmi-weight').value);
      const age = parseInt(document.getElementById('bmi-age').value);
      const gender = document.getElementById('bmi-gender').value;

      if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values!');
        return;
      }

      // Height from cm to meters
      const heightMeters = height / 100;
      const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

      bmiValEl.textContent = bmi;

      let status = '';
      let message = '';
      let color = '#ff522f'; // default accent orange

      if (bmi < 18.5) {
        status = 'Underweight';
        message = 'You should focus on muscle mass building with a clean caloric surplus diet and heavy strength training.';
        color = '#ffcc00'; // Amber yellow
      } else if (bmi >= 18.5 && bmi < 24.9) {
        status = 'Normal Weight';
        message = 'Superb fitness! Keep maintaining your strength level with consistent weight training and proper nutrition.';
        color = '#25D366'; // WhatsApp Green / Success Green
      } else if (bmi >= 25 && bmi < 29.9) {
        status = 'Overweight';
        message = 'Consider dynamic high-intensity weight training paired with clean caloric deficit diet to boost muscle & burn fat.';
        color = '#ff9900'; // Dark Orange
      } else {
        status = 'Obese';
        message = 'We highly recommend consulting our personal trainers for customized coaching, cardio conditioning, and detailed diet scheduling.';
        color = '#e63946'; // Vivid Red
      }

      bmiValEl.style.color = color;
      bmiStatusEl.textContent = status;
      bmiStatusEl.style.color = color;
      bmiMessageEl.textContent = message;
    });
  }

  // 6. Lead Inquiry Pop-ups (Exit Intent and CTA Modals)
  const modalOverlay = document.getElementById('inquiry-modal');
  const modalClose = document.querySelector('.modal-close-btn');
  const openModalBtns = document.querySelectorAll('.open-inquiry');
  const inquiryForm = document.getElementById('inquiry-form');

  // Open popup on trial button clicks
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  // Close Popup
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Form submission handler
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inq-name').value;
      const phone = document.getElementById('inq-phone').value;
      const packageSelected = document.getElementById('inq-package').value;

      if (!name || !phone) {
        alert('Please fill out all mandatory fields!');
        return;
      }

      // Format custom WhatsApp text
      const message = `Hello Your Gym Name Bodh Gaya! My name is ${name}. I am interested in booking a Free Trial session / joining the gym under the "${packageSelected}" plan. Please contact me back on my phone: ${phone}. Thank you!`;
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp Gym Contact Number (e.g. +91 9110091100 placeholder or real number)
      const whatsappUrl = `https://wa.me/910123456789?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Close modal
      modalOverlay.classList.remove('active');
      inquiryForm.reset();
    });
  }

  // Exit Intent Popup Trigger
  let exitIntentTriggered = false;
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !exitIntentTriggered) {
      exitIntentTriggered = true;
      if (modalOverlay) {
        // Change text in modal to exit intent deal
        const mTitle = modalOverlay.querySelector('.modal-title');
        const mSubtitle = modalOverlay.querySelector('.modal-subtitle');
        if (mTitle) mTitle.innerHTML = 'WAIT! DON\'T GO!';
        if (mSubtitle) mSubtitle.innerHTML = 'Claim your <span style="color:#ff522f; font-weight:bold;">1-DAY FREE TRIAL PASS</span> and kickstart your transformation at Bodh Gaya\'s #1 Premium Gym!';
        modalOverlay.classList.add('active');
      }
    }
  });

  // Contact Form Custom Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const subject = document.getElementById('contact-subject').value;
      const plan = document.getElementById('contact-plan').value;
      const msg = document.getElementById('contact-message').value;

      if (!name || !phone || !msg) {
        alert('Please enter your name, phone number, and message details!');
        return;
      }

      // WhatsApp text
      const messageText = `*Inquiry from Your Gym Name Website*\n\n*Name:* ${name}\n*Email:* ${email || 'N/A'}\n*Phone:* ${phone}\n*Subject:* ${subject}\n*Preferred Plan:* ${plan}\n*Message:* ${msg}`;
      const encodedText = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/910123456789?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
      contactForm.reset();
    });
  }

  // Floating WhatsApp widget custom click trigger
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    waFloat.addEventListener('click', (e) => {
      e.preventDefault();
      const text = encodeURIComponent('Hello! I visited your Your Gym Name website. I would like to inquire about gym membership details, timings, and personal trainer plans.');
      window.open(`https://wa.me/910123456789?text=${text}`, '_blank');
    });
  }

  // 7. Auto-Type Writer Effect for Fitness Dream Placeholder inside contact.html
  const dreamTextarea = document.getElementById('contact-message');
  if (dreamTextarea) {
    const fitnessDreams = [
      "I want to lose 15kg of stubborn fat and build extreme core strength...",
      "I want to sculpt a broad muscular chest and wide aesthetic back...",
      "I want to squat double my bodyweight under Rao Sahab's expert coaching...",
      "I want to achieve a single-digit body fat percentage and feel athletic...",
      "I want to join the morning 5:00 AM batch for hardcore heavy lifting...",
      "I want to train 5 days a week consistently and gain 8kg of lean muscle mass..."
    ];
    
    let dreamIndex = 0;
    let charIndex = 0;
    let currentDream = '';
    let isDeleting = false;
    let typeSpeed = 50; // crisp faster typing speed
    
    function typeWriterEffect() {
      const fullText = fitnessDreams[dreamIndex];
      
      if (isDeleting) {
        currentDream = fullText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 20; // swift deletion
      } else {
        currentDream = fullText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 50; // smooth typewriter flow
      }
      
      dreamTextarea.setAttribute('placeholder', currentDream);
      
      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        typeSpeed = 2500; // pause on full sentence so user can read the motivation!
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        dreamIndex = (dreamIndex + 1) % fitnessDreams.length;
        typeSpeed = 500; // brief pause before starting next sentence
      }
      
      setTimeout(typeWriterEffect, typeSpeed);
    }
    
    // Start typewriter effect after 1 second page load delay
    setTimeout(typeWriterEffect, 1000);
  }
});

