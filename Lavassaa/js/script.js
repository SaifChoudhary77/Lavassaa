/* ============================================
   LAVASSAA RESTAURANT SAHARANPUR
   Multi-Cuisine Vegetarian Restaurant
   Vanilla JavaScript Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ==========================================
  // PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    }, 800);
  });

  // ==========================================
  // SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
  });

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // MOBILE MENU
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', openMobileMenu);
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // ACTIVE NAVIGATION LINK
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active', 'text-brand-gold');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active', 'text-brand-gold');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ==========================================
  // REUSABLE CAROUSEL SYSTEM
  // ==========================================
  function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId + '-carousel');
    if (!carousel) return;

    const track = document.getElementById(carouselId + '-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const pagination = document.getElementById(carouselId + '-pagination');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = 1;
    let autoPlayInterval = null;
    let isDragging = false;
    let startPos = 0;

    function getSlidesPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function updateSlidesPerView() {
      slidesPerView = getSlidesPerView();
      goToSlide(currentIndex);
      updatePagination();
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - slidesPerView);
    }

    function goToSlide(index) {
      const maxIndex = getMaxIndex();
      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;
      currentIndex = index;
      const slideWidth = 100 / slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      updatePagination();
    }

    function updatePagination() {
      if (!pagination) return;
      pagination.innerHTML = '';
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-brand-gold w-6' : 'bg-white/30 hover:bg-white/50'}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        pagination.appendChild(dot);
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoPlay(); });

    // Touch / Swipe support
    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startPos = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentPos = e.touches[0].clientX;
      const diff = startPos - currentPos;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        isDragging = false;
      }
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
      startAutoPlay();
    });

    // Mouse drag support
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startPos = e.clientX;
      stopAutoPlay();
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const currentPos = e.clientX;
      const diff = startPos - currentPos;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        isDragging = false;
      }
    });

    track.addEventListener('mouseup', () => {
      isDragging = false;
      startAutoPlay();
    });

    track.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        startAutoPlay();
      }
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); stopAutoPlay(); }
      if (e.key === 'ArrowRight') { nextSlide(); stopAutoPlay(); }
    });

    window.addEventListener('resize', updateSlidesPerView);

    updateSlidesPerView();
    startAutoPlay();
  }

  // Initialize carousels
  initCarousel('dishes');
  initCarousel('testimonials');

  // ==========================================
  // INTERSECTION OBSERVER - SCROLL ANIMATIONS
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================
  // FAQ ACCORDION
  // ==========================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').classList.add('hidden');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.classList.remove('hidden');
      }
    });
  });

  // ==========================================
  // LIGHTBOX GALLERY
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let galleryImages = [];
  let currentLightboxIndex = 0;

  window.openLightbox = function(element) {
    const img = element.querySelector('img');
    if (!img) return;

    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    currentLightboxIndex = galleryImages.indexOf(img);

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  };

  window.nextLightbox = function() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLightboxIndex].src;
    lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
  };

  window.prevLightbox = function() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLightboxIndex].src;
    lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
  };

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.remove('translate-y-20', 'opacity-0');
    } else {
      backToTop.classList.add('translate-y-20', 'opacity-0');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // STICKY MOBILE CTA
  // ==========================================
  const stickyMobileCTA = document.getElementById('sticky-mobile-cta');

  window.addEventListener('scroll', () => {
    if (window.innerWidth < 1024 && window.scrollY > 300) {
      stickyMobileCTA.classList.remove('translate-y-full');
    } else {
      stickyMobileCTA.classList.add('translate-y-full');
    }
  });

}); // End DOMContentLoaded