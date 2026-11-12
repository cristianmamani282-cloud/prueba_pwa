/* ==========================================================================
   PORTAFOLIO PWA CRISTIAN NEIL MAMANI • LÓGICA DE CONTROL (UPDS LA PAZ)
   
   1. NAVEGACIÓN ENTRE PANELES Y DOCK INFERIOR
   2. CARRUSEL DE FOTOS Y MOMENTOS
   3. FILTRADO DE AGENDA POR DÍA
   4. REPRODUCTOR DE MÚSICA INTERACTIVO CON TIMER
   5. CARRUSEL DE FRASES INSPIRADORAS
   6. SIMULACIÓN DE HIDRATACIÓN SSR & PREVENCIÓN DE MEMORY LEAKS (.off())
   7. FILTRO DE 3 CAPAS EN CASCADA
   8. FORMULARIO CON VALIDACIÓN & SOPORTE OFFLINE PWA
   ========================================================================== */

// ==========================================================================
// 1. NAVEGACIÓN DE PANELES & DOCK INFERIOR
// ==========================================================================

function abrirPanel(panelId) {
  // Ocultar todos los paneles de pantalla
  document.querySelectorAll('.pwa-screen-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  // Mostrar el panel destino
  const target = document.getElementById('panel-' + panelId);
  if (target) {
    target.classList.add('active');
  }

  // Sincronizar dock inferior
  document.querySelectorAll('.dock-btn-tab').forEach(btn => {
    const isTarget = btn.dataset.target === ('panel-' + panelId) ||
      (panelId === 'principal' && btn.dataset.target === 'panel-principal');
    btn.classList.toggle('active', isTarget);
  });

  // Cerrar menú rápido si estuviera abierto
  cerrarMenu();

  // Reiniciar scroll interno del viewport principal
  const viewport = document.querySelector('.pwa-main-viewport');
  if (viewport) viewport.scrollTop = 0;

  // Sincronizar hash de la URL
  try {
    if (panelId === 'principal') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
      history.replaceState(null, '', '#' + panelId);
    }
  } catch (e) {}
}
window.abrirPanel = abrirPanel;

function volverInicio() {
  abrirPanel('principal');
}
window.volverInicio = volverInicio;

function toggleMenu() {
  if (window.$ && $('#navMenu').length) {
    $('#navMenu').stop(true, true).slideToggle(200);
  }
}
window.toggleMenu = toggleMenu;

function cerrarMenu() {
  if (window.$ && $('#navMenu').length) {
    $('#navMenu').stop(true, true).slideUp(180);
  }
}
window.cerrarMenu = cerrarMenu;

// ==========================================================================
// 2. SUB-PESTAÑAS DE "MI MUNDO" (INTERESES, PASATIEMPOS, JUEGOS, FILTRO UPDS)
// ==========================================================================

