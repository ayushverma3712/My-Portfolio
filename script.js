/* ==========================================================================
   AYUSH VERMA PORTFOLIO — Enhanced Script
   Features: Particle Network, Custom Cursor, Typewriter, Scroll Reveal,
             Glassmorphism Nav, 3D Card Tilt, Skill Bar Fix, Mobile Menu
   ========================================================================== */

/* ==========================================================================
   1. PARTICLE NETWORK BACKGROUND (replaces matrix rain)
   ========================================================================== */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 80;
const MAX_DIST = 130;
let mouse = { x: -9999, y: -9999 };

// Configurable colours — swapped on theme toggle
const particleConfig = {
    dotColor:  'rgba(0,255,65,0.7)',
    lineColor: '125,133,245'
};

const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1
}));

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            p.vx += dx / dist * 0.3;
            p.vy += dy / dist * 0.3;
        }
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx *= 0.95; p.vy *= 0.95; }
        if (speed < 0.1) { p.vx += (Math.random() - 0.5) * 0.05; p.vy += (Math.random() - 0.5) * 0.05; }

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleConfig.dotColor;
        ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                const alpha = (1 - dist / MAX_DIST) * 0.4;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${particleConfig.lineColor},${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

/* ==========================================================================
   2. CUSTOM GLOWING CURSOR
   ========================================================================== */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
});

// Ring follows with smooth lerp
function animateCursor() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;

    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverTargets = 'a, button, .project-card, .view-project-btn, .submit-cmd, .download-btn-tech, .mode-pill, .nav-link, .hamburger';
document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});
document.addEventListener('mousedown', () => ring.classList.add('clicked'));
document.addEventListener('mouseup', () => ring.classList.remove('clicked'));

/* ==========================================================================
   3. TYPEWRITER ROLE TITLES
   ========================================================================== */
const roles = [
    'Cloud Architect',
    'Security Researcher',
    'C++ Developer',
    'AI Enthusiast',
    'Network Engineer'
];
const roleEl = document.getElementById('role-type');
let rIdx = 0, charIdx = 0, isDeleting = false;

function typeRole() {
    const current = roles[rIdx];
    if (isDeleting) {
        charIdx--;
        roleEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
            isDeleting = false;
            rIdx = (rIdx + 1) % roles.length;
            setTimeout(typeRole, 400);
            return;
        }
        setTimeout(typeRole, 60);
    } else {
        charIdx++;
        roleEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
            isDeleting = true;
            setTimeout(typeRole, 1800);
            return;
        }
        setTimeout(typeRole, 100);
    }
}

/* ==========================================================================
   4. TERMINAL TYPING (hero terminal box)
   ========================================================================== */
const terminalContent = [
    '> scanning system...',
    '> user: Ayush Verma',
    '> status: Year 3 B.Tech CSE',
    '> loc: Dehradun, IND',
    '> stack: [C++, SQL, AI]',
    '> _ --- _'
];
const terminal = document.getElementById('tech-terminal');
let lineIndex = 0;
function typeTerminal() {
    if (lineIndex < terminalContent.length) {
        const line = document.createElement('p');
        line.style.marginBottom = '5px';
        line.textContent = terminalContent[lineIndex];
        terminal.appendChild(line);
        lineIndex++;
        setTimeout(typeTerminal, 800);
    }
}

/* ==========================================================================
   5. SCROLL REVEAL — IntersectionObserver
   ========================================================================== */
function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    // Add data-reveal to all content sections and project cards
    document.querySelectorAll('.content-section, .about-container, .skills-main-container, .project-grid, .resume-container, .contact-terminal').forEach(el => {
        el.setAttribute('data-reveal', '');
        revealObserver.observe(el);
    });

    // Stagger project cards individually
    document.querySelectorAll('.project-card').forEach((card, i) => {
        card.setAttribute('data-reveal', '');
        card.style.transitionDelay = (i * 0.12) + 's';
        revealObserver.observe(card);
    });
}

/* ==========================================================================
   6. SKILLS PROGRESS BARS — Fixed selector + scroll trigger
   ========================================================================== */
const skillSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // FIX: was '.progress', correct class is '.progress-fill'
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.dataset.percent + '%';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillObserver.observe(skillSection);

/* ==========================================================================
   7. GLASSMORPHISM NAVBAR — scroll state
   ========================================================================== */
const mainContent = document.querySelector('.main-content');
const topNav = document.querySelector('.top-nav');

mainContent.addEventListener('scroll', () => {
    // Scrolled class for glass glow
    if (mainContent.scrollTop > 20) {
        topNav.classList.add('scrolled');
    } else {
        topNav.classList.remove('scrolled');
    }

    // Active sidebar link highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        if (mainContent.scrollTop >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

/* ==========================================================================
   8. MOBILE HAMBURGER MENU
   ========================================================================== */
const hamburger = document.getElementById('hamburger-btn');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebar-overlay');

function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent bg scroll
}
function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeMenu() : openMenu();
});
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeMenu();
    });
});

/* ==========================================================================
   9. 3D CARD TILT EFFECT
   ========================================================================== */
document.querySelectorAll('.project-card').forEach(card => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / (rect.height / 2)) * -7;
        const ry = ((e.clientX - cx) / (rect.width / 2)) * 7;

        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = 'transform 0.1s ease, border-color 0.4s, box-shadow 0.4s';

        // Move glow to cursor position
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(125,133,245,0.18), transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.transition = 'transform 0.5s ease, border-color 0.4s, box-shadow 0.4s';
    });
});

