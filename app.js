// Simulación de Base de Datos de Componentes Electrónicos
const DB_COMPONENTES = [
    { id: 1, name: "Microcontrolador ESP32-WROOM-32E", category: "Microcontroladores", img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=400&q=80", desc: "Módulo MCU potente con conectividad Wi-Fi y Bluetooth, ideal para proyectos de IoT.", specs: { "Voltaje de Operación": "3.3V", "Núcleos": "Dual-core Xtensa 32-bit LX6", "Frecuencia": "240 MHz", "Flash Memory": "4MB" } },
    { id: 2, name: "Sensor de Presión Barométrica BMP280", category: "Sensores", img: "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=400&q=80", desc: "Sensor absoluto de presión atmosférica, diseñado especialmente para aplicaciones móviles.", specs: { "Interfaz": "I2C / SPI", "Rango de Presión": "300 a 1100 hPa", "Precisión Absoluta": "±1 hPa", "Consumo de Corriente": "2.7 µA" } },
    { id: 3, name: "Módulo Relé de 4 Canales 5V", category: "Módulos de Potencia", img: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=400&q=80", desc: "Placa de interfaz de relé estándar que puede ser controlada directamente por microcontroladores.", specs: { "Voltaje de Control": "5V DC", "Corriente de Disparo": "5-10mA", "Carga Máxima": "AC 250V/10A, DC 30V/10A", "Canales": "4 independientes" } },
    { id: 4, name: "Display OLED 0.96'' I2C Blue", category: "Displays", img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80", desc: "Pantalla gráfica OLED autoiluminada con alto contraste y amplio ángulo de visión.", specs: { "Resolución": "128 x 64 píxeles", "Controlador": "SSD1306", "Tipo de Conexión": "I2C", "Color": "Azul" } }
];

// Variables de Control de Paginación Simulada
let currentPage = 1;
const itemsPerPage = 4;
let isLoading = false;

// Elementos del DOM
const catalogGrid = document.getElementById('catalog-grid');
const loadingTrigger = document.getElementById('loading-trigger');
const techModal = document.getElementById('tech-modal');
const closeModalBtn = document.getElementById('close-modal');

// --- FUNCION: Generar e Inyectar Tarjetas ---
function renderItems(page) {
    isLoading = true;
    
    // Simulamos un retraso de red de 1.2 segundos para apreciar el efecto de carga
    setTimeout(() => {
        // En un escenario real, aquí harías un: fetch(`/api/components?page=${page}`)
        DB_COMPONENTES.forEach(item => {
            // Clonamos el objeto variando el ID para que parezca infinito en la demo
            const uniqueId = `${item.id}-${page}`;
            const card = document.createElement('div');
            card.className = "bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group";
            
            card.innerHTML = `
                <div>
                    <div class="overflow-hidden relative h-48 bg-slate-900">
                        <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                    </div>
                    <div class="p-5">
                        <span class="text-xs font-semibold tracking-wider text-blue-400 uppercase">${item.category}</span>
                        <h2 class="text-lg font-bold mt-2 text-slate-100 line-clamp-1">${item.name}</h2>
                        <p class="text-sm text-slate-400 mt-2 line-clamp-2">${item.desc}</p>
                    </div>
                </div>
                <div class="p-5 pt-0">
                    <button onclick="openModal(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="w-full bg-slate-700 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                        Ver ficha técnica
                    </button>
                </div>
            `;
            catalogGrid.appendChild(card);
        });

        isLoading = false;
        currentPage++;
        
        // Inicializar iconos de Lucide cargados dinámicamente si aplica
        if (window.lucide) lucide.createIcons();
        
        // Detener el scroll infinito artificialmente tras 5 páginas si se desea, para la demo es libre.
    }, 1200);
}

// --- FUNCION: Control del Modal ---
function openModal(item) {
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-img').alt = item.name;
    document.getElementById('modal-category').innerText = item.category;
    document.getElementById('modal-description').innerText = item.desc;
    
    // Construir tabla de especificaciones
    const tableBody = document.getElementById('modal-specs-table');
    tableBody.innerHTML = '';
    
    for (const [key, value] of Object.entries(item.specs)) {
        tableBody.innerHTML += `
            <tr class="hover:bg-slate-700/50 transition-colors">
                <td class="px-4 py-3 font-semibold text-slate-400 w-1/3">${key}</td>
                <td class="px-4 py-3 text-slate-200">${value}</td>
            </tr>
        `;
    }

    // Mostrar Modal animado
    techModal.classList.remove('opacity-0', 'pointer-events-none');
    techModal.firstElementChild.classList.remove('scale-95');
    techModal.firstElementChild.classList.add('scale-100');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
}

function closeModal() {
    techModal.classList.add('opacity-0', 'pointer-events-none');
    techModal.firstElementChild.classList.remove('scale-100');
    techModal.firstElementChild.classList.add('scale-95');
    document.body.style.overflow = ''; // Restaurar scroll
}

// Eventos de cierre del modal
closeModalBtn.addEventListener('click', closeModal);
techModal.addEventListener('click', (e) => { if (e.target === techModal) closeModal(); });

// --- CONFIGURACIÓN DEL INTERSECTION OBSERVER (Scroll Infinito) ---
const observerOptions = {
    root: null, // hace referencia al viewport del navegador
    rootMargin: '0px 0px 200px 0px', // se dispara 200px antes de llegar al final para mejorar la UX
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Agregamos "&& !isSearching" para que no cargue paginación falsa al buscar
        if (entry.isIntersecting && !isLoading && !isSearching) {
            renderItems(currentPage);
        }
    });
}, observerOptions);