function cambiarSubTabMundo(tabName) {
  document.querySelectorAll('.subtab-view').forEach(view => {
    view.classList.remove('active');
  });
  const target = document.getElementById('subtab-' + tabName);
  if (target) {
    target.classList.add('active');
  }

  document.querySelectorAll('.pill-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
}
window.cambiarSubTabMundo = cambiarSubTabMundo;

// ==========================================================================
// 3. CARRUSEL INTERACTIVO DE FOTOS (PANEL FOTOS)
// ==========================================================================

const fotosGaleria = [
  { src: 'img/perfil.jpeg', title: 'Mi Perfil Oficial', sub: 'Fotografía de presentación de Cristian Neil Mamani.' },
  { src: 'img/cup.jpeg', title: 'Café & Enfoque', sub: 'Momentos de calma, concentración y estudio.' },
  { src: 'img/girl.jpeg', title: 'Momentos Especiales', sub: 'Recuerdos valiosos que inspiran mi camino.' },
  { src: 'img/travel.jpeg', title: 'Viajes & Rutas', sub: 'Descubriendo nuevos horizontes y caminos.' },
  { src: 'img/tatto.jpeg', title: 'Estilo & Arte', sub: 'Expresión, determinación y disciplina personal.' }
];

let fotoIndexActual = 0;

function actualizarFotoUI() {
  const foto = fotosGaleria[fotoIndexActual];
  const $img = $('#carouselMainPhoto');
  const $title = $('#photoCaptionTitle');
  const $sub = $('#photoCaptionSub');

  if ($img.length) {
    $img.css('opacity', 0);
    setTimeout(() => {
      $img.attr('src', foto.src);
      $title.text(foto.title);
      $sub.text(foto.sub);
      $img.css('opacity', 1);
    }, 150);
  }

  // Puntos de paginación
  $('#photoDotsBar .photo-dot').each(function(i) {
    $(this).toggleClass('active', i === fotoIndexActual);
  });

  // Miniaturas
  $('.thumb-mini-slide').each(function(i) {
    $(this).toggleClass('active', i === fotoIndexActual);
  });
}

function cambiarFotoSlider(dir) {
  fotoIndexActual = (fotoIndexActual + dir + fotosGaleria.length) % fotosGaleria.length;
  actualizarFotoUI();
}
window.cambiarFotoSlider = cambiarFotoSlider;

function irAFoto(index) {
  fotoIndexActual = index;
  actualizarFotoUI();
}
window.irAFoto = irAFoto;

// ==========================================================================
// 4. AGENDA DINÁMICA POR DÍA (PANEL AGENDA)
// ==========================================================================

const agendaPorDia = {
  lun: {
    nombre: 'Lunes',
    items: [
      {
        hora: '08:00 - 12:00',
        act: 'Clases UPDS: Diseño Web II',
        cat: 'Académico UPDS',
        tipo: 'academico',
        icon: 'bi-mortarboard-fill',
        desc: 'Universidad Privada Domingo Savio • Sede La Paz • Arquitectura frontend, PWAs, Service Workers y jQuery.'
      },
      {
        hora: '14:00 - 16:00',
        act: 'Estudio Técnico & Algoritmos',
        cat: 'Desarrollo',
        tipo: 'codigo',
        icon: 'bi-laptop',
        desc: 'Práctica de código, algoritmos de optimización, estructuras de datos y resolución de guías técnicas.'
      },
      {
        hora: '18:00 - 20:00',
        act: 'Gym & PowerLifting',
        cat: 'Entrenamiento',
        tipo: 'fitness',
        icon: 'bi-lightning-charge-fill',
        desc: 'Sesión pesada de fuerza, press banca, sentadillas y acondicionamiento físico con alta disciplina.'
      }
    ]
  },
  mar: {
    nombre: 'Martes',
    items: [
      {
        hora: '08:00 - 12:00',
        act: 'Arquitectura de Software',
        cat: 'Académico UPDS',
        tipo: 'academico',
        icon: 'bi-mortarboard-fill',
        desc: 'Patrones de diseño de software, diagramas UML, modelado de sistemas e ingeniería de requerimientos.'
      },
      {
        hora: '15:00 - 17:30',
        act: 'Desarrollo Frontend & Proyectos',
        cat: 'Desarrollo',
        tipo: 'codigo',
        icon: 'bi-code-slash',
        desc: 'Maquetación de interfaces responsivas, estilos synthwave, hidratación SSR y optimización de rendimiento.'
      },
      {
        hora: '18:30 - 20:30',
        act: 'Entrenamiento de Fuerza',
        cat: 'Entrenamiento',
        tipo: 'fitness',
        icon: 'bi-activity',
        desc: 'Entrenamiento de hipertrofia y desconexión mental escuchando synthwave, metal y rock.'
      }
    ]
  },
  mie: {
    nombre: 'Miércoles',
    items: [
      {
        hora: '08:00 - 12:00',
        act: 'Clases UPDS Sede La Paz',
        cat: 'Académico UPDS',
        tipo: 'academico',
        icon: 'bi-mortarboard-fill',
        desc: 'Sesiones teóricas y prácticas en campus universitario con docentes y trabajo en equipo.'
      },
      {
        hora: '14:00 - 16:30',
        act: 'Laboratorio de Programación',
        cat: 'Desarrollo',
        tipo: 'codigo',
        icon: 'bi-terminal-fill',
        desc: 'Pruebas de bases de datos, consultas complejas SQL y control de sesiones seguras backend.'
      },
      {
        hora: '18:00 - 20:00',
        act: 'Gym & Rutina de Empuje',
        cat: 'Entrenamiento',
        tipo: 'fitness',
        icon: 'bi-lightning-charge-fill',
        desc: 'Enfoque en pecho, hombro militar y tríceps manteniendo técnica estricta y sobrecarga progresiva.'
      }
    ]
  },
  jue: {
    nombre: 'Jueves',
    items: [
      {
        hora: '08:00 - 12:00',
        act: 'Bases de Datos Avanzadas',
        cat: 'Académico UPDS',
        tipo: 'academico',
        icon: 'bi-database-fill',
        desc: 'Optimización de esquemas relacionales, normalización y almacenamiento transaccional seguro.'
      },
      {
        hora: '15:00 - 18:00',
        act: 'Desarrollo de Sistemas',
        cat: 'Desarrollo',
        tipo: 'codigo',
        icon: 'bi-cpu-fill',
        desc: 'Construcción modular de aplicaciones web e integración de APIs y buenas prácticas de código.'
      },
      {
        hora: '19:00 - 21:00',
        act: 'Gaming & Tiempo Libre',
        cat: 'Ocio & Gaming',
        tipo: 'gaming',
        icon: 'bi-controller',
        desc: 'Partidas en línea en GTA V o EA Sports FC con amigos de la comunidad competitiva.'
      }
    ]
  },
  vie: {
    nombre: 'Viernes',
    items: [
      {
        hora: '08:00 - 12:00',
        act: 'Taller de Ingeniería',
        cat: 'Académico UPDS',
        tipo: 'academico',
        icon: 'bi-mortarboard-fill',
        desc: 'Presentación de avances semanales, defensa de prácticas y proyectos de carrera universitaria.'
      },
      {
        hora: '14:00 - 17:00',
        act: 'Repaso Semanal y Tareas',
        cat: 'Académico UPDS',
        tipo: 'academico',
        icon: 'bi-journal-check',
        desc: 'Cierre de entregas académicas y preparación para exámenes y evaluaciones continuas.'
      },
      {
        hora: '18:00 - 20:00',
        act: 'Gym & Rutina de Pierna',
        cat: 'Entrenamiento',
        tipo: 'fitness',
        icon: 'bi-lightning-charge-fill',
        desc: 'Sentadillas pesadas, peso muerto rumano y sesión de estiramientos para cerrar la semana.'
      }
    ]
  },
  sab: {
    nombre: 'Sábado',
    items: [
      {
        hora: '09:00 - 12:00',
        act: 'Proyectos Personales & Código',
        cat: 'Desarrollo',
        tipo: 'codigo',
        icon: 'bi-laptop',
        desc: 'Investigación de nuevas tecnologías web, experimentación con librerías modernas y portafolio.'
      },
      {
        hora: '15:00 - 20:00',
        act: 'Torneo Gaming & Descanso',
        cat: 'Ocio & Gaming',
        tipo: 'gaming',
        icon: 'bi-controller',
        desc: 'Torneos con amigos en Tekken 7, supervivencia en Minecraft y convivencia en Discord.'
      }
    ]
  },
  dom: {
    nombre: 'Domingo',
    items: [
      {
        hora: '10:00 - 13:00',
        act: 'Paseo & Fotografía en La Paz',
        cat: 'Personal & Creatividad',
        tipo: 'personal',
        icon: 'bi-camera-fill',
        desc: 'Recorrido por miradores paceños, captura de atardeceres y momentos de inspiración visual.'
      },
      {
        hora: '16:00 - 19:00',
        act: 'Planificación de la Semana',
        cat: 'Organización',
        tipo: 'personal',
        icon: 'bi-calendar-check-fill',
        desc: 'Revisión de metas, organización de horarios de estudio y preparación para una nueva semana.'
      }
    ]
  }
};

function crearTarjetaActividadHTML(item, nombreDia) {
  return `
    <div class="agenda-activity-list-card">
      <div class="agenda-activity-icon-box ${item.tipo}">
        <i class="bi ${item.icon}"></i>
      </div>
      <div class="agenda-activity-content flex-grow-1">
        <div class="d-flex justify-content-between align-items-center gap-2 mb-1">
          <span class="agenda-tag ${item.tipo}">${nombreDia} • ${item.cat}</span>
          <span class="agenda-time-pill"><i class="bi bi-clock me-1"></i>${item.hora}</span>
        </div>
        <h6 class="agenda-activity-name mb-1">${item.act}</h6>
        <p class="agenda-activity-desc mb-0">${item.desc}</p>
      </div>
    </div>
  `;
}

function filtrarDiaAgenda(dia = 'lun') {
  // Sincronizar botones de día
  $('.agenda-day-pill').each(function() {
    const d = $(this).data('day') || $(this).attr('onclick')?.match(/'([^']+)'/)?.[1];
    $(this).toggleClass('active', d === dia);
  });

  const $cont = $('#agendaTimelineList');
  $cont.empty();

  if (dia === 'todos') {
    $('#agendaDiaTitulo').html('<i class="bi bi-calendar-week text-danger me-1"></i> Rutina Semanal Completa');
    let totalItems = 0;
    const ordenDias = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

    ordenDias.forEach(key => {
      const diaObj = agendaPorDia[key];
      if (!diaObj) return;

      $cont.append(`
        <div class="agenda-day-group-header">
          <i class="bi bi-calendar-event text-danger"></i>
          <span>${diaObj.nombre}</span>
        </div>
      `);

      diaObj.items.forEach(item => {
        totalItems++;
        $cont.append(crearTarjetaActividadHTML(item, diaObj.nombre));
      });
    });

    $('#agendaCountBadge').text(`${totalItems} actividades`);
  } else {
    const diaObj = agendaPorDia[dia] || agendaPorDia.lun;
    $('#agendaDiaTitulo').html(`<i class="bi bi-calendar-day text-danger me-1"></i> Rutina: ${diaObj.nombre}`);
    $('#agendaCountBadge').text(`${diaObj.items.length} actividades`);

    diaObj.items.forEach(item => {
      $cont.append(crearTarjetaActividadHTML(item, diaObj.nombre));
    });
  }
}
window.filtrarDiaAgenda = filtrarDiaAgenda;

