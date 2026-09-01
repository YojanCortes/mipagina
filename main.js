/**
 * Yojann Cortés Díaz - Ingeniero Informático
 * Main Interactive Logic & Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbar();
  initMetricsCounter();
  initCalculator();
  initPortfolio();
  initContactForm();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle Canvas Background
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#7f00ff';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

      // Mouse collision / repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Navbar, Mobile Menu & Smooth Scroll Active Spy
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section highlighting on single-page navigation
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach((link) => {
            if (link.getAttribute('href')?.startsWith('#')) {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              }
            }
          });
        }
      });
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   3. Animated Metrics Counters
   -------------------------------------------------------------------------- */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const increment = target / 30;

            const updateCount = () => {
              count += increment;
              if (count < target) {
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 40);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) {
    observer.observe(heroMetrics);
  }
}

/* --------------------------------------------------------------------------
   4. Interactive Project Budget Estimator (Cotizador)
   -------------------------------------------------------------------------- */
function initCalculator() {
  const projectRadios = document.querySelectorAll('input[name="project_type"]');
  const moduleCheckboxes = document.querySelectorAll('input[name="module"]');
  const speedRadios = document.querySelectorAll('input[name="speed"]');

  const totalPriceEl = document.getElementById('calcTotalPrice');
  const deliveryTimeEl = document.getElementById('calcDeliveryTime');
  const breakdownEl = document.getElementById('calcBreakdown');
  const btnSendWhatsapp = document.getElementById('btnSendQuoteWhatsapp');
  const btnCopy = document.getElementById('btnCopyQuote');

  const typeLabels = {
    landing: 'Landing Page / Web Comercial',
    webapp: 'Plataforma Web / SaaS',
    ecommerce: 'Tienda Online / E-Commerce',
    mobile: 'App Móvil (iOS / Android)'
  };

  const moduleLabels = {
    auth: 'Autenticación & Roles',
    payments: 'Pasarela de Pagos Online',
    admin: 'Panel de Administración',
    seo_opt: 'SEO Técnico & Velocidad 99+',
    ai_integration: 'Integración Inteligencia Artificial',
    multilang: 'Soporte Multilenguaje'
  };

  function updateCalculation() {
    let basePrice = 0;
    let selectedType = '';
    let estimatedTime = '';

    // Step 1: Project Type
    projectRadios.forEach((radio) => {
      const parentLabel = radio.closest('.calc-radio-card');
      if (radio.checked) {
        parentLabel.classList.add('active');
        basePrice = parseFloat(radio.getAttribute('data-base-price'));
        selectedType = radio.value;
        estimatedTime = radio.getAttribute('data-time');
      } else {
        parentLabel.classList.remove('active');
      }
    });

    // Step 2: Modules
    let modulesPrice = 0;
    const selectedModules = [];

    moduleCheckboxes.forEach((chk) => {
      const parentLabel = chk.closest('.calc-checkbox-card');
      if (chk.checked) {
        parentLabel.classList.add('checked');
        const price = parseFloat(chk.getAttribute('data-price'));
        modulesPrice += price;
        selectedModules.push({ id: chk.value, price });
      } else {
        parentLabel.classList.remove('checked');
      }
    });

    // Step 3: Urgency multiplier
    let multiplier = 1.0;
    let speedType = 'standard';

    speedRadios.forEach((radio) => {
      const parentLabel = radio.closest('.speed-radio');
      if (radio.checked) {
        parentLabel.classList.add('active');
        multiplier = parseFloat(radio.getAttribute('data-multiplier'));
        speedType = radio.value;
      } else {
        parentLabel.classList.remove('active');
      }
    });

    const subtotal = basePrice + modulesPrice;
    const total = Math.round(subtotal * multiplier);

    // Update UI Price
    if (totalPriceEl) {
      totalPriceEl.innerHTML = `$${total} <small>USD</small>`;
    }

    if (deliveryTimeEl) {
      const isExpress = speedType === 'express';
      deliveryTimeEl.innerHTML = `<i class="fa-regular fa-clock"></i> Tiempo estimado: <strong>${estimatedTime}</strong> ${
        isExpress ? '<span style="color:var(--primary);">(Prioritario 🚀)</span>' : ''
      }`;
    }

    // Update Breakdown
    if (breakdownEl) {
      let html = `
        <div class="breakdown-item">
          <span>${typeLabels[selectedType] || 'Base'}</span>
          <span>$${basePrice} USD</span>
        </div>
      `;

      selectedModules.forEach((mod) => {
        html += `
          <div class="breakdown-item">
            <span>+ ${moduleLabels[mod.id] || mod.id}</span>
            <span>$${mod.price} USD</span>
          </div>
        `;
      });

      if (multiplier > 1.0) {
        html += `
          <div class="breakdown-item" style="color:var(--primary)">
            <span>+ Entrega Express Prioritaria</span>
            <span>+25%</span>
          </div>
        `;
      }

      breakdownEl.innerHTML = html;
    }

    // Prepare WhatsApp Quotation Message
    const modulesText = selectedModules.map((m) => `• ${moduleLabels[m.id]}`).join('%0A');
    const waMessage = `Hola Yojann! He calculado un presupuesto en tu sitio web:%0A%0A` +
      `📌 *Tipo de Proyecto:* ${typeLabels[selectedType]}%0A` +
      `⚙️ *Módulos seleccionados:*%0A${modulesText ? modulesText : '• Ninguno adicional'}%0A` +
      `⚡ *Plazo:* ${speedType === 'express' ? 'Express Prioritario' : 'Estándar'} (${estimatedTime})%0A` +
      `💰 *Presupuesto Estimado:* $${total} USD%0A%0A` +
      `¿Podemos coordinar una llamada o detalles para comenzar?`;

    if (btnSendWhatsapp) {
      btnSendWhatsapp.onclick = () => {
        window.open(`https://wa.me/56986635815?text=${waMessage}`, '_blank');
      };
    }

    if (btnCopy) {
      btnCopy.onclick = () => {
        const plainText = `Cotización para Yojann Cortés Díaz (Ingeniero Informático):\n` +
          `- Proyecto: ${typeLabels[selectedType]}\n` +
          `- Módulos: ${selectedModules.map((m) => moduleLabels[m.id]).join(', ') || 'Básicos'}\n` +
          `- Tiempo estimado: ${estimatedTime}\n` +
          `- Total estimado: $${total} USD`;

        navigator.clipboard.writeText(plainText).then(() => {
          showToast('¡Resumen de cotización copiado al portapapeles!');
        });
      };
    }
  }

  // Bind change listeners
  projectRadios.forEach((r) => r.addEventListener('change', updateCalculation));
  moduleCheckboxes.forEach((c) => c.addEventListener('change', updateCalculation));
  speedRadios.forEach((s) => s.addEventListener('change', updateCalculation));

  // Initial call
  updateCalculation();
}