// Comenzar a observar el disparador de carga al iniciar
observer.observe(loadingTrigger);

// Inicializar iconos de Lucide al cargar la página por primera vez
document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) lucide.createIcons();
});

// --- LÓGICA DEL MENÚ MÓVIL ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
    // Cambiar dinámicamente el icono entre menú (hamburguesa) y cerrar (X)
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
    } else {
        icon.setAttribute('data-lucide', 'x');
    }
    if (window.lucide) lucide.createIcons();
});

// Cerrar el menú móvil automáticamente al hacer clic en un enlace
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        if (window.lucide) lucide.createIcons();
    });
});

// --- LÓGICA DEL BUSCADOR TIEMPO REAL ---
const searchInput = document.getElementById('search-input');
let isSearching = false; // Bandera para pausar el scroll infinito durante búsquedas

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        // Si el buscador está vacío, restauramos el estado original
        isSearching = false;
        catalogGrid.innerHTML = '';
        currentPage = 1;
        loadingTrigger.classList.remove('hidden'); // Volvemos a mostrar el spinner/intersector
        renderItems(currentPage); // Carga inicial normal
        return;
    }

    // Activamos modo búsqueda
    isSearching = true;
    loadingTrigger.classList.add('hidden'); // Ocultamos el spinner para evitar cargas en scroll

    // Filtrar sobre la base de datos por nombre, categoría o descripción
    const filteredItems = DB_COMPONENTES.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) || 
               item.category.toLowerCase().includes(searchTerm) ||
               item.desc.toLowerCase().includes(searchTerm);
    });

    // Renderizar resultados filtrados
    renderFilteredResults(filteredItems);
});

// Función auxiliar para pintar los resultados de la búsqueda
function renderFilteredResults(items) {
    catalogGrid.innerHTML = ''; // Limpiamos la rejilla actual

    if (items.length === 0) {
        catalogGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-slate-500">
                <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
                <p class="text-base font-semibold">No se encontraron componentes que coincidan.</p>
                <p class="text-xs mt-1">Prueba con palabras clave como 'ESP32', 'Relé' o 'Sensor'.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group";
        
        card.innerHTML = `
            <div>
                <div class="overflow-hidden relative h-48 bg-slate-900">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                </div>
                <div class="p-5">
                    <span class="text-xs font-semibold tracking-wider text-blue-400 uppercase">${item.category}</span>
                    <h2 class="text-lg font-bold mt-2 text-slate-100 line-clamp-1">${item.name}</h2>
                    <p class="text-sm text-slate-400 mt-2 line-clamp-2">${item.desc}</p>
                </div>
            </div>
            <div class="p-5 pt-0">
                <button onclick="openModal(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="w-full bg-slate-700 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                    Ver ficha técnica
                </button>
            </div>
        `;
        catalogGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}