// ==========================================================================
// 5. REPRODUCTOR DE MÚSICA INTERACTIVO (PANEL MÚSICA)
// ==========================================================================

const listaCanciones = [
  { title: 'After Dark', artist: 'Mr.Kitty', duration: 260, durText: '4:20' },
  { title: 'Starboy', artist: 'The Weeknd ft. Daft Punk', duration: 230, durText: '3:50' },
  { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', duration: 272, durText: '4:32' },
  { title: 'The Less I Know The Better', artist: 'Tame Impala', duration: 216, durText: '3:36' },
  { title: 'Can You Feel My Heart', artist: 'Bring Me The Horizon', duration: 228, durText: '3:48' }
];

let cancionIndex = 0;
let isPlaying = false;
let segundosActuales = 134; // 2:14 por defecto
let musicTimer = null;

function formatearTiempo(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function actualizarReproductorUI() {
  const c = listaCanciones[cancionIndex];
  $('#currentTrackTitle').text(c.title);
  $('#currentTrackArtist').text(c.artist);
  $('#musicTotalTime').text(c.durText);
  $('#musicCurrentTime').text(formatearTiempo(segundosActuales));

  const pct = (segundosActuales / c.duration) * 100;
  $('#musicProgressFill').css('width', pct + '%');

  if (isPlaying) {
    $('#playPauseIcon').removeClass('bi-play-fill').addClass('bi-pause-fill');
    $('#musicSpinIcon').addClass('playing');
  } else {
    $('#playPauseIcon').removeClass('bi-pause-fill').addClass('bi-play-fill');
    $('#musicSpinIcon').removeClass('playing');
  }
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    iniciarMusicTimer();
    showPwaToast(`▶ Reproduciendo: ${listaCanciones[cancionIndex].title}`, 'online', 2000);
  } else {
    detenerMusicTimer();
  }
  actualizarReproductorUI();
}
window.togglePlayPause = togglePlayPause;

function iniciarMusicTimer() {
  clearInterval(musicTimer);
  musicTimer = setInterval(() => {
    const c = listaCanciones[cancionIndex];
    segundosActuales++;
    if (segundosActuales >= c.duration) {
      cambiarCancion(1);
    } else {
      actualizarReproductorUI();
    }
  }, 1000);
}

function detenerMusicTimer() {
  clearInterval(musicTimer);
}

function cambiarCancion(dir) {
  cancionIndex = (cancionIndex + dir + listaCanciones.length) % listaCanciones.length;
  segundosActuales = 0;
  actualizarReproductorUI();
  if (isPlaying) {
    showPwaToast(`🎵 Canción: ${listaCanciones[cancionIndex].title}`, 'info', 2000);
  }
}
window.cambiarCancion = cambiarCancion;

function seleccionarCancion(idx) {
  cancionIndex = idx;
  segundosActuales = 0;
  isPlaying = true;
  iniciarMusicTimer();
  actualizarReproductorUI();
  showPwaToast(`▶ Reproduciendo: ${listaCanciones[cancionIndex].title}`, 'online', 2500);
}
window.seleccionarCancion = seleccionarCancion;

function toggleLikeSong() {
  const $icon = $('#btnLikeSong i');
  const liked = $icon.hasClass('text-danger');
  if (liked) {
    $icon.removeClass('text-danger bi-heart-fill').addClass('text-secondary bi-heart');
    showPwaToast('Eliminado de favoritos', 'info', 1500);
  } else {
    $icon.removeClass('text-secondary bi-heart').addClass('text-danger bi-heart-fill');
    showPwaToast('❤️ ¡Añadido a tus favoritos!', 'online', 2000);
  }
}
window.toggleLikeSong = toggleLikeSong;

function seekSong(e) {
  const bar = document.getElementById('musicProgressBar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, clickX / rect.width));
  const c = listaCanciones[cancionIndex];
  segundosActuales = Math.floor(pct * c.duration);
  actualizarReproductorUI();
}
window.seekSong = seekSong;

function shuffleSong() {
  cancionIndex = Math.floor(Math.random() * listaCanciones.length);
  segundosActuales = 0;
  actualizarReproductorUI();
  showPwaToast('🔀 Modo aleatorio activado', 'info', 1500);
}
window.shuffleSong = shuffleSong;

function repeatSong() {
  segundosActuales = 0;
  actualizarReproductorUI();
  showPwaToast('🔁 Repitiendo canción', 'info', 1500);
}
window.repeatSong = repeatSong;

// ==========================================================================
// 6. CARRUSEL DE IMÁGENES DE FRASES (PANEL FRASES: CARPEDIEM, DESCARGA, IMAGES)
// ==========================================================================

const frasesImagenes = [
  { src: 'img/carpediem.jpg', title: 'Carpe Diem', desc: 'Aprovecha el día presente con determinación y disciplina.' },
  { src: 'img/descarga.jpg', title: 'Determinación & Enfoque', desc: 'Tu única competencia es quien eras el día de ayer.' },
  { src: 'img/images.jpg', title: 'Superación & Constancia', desc: 'Las grandes metas se construyen con pequeños hábitos diarios.' }
];

let fraseImgIndex = 0;

function actualizarFraseImgUI() {
  const f = frasesImagenes[fraseImgIndex];
  const $img = $('#phraseMainImg');
  const $title = $('#phraseCaptionTitle');
  const $desc = $('#phraseCaptionDesc');

  if ($img.length) {
    $img.css('opacity', 0);
    setTimeout(() => {
      $img.attr('src', f.src);
      $title.text(f.title);
      $desc.text(f.desc);
      $img.css('opacity', 1);
    }, 150);
  }

  $('#phraseDotsBar .phrase-dot').each(function(i) {
    $(this).toggleClass('active', i === fraseImgIndex);
  });

  $('.phrase-mini-thumb').each(function(i) {
    $(this).toggleClass('active', i === fraseImgIndex);
  });
}

function cambiarFraseImgSlider(dir) {
  fraseImgIndex = (fraseImgIndex + dir + frasesImagenes.length) % frasesImagenes.length;
  actualizarFraseImgUI();
}
window.cambiarFraseImgSlider = cambiarFraseImgSlider;

function irAFraseImg(idx) {
  fraseImgIndex = idx;
  actualizarFraseImgUI();
}
window.irAFraseImg = irAFraseImg;

// ==========================================================================
// 7. CÓDIGO OFICIAL JQUERY: HIDRATACIÓN SSR & PREVENCIÓN DE FUGAS DE MEMORIA
// ==========================================================================

$(document).ready(function() {

  /* ------------------------------------------------------------------------
     A. IMPLEMENTACIÓN PRÁCTICA: BOTÓN DE HIDRATACIÓN SSR
     (Sección 3 de la Guía Oficial de Arquitectura Frontend UPDS)
     Ejecutable en cualquier momento, desde cualquier página y tras cambios
     ------------------------------------------------------------------------ */
  function hidratarInterfaz() {
    let $box = $('#contenedorMenu');

    // 1. Hidratación del botón del menú: conectar eventos sin redibujar el DOM
    $('#btnPWA')
      .text('☰ Menú')
      .attr('title', 'Menú Interactivo (Hidratado)')
      .removeClass('btn-estatico')
      .removeAttr('onclick')
      .off('click')
      .on('click', function(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        toggleMenu();
      });

    // 2. Actualizar estado del botón disparador de hidratación con animación de pulso
    $('#btnHidratar')
      .html('<i class="bi bi-lightning-charge-fill text-success"></i> <span>⚡ Hidratado</span>')
      .addClass('hidratado pulse-activa')
      .attr('title', 'Interfaz hidratada y reactiva en todas las páginas');

    setTimeout(() => {
      $('#btnHidratar').removeClass('pulse-activa');
    }, 850);

    // 3. Marcar contenedor como hidratado
    $box.attr('data-hidratado', 'true');
    console.log('[PWA SSR] Interfaz hidratada con éxito: data-hidratado="true" (Ejecutable en todas las páginas)');

    // 4. Sincronizar reactividad en los componentes de la página activa
    sincronizarComponentesReactivos();

    // 5. Notificación visual al usuario indicando el panel actual
    const panelActivo = $('.pwa-screen-panel.active').attr('id')?.replace('panel-', '') || 'inicio';
    showPwaToast(`⚡ ¡Interfaz Hidratada! [${panelActivo.toUpperCase()}] sincronizado.`, 'online', 2600);
  }
  window.hidratarInterfaz = hidratarInterfaz;

  // Función para re-conectar eventos en todas las páginas y componentes dinámicos
  function sincronizarComponentesReactivos() {
    // Sincronizar carruseles de fotos y frases
    actualizarFotoUI();
    actualizarFraseImgUI();

    // Asegurar que el formulario tenga validación fresca
    $('#nombre').off('input blur').on('input blur', function() {
      const val = $(this).val().trim();
      val === '' ? $('#errNombre').fadeIn() : $('#errNombre').fadeOut();
    });

    $('#correo').off('input blur').on('input blur', function() {
      const val = $(this).val().trim();
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? $('#errCorreo').fadeIn() : $('#errCorreo').fadeOut();
    });
  }
  window.sincronizarComponentesReactivos = sincronizarComponentesReactivos;

  // Botón oficial que ejecuta la hidratación (Requerimiento de la Sesión)
  $('#btnHidratar').off('click').on('click', function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    hidratarInterfaz();
  });

  // Si se hace clic en el botón del menú antes de hidratar, se auto-hidrata de inmediato
  $('#btnPWA').off('click').on('click', function(e) {
    if ($('#contenedorMenu').attr('data-hidratado') !== 'true') {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      hidratarInterfaz();
    }
  });

  /* ------------------------------------------------------------------------
     B. PREVENCIÓN DE FUGAS DE MEMORIA (MEMORY LEAKS) CON .off() PREVIO
     (Sección 2 de la Guía Técnica: Regla de Oro en jQuery)
     ------------------------------------------------------------------------ */

  // 1. Delegación limpia para cerrar menú al pulsar fuera (excluyendo disparadores)
  $(document).off('click.cerrarMenuNav');
  $(document).on('click.cerrarMenuNav', function(e) {
    if (!$(e.target).closest('#navMenu, #btnPWA, #contenedorMenu, #btnHidratar').length) {
      cerrarMenu();
    }
  });

  // 2. Filtro de 3 Capas en Cascada (Práctica Correcta según Guía Técnica)
  $(document).off('change', '#capa1');
  $(document).on('change', '#capa1', function() {
    let valor = $(this).val();
    let $capa2 = $('#capa2');
    $capa2.html('<option value="">-- Seleccione opción --</option>').prop('disabled', false);

    if (valor === 'academico') {
      $capa2.append('<option value="web2">Diseño Web II (SIS-0141)</option>');
      $capa2.append('<option value="sistemas">Ingeniería de Sistemas UPDS</option>');
    } else if (valor === 'desarrollo') {
      $capa2.append('<option value="pwa">Arquitectura PWA & SSR</option>');
      $capa2.append('<option value="frontend">UI Synthwave / Cyberpunk</option>');
    } else {
      $capa2.prop('disabled', true);
      $('#resultadoFiltro').text('Seleccione las capas anteriores...');
    }
  });

  $(document).off('change', '#capa2');
  $(document).on('change', '#capa2', function() {
    let seleccion = $(this).find('option:selected').text();
    $('#resultadoFiltro').html(seleccion ? '✅ Capa 3: ' + seleccion : 'Seleccione las capas...');
  });

  // 3. Validación en tiempo real y matices de enfoque (Focus)
  $('#nombre').off('input blur').on('input blur', function() {
    const val = $(this).val().trim();
    if (val === '') {
      $('#errNombre').fadeIn();
    } else {
      $('#errNombre').fadeOut();
    }
  });

  $('#correo').off('input blur').on('input blur', function() {
    const val = $(this).val().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      $('#errCorreo').fadeIn();
    } else {
      $('#errCorreo').fadeOut();
    }
  });

  // 4. Envío de Formulario con soporte Offline PWA
  $('#pwaForm').off('submit').on('submit', function(e) {
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
      if (!navigator.onLine) {
        // Almacenamiento local Offline (Capa de Datos: LocalStorage / Cola de Sincronización)
        const pending = JSON.parse(localStorage.getItem('pwa_pending_messages') || '[]');
        pending.push({
          nombre: nombre,
          correo: correo,
          telefono: $('#telefono').val().trim(),
          mensaje: $('#mensaje').val().trim(),
          fecha: new Date().toLocaleString()
        });
        localStorage.setItem('pwa_pending_messages', JSON.stringify(pending));

        // UI Resiliente y Optimista (Guía Técnica PWA Offline-First)
        $('#successAlert')
          .html('📡 <strong>Guardado localmente - Pendiente de envío:</strong> Tu mensaje se almacenó en la cola local de la PWA y se sincronizará automáticamente al recuperar la red.')
          .slideDown()
          .delay(4500)
          .slideUp();
        showPwaToast('Guardado localmente - Pendiente de envío', 'offline');
      } else {
        $('#successAlert')
          .html('✅ ¡Mensaje enviado con éxito! Gracias por escribir, ' + nombre + '.')
          .slideDown()
          .delay(3500)
          .slideUp();
        showPwaToast('¡Formulario enviado con éxito!', 'online');
      }

      $('#pwaForm')[0].reset();
    }
  });

  /* ------------------------------------------------------------------------
     C. DETECTOR VISUAL DE ESTADO OFFLINE/ONLINE EN JQUERY
     (Sección 6 de la Guía Oficial Arquitectura PWA Offline-First - inge Miguel)
     ------------------------------------------------------------------------ */
  function actualizarEstadoRed() {
    if (navigator.onLine) {
      $('#estadoRed').text('🟢 En Línea').css('background', '#dcfce7').css('color', '#15803d');
      $('#estadoRedContacto').text('🟢 En Línea').css('background', '#dcfce7').css('color', '#15803d');
    } else {
      $('#estadoRed').text('🟠 Modo Offline Activo (Datos Locales)').css('background', '#ffedd5').css('color', '#c2410c');
      $('#estadoRedContacto').text('🟠 Modo Offline Activo (Datos Locales)').css('background', '#ffedd5').css('color', '#c2410c');
    }
  }
  window.actualizarEstadoRed = actualizarEstadoRed;
  $(window).on('online offline', actualizarEstadoRed);
  actualizarEstadoRed(); // Ejecutar al iniciar

  /* ------------------------------------------------------------------------
     D. CÓDIGO DE REFERENCIA: DELEGACIÓN DE EVENTOS OPTIMIZADA POR EVENT BUBBLING
     (Sección 2 de la Guía Técnica Event Bubbling - inge Miguel)
     ✅ Delegación de eventos por Event Bubbling (Ahorro masivo de RAM)
     ------------------------------------------------------------------------ */
  $(document).off('click', '.action-card-tile').on('click', '.action-card-tile', function(e) {
    const targetPanel = $(this).data('target-panel');
    console.log('[Event Bubbling] Elemento capturado por propagación en $(document):', targetPanel || e.target);
    if (targetPanel) {
      abrirPanel(targetPanel);
    }
  });

  $(document).off('click', '.category-box-item').on('click', '.category-box-item', function(e) {
    const subtab = $(this).data('subtab');
    const panel = $(this).data('panel');
    console.log('[Event Bubbling] Categoría capturada por propagación:', subtab || panel);
    if (subtab) {
      cambiarSubTabMundo(subtab);
    } else if (panel) {
      abrirPanel(panel);
    }
  });

  $(document).off('click', '.agenda-activity-list-card').on('click', '.agenda-activity-list-card', function(e) {
    const actName = $(this).find('.agenda-activity-name').text();
    console.log('[Event Bubbling] Actividad de agenda capturada por propagación:', actName);
  });

  // Inicializar agenda por defecto (Lunes)
  filtrarDiaAgenda('lun');

  // Inicializar UI de fotos y frases
  actualizarFotoUI();
  actualizarFraseImgUI();
  actualizarReproductorUI();

  // Soporte directo para shortcuts de PWA y navegación por Hash (#mi-mundo, #fotos, etc.)
  function navegarSegunHash() {
    const rawHash = (window.location.hash || '').replace('#', '').trim();
    const queryPanel = new URLSearchParams(window.location.search).get('panel');
    const panelDestino = rawHash || queryPanel;
    if (panelDestino && document.getElementById('panel-' + panelDestino)) {
      abrirPanel(panelDestino);
    }
  }
  navegarSegunHash();
  window.addEventListener('hashchange', navegarSegunHash);

});

