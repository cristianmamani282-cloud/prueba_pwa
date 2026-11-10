/* =========================================================
   GUÍA TÉCNICA PWA & ADAPTABILIDAD MÓVIL (INGE MIGUEL - UPDS)
   LÓGICA DE CONTROL CON JQUERY (VALIDACIONES & EVENTOS)
   ========================================================= */

// 1. NAVEGACIÓN ENTRE SECCIONES CON LA FILA DE BOTONES
function mostrarSeccion(seccionId) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll('.pwa-section-view');
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.style.display = 'none';
  });

  // Mostrar la sección seleccionada
  const target = document.getElementById('sec-' + seccionId);
  if (target) {
    target.classList.add('active');
    target.style.display = 'block';
  }

  // Actualizar estado activo en la fila de botones
  document.querySelectorAll('.pwa-btn-pill').forEach(btn => {
    const match = btn.dataset.seccion === seccionId || btn.getAttribute('onclick')?.includes(seccionId);
    btn.classList.toggle('active', match);
  });

  // Si el menú hamburguesa está abierto, cerrarlo limpiamente
  if (window.$ && $('#navMenu').length) {
    $('#navMenu').stop(true, true).slideUp(180, function() {
      $('#hamburgerBtn').html('☰');
    });
  } else {
    const menu = document.getElementById('navMenu');
    if (menu) menu.style.display = 'none';
    const btn = document.getElementById('hamburgerBtn');
    if (btn) btn.innerHTML = '☰';
  }

  // Resetear scroll interno
  const viewport = document.querySelector('.pwa-viewport-body');
  if (viewport) viewport.scrollTop = 0;
}
window.mostrarSeccion = mostrarSeccion;

// 2. TOGGLE DEL MENÚ HAMBURGUESA (CON CONTROL SEGURO)
function toggleMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const $menu = $('#navMenu');
  const $btn = $('#hamburgerBtn');

  if ($menu.length) {
    $menu.stop(true, true).slideToggle(220, function() {
      const isVisible = $menu.is(':visible');
      $btn.html(isVisible ? '✕' : '☰');
    });
  } else {
    const menu = document.getElementById('navMenu');
    if (menu) {
      const isVisible = menu.style.display === 'block';
      menu.style.display = isVisible ? 'none' : 'block';
      const btn = document.getElementById('hamburgerBtn');
      if (btn) btn.innerHTML = isVisible ? '☰' : '✕';
    }
  }
}
window.toggleMenu = toggleMenu;

// 3. CAMBIAR FOTO DE PERFIL DESDE LAS MINIATURAS
function cambiarFotoPerfil(src) {
  const avatar = document.getElementById('mainProfileAvatar');
  if (avatar) {
    avatar.src = src;
  }
  document.querySelectorAll('.mini-thumb-photo').forEach(thumb => {
    thumb.classList.toggle('active', thumb.getAttribute('src') === src);
  });
}
window.cambiarFotoPerfil = cambiarFotoPerfil;

// 4. SWITCHER DE HORARIO
function mostrarHorario(tipo) {
  document.querySelectorAll('.timeline-compact-list').forEach(el => el.classList.add('d-none'));
  const target = document.getElementById(`horario-${tipo}`);
  if (target) target.classList.remove('d-none');

  document.querySelectorAll('.btn-schedule-pill').forEach(btn => {
    const isCurrent = btn.getAttribute('onclick')?.includes(tipo);
    btn.classList.toggle('active', isCurrent);
  });
}
window.mostrarHorario = mostrarHorario;

// 5. FILTRADO DE VIDEOJUEGOS
function filtrar(categoria) {
  const filas = document.querySelectorAll('.game-row');
  filas.forEach(fila => {
    const match = categoria === 'todos' || fila.dataset.categoria === categoria;
    fila.style.display = match ? 'flex' : 'none';
  });

  const botones = document.querySelectorAll('.btn-filter-bubble');
  botones.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === categoria);
  });
}
window.filtrar = filtrar;