/* ==========================================================================
   10. THEME TOGGLE — with particle colour swap
   ========================================================================== */
function toggleTheme() {
    const body = document.body;
    const nameText = document.querySelector('.glitch-target');
    const btn = document.querySelector('.mode-pill');

    nameText.classList.add('glitch-active');
    body.classList.toggle('light-mode');

    const isLight = body.classList.contains('light-mode');
    btn.innerHTML = isLight ? '🌙 Dark' : '☀️ Day';

    // Swap particle colours to match the active theme
    particleConfig.dotColor   = isLight ? 'rgba(79,70,229,0.6)'  : 'rgba(0,255,65,0.7)';
    particleConfig.lineColor  = isLight ? '79,70,229'            : '125,133,245';

    setTimeout(() => nameText.classList.remove('glitch-active'), 400);
}

/* ==========================================================================
   11. CONTACT FORM
   ========================================================================== */
const contactForm = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formStatus.style.color = '#7d85f5';
    formStatus.textContent = '> Encrypting message...';
    setTimeout(() => {
        formStatus.textContent = '> Sending to Ayush Verma...';
        setTimeout(() => {
            formStatus.style.color = '#00ff41';
            formStatus.textContent = '> SUCCESS: Message transmitted to Ayush Verma. _';
            contactForm.reset();
        }, 1500);
    }, 1000);
});

/* ==========================================================================
   12. PROJECT MODAL
   ========================================================================== */
const projectData = {
    'Deadlock Detection': {
        subject: 'Operating Systems',
        details: 'Analyzed Deadlock Detection and Prevention strategies. Implemented Banker\'s Algorithm logic to manage resources safely in a C++ environment. Visualized resource allocation using Wait-for-Graph (WFG) analysis.',
        github: 'https://github.com/ayushverma3712'
    },
    'Transaction Management': {
        subject: 'DBMS',
        details: 'Focus on Transaction Control (Commit, Savepoint, Rollback). Ensured ACID properties through secure SQL query structures. Built for complex multi-step database operations.',
        github: 'https://github.com/ayushverma3712'
    },
    'AI Imaginarium': {
        subject: 'Generative AI',
        details: 'Exploration of high-fidelity image and video generation using advanced prompt engineering. Focus on ethical AI and secure digital creative solutions using Nano Banana & Veo engines.',
        github: 'https://github.com/ayushverma3712'
    }
};

let typingTimer;
function openReport(projectName) {
    const modal = document.getElementById('project-modal');
    const textContent = document.getElementById('modal-text-content');
    const gitLink = document.getElementById('github-link');
    const data = projectData[projectName];
    if (!data) return;

    modal.style.display = 'flex';
    gitLink.href = data.github;
    textContent.innerHTML = '';
    clearTimeout(typingTimer);

    const fullText = `> ACCESSING: ${projectName}.sys\n> CATEGORY: ${data.subject}\n\n> REPORT: ${data.details}`;
    let i = 0;
    function typeWriter() {
        if (i < fullText.length) {
            textContent.innerHTML += fullText.charAt(i) === '\n' ? '<br>' : fullText.charAt(i);
            i++;
            typingTimer = setTimeout(typeWriter, 18);
        }
    }
    typeWriter();
}

function closeReport() {
    document.getElementById('project-modal').style.display = 'none';
    clearTimeout(typingTimer);
}

window.addEventListener('click', e => {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) closeReport();
});

/* ==========================================================================
   13. RESUME DOWNLOAD SEQUENCE
   ========================================================================== */
function triggerDownloadSequence(e) {
    const btn = e.currentTarget;
    const originalText = btn.querySelector('.btn-text').textContent;
    e.preventDefault();
    btn.querySelector('.btn-text').textContent = '> DECRYPTING...';
    btn.style.borderColor = '#7d85f5';
    setTimeout(() => {
        btn.querySelector('.btn-text').textContent = '> EXTRACTING...';
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = '> COMPLETE.';
            btn.style.borderColor = '#00ff41';
            window.location.href = btn.getAttribute('href');
            setTimeout(() => { btn.querySelector('.btn-text').textContent = originalText; }, 2000);
        }, 1000);
    }, 1000);
}

/* ==========================================================================
   14. PRELOADER
   ========================================================================== */
const bootMessages = [
    '> Loading kernel modules...',
    '> Establishing secure connection...',
    '> Accessing database...',
    '> Decrypting projects...',
    '> Optimizing UI...',
    '> SYSTEM READY.'
];

function startLoader() {
    let progress = 0;
    const bar = document.getElementById('loader-progress-bar');
    const pct = document.getElementById('loader-pct');
    const text = document.getElementById('loader-text');
    const wrapper = document.getElementById('loader-wrapper');

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                wrapper.style.opacity = '0';
                wrapper.style.visibility = 'hidden';
                document.body.classList.add('loaded');
                // Start animations after load
                typeTerminal();
                typeRole();
                initScrollReveal();
            }, 500);
        }
        bar.style.width = progress + '%';
        pct.textContent = progress + '%';
        const msgIndex = Math.floor((progress / 100) * (bootMessages.length - 1));
        text.textContent = bootMessages[msgIndex];
    }, 150);
}

document.addEventListener('DOMContentLoaded', startLoader);