/* --------------------------------------------------------------------------
   5. Portfolio Filtering & Interactive Modal
   -------------------------------------------------------------------------- */
function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalCloseBtn');
  const viewBtns = document.querySelectorAll('.view-project-btn');

  // Project Details Database - Real Projects & Experience
  const projectDatabase = {
    1: {
      title: 'MappsCotas / MascotaJan — App Móvil de Mascotas con IA',
      category: 'App Móvil iOS / Android & IA',
      img: 'Proyectos/mappscotas/inicio.jfif',
      description:
        'Aplicación móvil publicada en Google Play Store orientada a crear una comunidad para dueños de mascotas en Chile y Latinoamérica. Integra escaneo inteligente de ingredientes de alimentos con IA, mapa colaborativo de veterinarias y lugares pet-friendly, y sistema de reporte y búsqueda de mascotas extraviadas.',
      metrics: [
        '🚀 Disponible en Google Play Store',
        '🤖 Escaneo y análisis de ingredientes con IA',
        '📍 Mapa geolocalizado en vivo con Google Maps',
        '📱 Diseñada en Flutter con soporte Android e iOS'
      ],
      stack: ['Flutter', 'Dart', 'Firebase / Cloud Firestore', 'Google Maps API', 'Inteligencia Artificial', 'Google Play Console'],
      architecture:
        'Arquitectura en Flutter con State Management reactivo, backend en Firebase Firestore con reglas de seguridad granulares, integración de visión por computador para reconocimiento de etiquetas nutricionales y sincronización en la nube en tiempo real.'
    },
    2: {
      title: 'FoodJan — Sistema Integral para Restaurantes, Comandas & POS',
      category: 'SaaS Gastronómico / Web & Móvil',
      img: 'Proyectos/foodjan/paginaweb.jfif',
      description:
        'Plataforma completa compuesta por panel web administrativo y aplicación móvil para agilizar la operación de restaurantes: comanderos para garzones, pantalla interactiva para cocina (KDS), menú digital, inventario y módulo de contabilidad.',
      metrics: [
        '⏱️ Reducción del 50% en tiempos de atención',
        '🧾 Emisión de comandas e impresión térmica física',
        '📦 Control de inventario y recetas en tiempo real',
        '💰 Módulo contable de ventas diarias y márgenes'
      ],
      stack: ['Django', 'Python', 'Flutter', 'MySQL / MariaDB', 'Impresión Térmica ESC/POS', 'Bootstrap 5', 'REST API'],
      architecture:
        'Backend robusto en Django REST framework con endpoints de alta velocidad para la toma de comandas, integración con impresoras térmicas Bluetooth/USB para tickets de comanda y cocina, y panel de administración interactivo.'
    },
    3: {
      title: 'Plataforma de Venta de Pasajes de Buses con Webpay Transbank',
      category: 'E-Commerce & Gestión de Transporte',
      img: 'Proyectos/pagina_buses/menupasjaeros.PNG',
      description:
        'Sistema web completo de venta de pasajes interurbanos. Permite a los usuarios seleccionar origen/destino, ver disponibilidad de asientos, bloquear temporalmente asientos durante el checkout, pagar de forma segura con Webpay Plus (Transbank) y recibir boletos con código QR.',
      metrics: [
        '💳 Integración oficial Webpay Plus (Transbank)',
        '🔒 Bloqueo transaccional de asientos en tiempo real',
        '🎟️ Emisión de boletos con código QR y validación',
        '📊 Panel para choferes y administración de rutas'
      ],
      stack: ['Django', 'Python', 'Transbank Webpay Plus', 'MySQL / MariaDB', 'JavaScript', 'Bootstrap 5', 'HTML5/CSS3'],
      architecture:
        'Manejo de transacciones atómicas y bloqueos en base de datos para evitar doble compra de asientos, webhook seguro para confirmación de pagos de Transbank y generación dinámica de vouchers en PDF y vista web.'
    },
    4: {
      title: 'STOCKJAN — Gestión Industrial con Asistente IA (Empresas Torre)',
      category: 'SaaS Industrial / IoT & IA',
      img: 'Proyectos/sistema gestion empresas torre/pagina.jfif',
      description:
        'Desarrollada e implementada en planta de manufactura de Productos Torre S.A. Solución integral que conecta maquinaria automatizada y sensores IoT con una app móvil y dashboard web, integrando un asistente tipo ChatGPT conectado a la base de datos de la empresa para consultas inteligentes.',
      metrics: [
        '🏭 Operativa en planta de producción industrial',
        '🤖 Chatbot NLP conectado a base de datos de productos',
        '📶 Lectura de sensores IoT y brazos robóticos',
        '📋 Registro de asistencia y KPIs de producción'
      ],
      stack: ['Python', 'Chatbot NLP / IA', 'Sensores IoT', 'SQL Database', 'Lector Código de Barras', 'Excel Automation'],
      architecture:
        'Integración con la red de sensores IoT de la planta, microservicio de procesamiento de lenguaje natural (NLP) para consultas sobre stock y estado de líneas de producción, y dashboard ejecutivo de KPIs.'
    },
    5: {
      title: 'Sistema de Bodega, Inventario y Comedor Escolar (EdTech)',
      category: 'Gestión Institucional & Bodega',
      img: 'Proyectos/sistema bodega escuela/menu.jfif',
      description:
        'Software de control de ingreso al comedor y gestión de bodega escolar. Permite check-in express mediante códigos QR, control diario de raciones por cursos y turnos, préstamos y devoluciones de materiales y exportación de reportes a CSV/Excel.',
      metrics: [
        '⚡ Check-in ultra rápido con código QR/código',
        '📈 Tablero diario en vivo por turnos y cursos',
        '📦 Control estricto de entradas/salidas de bodega',
        '📊 Reportería instantánea en formato CSV/Excel'
      ],
      stack: ['Django', 'Python', 'MySQL', 'Lector QR', 'Bootstrap 5', 'JavaScript'],
      architecture:
        'Estructura modular en Django con control de roles (profesores, inspectores, administradores de bodega), validación relacional de inventario y optimización de consultas SQL para alta concurrencia en horarios de comida.'
    },
    6: {
      title: 'Software POS Java — Caja de Pago, Inventario & Tickets',
      category: 'Software de Escritorio / POS & Control de Caja',
      img: 'productos/impresa termica.PNG',
      description:
        'Software integral tipo caja registradora (POS) para comercios. Controla el registro de ventas, medios de pago (efectivo/tarjeta), emisión de tickets digitales y físicos con impresoras térmicas USB/Bluetooth, kardex de inventario y arqueo diario.',
      metrics: [
        '🧾 Emisión de tickets térmicos ESC/POS (USB y Bluetooth)',
        '⚖️ Arqueo de caja y conciliación diaria sin errores',
        '📦 Control y kardex de inventario en tiempo real',
        '🔍 Trazabilidad total de ventas y movimientos'
      ],
      stack: ['Java 11+ (SE)', 'Swing', 'JDBC', 'MySQL / MariaDB', 'ESC/POS', 'Maven', 'Git'],
      architecture:
        'Patrón de diseño MVC en Java con Swing, persistencia relacional con JDBC transaccional, driver universal para impresoras térmicas ESC/POS e interfaz ergonómica de alta velocidad para cajeros.'
    }
  };

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Open
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-project');
      const data = projectDatabase[projId];

      if (data && modal && modalContent) {
        modalContent.innerHTML = `
          ${data.img ? `<div style="text-align:center; margin-bottom:1.25rem; background:rgba(6,9,17,0.7); border-radius:12px; padding:0.75rem; border:1px solid rgba(255,255,255,0.08);"><img src="${data.img}" alt="${data.title}" style="max-height:240px; margin:0 auto; border-radius:8px; object-fit:contain;"></div>` : ''}
          <div style="display:inline-block; padding: 0.3rem 0.8rem; background:rgba(0,242,254,0.1); border:1px solid rgba(0,242,254,0.3); border-radius:999px; color:var(--primary); font-size:0.8rem; font-weight:600; margin-bottom:1rem;">
            ${data.category}
          </div>
          <h2 style="font-size:1.5rem; margin-bottom:0.75rem; color:#ffffff;">${data.title}</h2>
          <p style="font-size:0.95rem; line-height:1.6; margin-bottom:1.25rem; color:var(--text-muted);">${data.description}</p>
          
          <h4 style="font-size:1rem; color:#ffffff; margin-bottom:0.6rem;"><i class="fa-solid fa-layer-group" style="color:var(--primary);"></i> Stack Tecnológico</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem;">
            ${data.stack.map((s) => `<span class="tag" style="font-size:0.82rem; padding:0.25rem 0.65rem;">${s}</span>`).join('')}
          </div>

          <h4 style="font-size:1rem; color:#ffffff; margin-bottom:0.6rem;"><i class="fa-solid fa-chart-line" style="color:var(--accent-emerald);"></i> Puntos Destacados & Resultados</h4>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem; margin-bottom:1.25rem;">
            ${data.metrics.map((m) => `<li style="font-size:0.88rem; color:#ffffff; display:flex; align-items:center; gap:0.5rem;"><i class="fa-solid fa-check" style="color:var(--accent-emerald);"></i> ${m}</li>`).join('')}
          </ul>

          <h4 style="font-size:1rem; color:#ffffff; margin-bottom:0.6rem;"><i class="fa-solid fa-server" style="color:#c084fc;"></i> Arquitectura & Solución Técnica</h4>
          <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.75rem;">${data.architecture}</p>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="#cotizador" class="btn btn-primary" onclick="document.getElementById('projectModal').classList.remove('open')">
              <i class="fa-solid fa-bolt"></i> Cotizar Proyecto Similar
            </a>
            <a href="https://wa.me/56986635815?text=Hola%20Yojann,%20me%20interesó%20mucho%20el%20proyecto%20${encodeURIComponent(data.title)}" target="_blank" rel="noopener" class="btn btn-glass">
              <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
            </a>
          </div>
        `;
        modal.classList.add('open');
      }
    });
  });

  // Modal Close
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.classList.remove('open');
    });
  }
}

/* --------------------------------------------------------------------------
   6. Contact Form Handling & Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('btnSubmitForm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast('Por favor completa los campos requeridos');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span><i class="fa-solid fa-spinner fa-spin"></i> Enviando Mensaje...</span>`;
    }

    // Simulate sending & generate WhatsApp fallback
    setTimeout(() => {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#34d399;"><i class="fa-solid fa-circle-check"></i> ¡Gracias ${name}! Tu mensaje ha sido recibido. Te responderé en breve.</span>`;
      }

      showToast(`¡Mensaje enviado con éxito, ${name}!`);
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span><i class="fa-solid fa-paper-plane"></i> Enviar Mensaje</span>`;
      }
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   7. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
   8. Dynamic Current Year
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