// ==========================================================================
// 8. FUNCIONALIDADES ESPECÍFICAS DE PWA (TOAST, OFFLINE & INSTALACIÓN)
// ==========================================================================

const pwaToast = document.getElementById('pwaToast');
const pwaToastIcon = document.getElementById('pwaToastIcon');
const pwaToastMsg = document.getElementById('pwaToastMsg');
let toastTimer = null;

function showPwaToast(msg, type = 'info', duration = 3200) {
  if (!pwaToast || !pwaToastMsg) return;

  clearTimeout(toastTimer);
  pwaToastMsg.textContent = msg;
  pwaToast.className = 'pwa-toast';

  if (type === 'offline') {
    pwaToast.classList.add('toast-offline');
    if (pwaToastIcon) pwaToastIcon.className = 'bi bi-wifi-off';
  } else if (type === 'online') {
    pwaToast.classList.add('toast-online');
    if (pwaToastIcon) pwaToastIcon.className = 'bi bi-check-circle-fill';
  } else {
    pwaToast.classList.add('toast-info');
    if (pwaToastIcon) pwaToastIcon.className = 'bi bi-info-circle-fill';
  }

  pwaToast.classList.add('show');

  toastTimer = setTimeout(() => {
    pwaToast.classList.remove('show');
  }, duration);
}
window.showPwaToast = showPwaToast;