// 6. GESTIÓN DEL TEMA (MODO OSCURO / CLARO)
const themeBtn = document.getElementById('themeBtn');
const bodyElement = document.body;
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('cristian_theme');
if (savedTheme === 'light') {
  bodyElement.classList.add('light-mode');
  if (themeIcon) themeIcon.className = 'bi bi-sun-fill text-warning';
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = bodyElement.classList.toggle('light-mode');
    localStorage.setItem('cristian_theme', isLight ? 'light' : 'dark');
    if (themeIcon) {
      themeIcon.className = isLight ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill';
    }
  });
}

// 7. CÓDIGO OFICIAL JQUERY (SECCIÓN 4 DE LA GUÍA TÉCNICA DEL DOCENTE)
$(document).ready(function() {

  // Evento clic en botones de la fila horizontal y del menú
  $('.pwa-btn-pill, .nav-menu-link').click(function(e) {
    e.preventDefault();
    const seccion = $(this).data('seccion');
    if (seccion) {
      mostrarSeccion(seccion);
    }
  });

  // 1. Menú Hamburguesa SlideToggle (Guía Oficial con control de estado)
  $('#hamburgerBtn').off('click').on('click', function(e) {
    toggleMenu(e);
  });

  // Cerrar menú al hacer clic fuera de él
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#navMenu, #hamburgerBtn').length) {
      if ($('#navMenu').is(':visible')) {
        $('#navMenu').stop(true, true).slideUp(180, function() {
          $('#hamburgerBtn').html('☰');
        });
      }
    }
  });

  // 2. Lógica del Filtro de 3 Capas en Cascadas (Guía Oficial)
  $('#capa1').change(function() {
    let valor = $(this).val();
    let $capa2 = $('#capa2');
    $capa2.html('<option value="">-- Seleccione opción --</option>').prop('disabled', false);

    if (valor === 'academico') {
      $capa2.append('<option value="web2">Diseño Web II (SIS-0141)</option>');
    } else if (valor === 'desarrollo') {
      $capa2.append('<option value="pwa">Arquitectura PWA</option>');
    } else {
      $capa2.prop('disabled', true);
      $('#resultadoFiltro').text('Seleccione las capas anteriores...');
    }
  });

  $('#capa2').change(function() {
    let seleccion = $(this).find('option:selected').text();
    $('#resultadoFiltro').html(seleccion ? 'Capa 3: ' + seleccion : 'Seleccione las capas...');
  });

  // 3. Validación de Formulario en Tiempo Real (Guía Oficial)
  $('#pwaForm').submit(function(e) {
    e.preventDefault();
    let valido = true;
    let nombre = $('#nombre').val().trim();
    let correo = $('#correo').val().trim();

    if (nombre === '') {
      $('#errNombre').fadeIn();
      valido = false;
    } else {
      $('#errNombre').fadeOut();
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      $('#errCorreo').fadeIn();
      valido = false;
    } else {
      $('#errCorreo').fadeOut();
    }

    if (valido) {
      // Soporte Offline PWA
      if (!navigator.onLine) {
        const pending = JSON.parse(localStorage.getItem('pwa_pending_messages') || '[]');
        pending.push({
          nombre: nombre,
          correo: correo,
          telefono: $('#telefono').val().trim(),
          mensaje: $('#mensaje').val().trim(),
          fecha: new Date().toLocaleString()
        });
        localStorage.setItem('pwa_pending_messages', JSON.stringify(pending));

        $('#successAlert')
          .html('📡 <strong>Guardado Offline:</strong> Tu mensaje se guardó en la PWA y se enviará al conectarte.')
          .slideDown()
          .delay(3500)
          .slideUp();
        showPwaToast('Mensaje guardado localmente (Offline)', 'info');
      } else {
        $('#successAlert')
          .html('✅ ¡Formulario enviado con éxito! Gracias por tu mensaje, ' + nombre + '.')
          .slideDown()
          .delay(3000)
          .slideUp();
        showPwaToast('¡Formulario enviado con éxito!', 'online');
      }

      $('#pwaForm')[0].reset();
    }
  });

});

// =========================================================
// 8. FUNCIONALIDADES ESPECÍFICAS DE PWA (OFFLINE & INSTALL)
// =========================================================

