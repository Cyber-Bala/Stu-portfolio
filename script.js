/* ── Smooth scroll for nav links ── */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const navH = document.getElementById('main-nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
    const start = window.pageYOffset;
    const dist = top - start;
    const dur = 700; // ms — feel free to change
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / dur, 1);
        window.scrollTo(0, start + dist * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* Wire ALL nav / mobile-menu anchor links to smooth scroll */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            smoothScrollTo(href);
        });
    });
});


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
}

function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

/* Close on outside click */
document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
});

/* ── Button ripple + bounce ── */
function handleCTA(btn) {
    btn.style.transform = 'translate(3px,3px)';
    btn.style.boxShadow = '1px 1px 0 #18181b';
    const ripple = document.createElement('span');
    ripple.style.cssText =
        'position:absolute;border-radius:50%;background:rgba(255,255,255,0.4);' +
        'width:10px;height:10px;pointer-events:none;animation:rippleAnim 0.55s ease-out forwards;';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
        ripple.remove();
    }, 420);
}

/* Inject ripple keyframes */
const ks = document.createElement('style');
ks.textContent = `
  @keyframes rippleAnim {
    from { width:10px;height:10px;opacity:1;top:50%;left:50%;margin:-5px; }
    to   { width:200px;height:200px;opacity:0;top:50%;left:50%;margin:-100px; }
  }`;
document.head.appendChild(ks);

/* ── Floating chips hover ── */
document.querySelectorAll('.float-chip').forEach(c => {
    c.addEventListener('mouseenter', () => {
        c.style.animationPlayState = 'paused';
        c.style.transform = 'translateY(-18px) scale(1.18)';
    });
    c.addEventListener('mouseleave', () => {
        c.style.transform = '';
        c.style.animationPlayState = '';
    });
});

/* ── Skill pill pop on click ── */
document.querySelectorAll('.skill-pill').forEach(p => {
    p.addEventListener('click', () => {
        p.style.transform = 'scale(0.9)';
        setTimeout(() => { p.style.transform = ''; }, 200);
    });
});

/* ── Scroll-reveal with IntersectionObserver ── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Skill bar animation ── */
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-cat-card').forEach(card => barObserver.observe(card));

/* ── Contact form mock submit ── */
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-send');
    btn.textContent = '⏳ Sending…';
    btn.disabled = true;
    setTimeout(() => {
        document.getElementById('form-success').style.display = 'block';
        btn.textContent = '🚀 Send Message';
        btn.disabled = false;
        e.target.reset();
    }, 1200);
}