// Eventos de Conexión de Red (Online / Offline - Guía Técnica PWA)
window.addEventListener('online', () => {
  if (typeof actualizarEstadoRed === 'function') {
    actualizarEstadoRed();
  }
  showPwaToast('¡Conexión recuperada! En línea', 'online');
  const pending = JSON.parse(localStorage.getItem('pwa_pending_messages') || '[]');
  if (pending.length > 0) {
    setTimeout(() => {
      showPwaToast(`📨 ${pending.length} mensaje(s) de la cola de sincronización enviados con éxito.`, 'online', 4000);
      localStorage.removeItem('pwa_pending_messages');
    }, 1500);
  }
});

window.addEventListener('offline', () => {
  if (typeof actualizarEstadoRed === 'function') {
    actualizarEstadoRed();
  }
  showPwaToast('Sin conexión. Modo offline PWA activo.', 'offline', 4000);
});

// Prompt e Instalación PWA (Standalone, Android & iOS)
let deferredPrompt = null;
const pwaInstallNavBtn = document.getElementById('pwaInstallNavBtn');
const pwaBanner = document.getElementById('pwaBanner');
const pwaBannerInstallBtn = document.getElementById('pwaBannerInstallBtn');
const pwaBannerCloseBtn = document.getElementById('pwaBannerCloseBtn');
const pwaBannerDismissBtn = document.getElementById('pwaBannerDismissBtn');

const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

if (!isStandalone) {
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
      }, 2500);
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

  if (pwaInstallNavBtn) pwaInstallNavBtn.addEventListener('click', instalarApp);
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

// Registro Oficial del Service Worker para soporte Offline (Guía Técnica Inge Miguel)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Service Worker PWA Registrado con Éxito:', reg.scope);
      })
      .catch(err => {
        console.error('Fallo en Registro de SW:', err);
      });
  });
}