const pwaToast = document.getElementById('pwaToast');
const pwaToastIcon = document.getElementById('pwaToastIcon');
const pwaToastMsg = document.getElementById('pwaToastMsg');
let toastTimer = null;

function showPwaToast(msg, type = 'info', duration = 3500) {
  if (!pwaToast || !pwaToastMsg) return;

  clearTimeout(toastTimer);
  pwaToastMsg.textContent = msg;
  pwaToast.className = 'pwa-toast';

  if (type === 'offline') {
    pwaToast.classList.add('toast-offline');
    if (pwaToastIcon) pwaToastIcon.className = 'bi bi-wifi-off';
  } else if (type === 'online') {
    pwaToast.classList.add('toast-online');
    if (pwaToastIcon) pwaToastIcon.className = 'bi bi-wifi';
  } else {
    pwaToast.classList.add('toast-info');
    if (pwaToastIcon) pwaToastIcon.className = 'bi bi-check-circle-fill';
  }

  pwaToast.classList.add('show');

  toastTimer = setTimeout(() => {
    pwaToast.classList.remove('show');
  }, duration);
}

// Eventos de Red (Online / Offline)
window.addEventListener('online', () => {
  showPwaToast('¡Conexión recuperada! En línea', 'online');
  const pending = JSON.parse(localStorage.getItem('pwa_pending_messages') || '[]');
  if (pending.length > 0) {
    setTimeout(() => {
      showPwaToast(`📨 ${pending.length} mensaje(s) pendientes sincronizados.`, 'info', 4000);
      localStorage.removeItem('pwa_pending_messages');
    }, 1500);
  }
});

window.addEventListener('offline', () => {
  showPwaToast('Sin conexión. Modo offline activo.', 'offline', 4000);
});

// Prompt de Instalación PWA
let deferredPrompt = null;
const pwaInstallNavBtn = document.getElementById('pwaInstallNavBtn');
const pwaBanner = document.getElementById('pwaBanner');
const pwaBannerInstallBtn = document.getElementById('pwaBannerInstallBtn');
const pwaBannerCloseBtn = document.getElementById('pwaBannerCloseBtn');
const pwaBannerDismissBtn = document.getElementById('pwaBannerDismissBtn');

const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;

if (!isStandalone) {
  if (isIos && pwaInstallNavBtn) {
    pwaInstallNavBtn.classList.remove('d-none');
    pwaInstallNavBtn.addEventListener('click', () => {
      const modalEl = document.getElementById('pwaIosModal');
      if (modalEl && window.bootstrap) {
        new window.bootstrap.Modal(modalEl).show();
      }
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (pwaInstallNavBtn) {
      pwaInstallNavBtn.classList.remove('d-none');
    }

    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (!dismissed && pwaBanner) {
      setTimeout(() => {
        pwaBanner.classList.remove('d-none');
      }, 2000);
    }
  });

  async function instalarApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showPwaToast('¡Gracias por instalar la app!', 'online');
      if (pwaBanner) pwaBanner.classList.add('d-none');
      if (pwaInstallNavBtn) pwaInstallNavBtn.classList.add('d-none');
    }
    deferredPrompt = null;
  }

  if (pwaInstallNavBtn && !isIos) pwaInstallNavBtn.addEventListener('click', instalarApp);
  if (pwaBannerInstallBtn) pwaBannerInstallBtn.addEventListener('click', instalarApp);

  function cerrarBanner() {
    if (pwaBanner) pwaBanner.classList.add('d-none');
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  }

  if (pwaBannerCloseBtn) pwaBannerCloseBtn.addEventListener('click', cerrarBanner);
  if (pwaBannerDismissBtn) pwaBannerDismissBtn.addEventListener('click', cerrarBanner);
}

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (pwaInstallNavBtn) pwaInstallNavBtn.classList.add('d-none');
  if (pwaBanner) pwaBanner.classList.add('d-none');
  showPwaToast('🎉 ¡App instalada con éxito!', 'online', 4000);
});

// Registro de Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => {
        console.log('[PWA] Service Worker registrado:', reg.scope);
      })
      .catch(err => {
        console.warn('[PWA] Service Worker error:', err);
      });
  });
}
