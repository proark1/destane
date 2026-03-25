/* ============================================
   DESTANE - Main JavaScript
   Shared interactivity for all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Sidebar Toggle (for dashboard pages) ----
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // ---- Mobile Nav Toggle (for public pages with top nav) ----
  const mobileMenuBtn = document.getElementById('mobile-nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.querySelector('.hamburger').classList.add('active');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('.hamburger').classList.remove('active');
      }
    });
  }

  // ---- Active nav link highlighting ----
  const currentPage = window.location.pathname.split('/').pop() || 'destane_landing_page.html';
  document.querySelectorAll('[data-page]').forEach(function (link) {
    if (link.dataset.page === currentPage) {
      link.classList.add('text-primary', 'font-bold');
      link.classList.remove('text-on-surface-variant/50', 'text-[#f5f5f5]/40');
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Close sidebar on window resize to desktop ----
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      closeSidebar();
    }
  });

  // ---- Progress bar animation on scroll ----
  const progressBars = document.querySelectorAll('[data-progress]');
  if (progressBars.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.progress;
          bar.style.width = width;
          bar.style.transition = 'width 0.8s ease-out';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(function (bar) {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

});
