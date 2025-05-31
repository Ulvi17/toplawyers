// Google Sheets configuration
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv7rv_TFjvRey0KGy46KoarQqHdRnsnrGesyQ_nknaPraV9Pl-7H0c9LNhc4ZBmBDiyJDHH2XQLeHa/pub?output=csv';

// Global variables
let lawyersData = [];
let filteredLawyers = [];
let selectedLanguages = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const experienceFilter = document.getElementById('experienceFilter');
const practiceAreaFilter = document.getElementById('practiceAreaFilter');
const languageFilters = document.querySelectorAll('.language-filter');
const clearFiltersBtn = document.getElementById('clearFilters');
const lawyersGrid = document.getElementById('lawyersGrid');
const resultsCount = document.getElementById('resultsCount');
const modal = document.getElementById('lawyerModal');
const closeModalBtn = document.getElementById('closeModal');

// Data parsing functions
function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function parseGoogleSheetsData(csvText) {
    const lines = csvText.split('\n');
    const headers = parseCSVRow(lines[0]);
    
    return lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
            const values = parseCSVRow(line);
            const lawyer = {};
            
            headers.forEach((header, i) => {
                lawyer[header.toLowerCase().replace(/\s+/g, '_')] = values[i] || '';
            });
            
            // Transform data to match our application structure
            return {
                id: index + 1,
                name: lawyer.title || 'Unknown',
                type: lawyer.type || 'Legal Firm',
                experience: parseExperience(lawyer.experience),
                budget: parseBudget(lawyer.price),
                phone: lawyer.phone || extractPhone(lawyer.url || ''),
                email: lawyer.email || extractEmail(lawyer.url || ''),
                url: lawyer.url || '',
                languages: parseLanguages(lawyer.languages),
                practiceAreas: parsePracticeAreas(lawyer.spheres, lawyer.legal_work),
                notableCase: lawyer.punchline || lawyer.text || 'Experienced legal professional.',
                image: lawyer.logourl || getDefaultLogo(lawyer.type),
                description: lawyer.text || 'Professional legal services.',
                freeConsultation: lawyer.freeconsulation && lawyer.freeconsulation.toLowerCase() === 'yes'
            };
        });
}

function parseExperience(experienceStr) {
    if (!experienceStr) return '5-10';
    
    // Handle various experience formats
    if (experienceStr.includes('15+') || experienceStr.includes('15 +')) return '15+';
    if (experienceStr.includes('10+') || experienceStr.includes('10 +')) return '10-15';
    if (experienceStr.includes('5-10')) return '5-10';
    if (experienceStr.includes('3-5')) return '3-5';
    if (experienceStr.includes('0-2')) return '0-2';
    
    // Default to 5-10 if unclear
    return '5-10';
}

function parseBudget(priceStr) {
    if (!priceStr) return 3;
    
    const dollarCount = (priceStr.match(/\$/g) || []).length;
    return Math.max(1, Math.min(5, dollarCount));
}

function parseLanguages(languageStr) {
    if (!languageStr) return ['EN'];
    
    const languages = [];
    if (languageStr.includes('🇺🇸') || languageStr.includes('🇬🇧') || languageStr.toLowerCase().includes('en')) {
        languages.push('EN');
    }
    if (languageStr.includes('🇦🇿') || languageStr.toLowerCase().includes('az')) {
        languages.push('AZ');
    }
    if (languageStr.includes('🇷🇺') || languageStr.toLowerCase().includes('ru')) {
        languages.push('RU');
    }
    
    return languages.length > 0 ? languages : ['EN'];
}

function parsePracticeAreas(spheres, legalWork) {
    const areas = new Set();
    
    // Parse spheres and legal work fields
    const combinedText = `${spheres || ''} ${legalWork || ''}`.toLowerCase();
    
    // Map practice areas
    if (combinedText.includes('tax') || combinedText.includes('finance')) areas.add('Tax Law');
    if (combinedText.includes('ip') || combinedText.includes('intellectual') || combinedText.includes('trademark')) areas.add('IP Law');
    if (combinedText.includes('corporate') || combinedText.includes('m&a') || combinedText.includes('commercial')) areas.add('Corporate Law');
    if (combinedText.includes('family') || combinedText.includes('custody')) areas.add('Family Law');
    if (combinedText.includes('criminal')) areas.add('Criminal Law');
    if (combinedText.includes('real estate') || combinedText.includes('property')) areas.add('Real Estate Law');
    if (combinedText.includes('migration') || combinedText.includes('immigration')) areas.add('Immigration Law');
    if (combinedText.includes('labor') || combinedText.includes('employment')) areas.add('Labor Law');
    if (combinedText.includes('environmental')) areas.add('Environmental Law');
    if (combinedText.includes('energy')) areas.add('Energy Law');
    
    const result = Array.from(areas);
    return result.length > 0 ? result : ['Corporate Law'];
}

function extractPhone(url) {
    // Generate a sample phone based on the firm
    const phones = [
        '+994 12 123 45 67',
        '+994 50 123 45 67',
        '+994 55 123 45 67',
        '+994 51 123 45 67',
        '+994 70 123 45 67'
    ];
    return phones[Math.floor(Math.random() * phones.length)];
}

function extractEmail(url) {
    if (url.includes('@')) {
        // Extract email if present in URL
        const emailMatch = url.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) return emailMatch[1];
    }
    
    // Generate email from domain
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return `info@${domain}`;
    } catch {
        return 'info@example.com';
    }
}

function getDefaultLogo(type) {
    const defaultLogos = {
        'Legal Firm': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&h=150&fit=crop',
        'International Legal Firm': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=150&h=150&fit=crop',
        'Freelancer': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    };
    return defaultLogos[type] || defaultLogos['Legal Firm'];
}

// Fetch data from Google Sheets
async function fetchLawyersData() {
    try {
        showLoadingState();
        
        const response = await fetch(GOOGLE_SHEETS_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const csvText = await response.text();
        lawyersData = parseGoogleSheetsData(csvText);
        
        // Limit to 15 lawyers to prevent overwhelming the page
        lawyersData = lawyersData.slice(0, 15);
        
        filteredLawyers = [...lawyersData];
        
        hideLoadingState();
        renderLawyers();
        
        console.log('Loaded lawyers:', lawyersData.length);
        
    } catch (error) {
        console.error('Error fetching lawyers data:', error);
        hideLoadingState();
        showErrorState();
    }
}

function showLoadingState() {
    lawyersGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Loading lawyers...</h3>
            <p class="text-gray-600">Please wait while we fetch the latest data.</p>
        </div>
    `;
}

function hideLoadingState() {
    // Loading state will be replaced by actual content
}

function showErrorState() {
    lawyersGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Unable to load data</h3>
            <p class="text-gray-600 mb-4">There was an error loading the lawyers database.</p>
            <button onclick="fetchLawyersData()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Try Again
            </button>
        </div>
    `;
}

// Utility functions
function getBudgetDisplay(budget) {
    return '$'.repeat(budget) + '<span class="text-gray-300">' + '$'.repeat(5 - budget) + '</span>';
}

function getExperienceCategory(experience) {
    const experienceMap = {
        '0-2': '0-2 years',
        '3-5': '3-5 years',
        '5-10': '5-10 years',
        '10-15': '10-15 years',
        '15+': '15+ years'
    };
    return experienceMap[experience] || experience;
}

function getLanguageFlag(lang) {
    const flags = {
        'EN': '🇺🇸',
        'AZ': '🇦🇿',
        'RU': '🇷🇺'
    };
    return flags[lang] || '';
}

// Render functions
function renderLawyerCard(lawyer) {
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative" 
             onclick="openLawyerModal(${lawyer.id})">
            ${lawyer.freeConsultation ? `
                <div class="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                    Free Consultation
                </div>
            ` : ''}
            <div class="p-6">
                <div class="flex items-center space-x-4 mb-4">
                    <img src="${lawyer.image}" alt="${lawyer.name}" 
                         class="w-16 h-16 rounded-full object-cover"
                         onerror="this.src='https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&h=150&fit=crop'">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900">${lawyer.name}</h3>
                        <p class="text-primary text-sm font-medium">${lawyer.type}</p>
                        <p class="text-gray-600 text-sm">${getExperienceCategory(lawyer.experience)} experience</p>
                        ${lawyer.freeConsultation ? `
                            <div class="flex items-center mt-1">
                                <i class="fas fa-gift text-green-500 text-xs mr-1"></i>
                                <span class="text-green-600 text-xs font-medium">Free Consultation Available</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Budget Range:</span>
                        <div class="flex items-center">${getBudgetDisplay(lawyer.budget)}</div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-600">Languages:</span>
                        <div class="flex space-x-1">
                            ${lawyer.languages.map(lang => `
                                <span class="text-sm">${getLanguageFlag(lang)}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <p class="text-sm text-gray-600 mb-2">Practice Areas:</p>
                        <div class="flex flex-wrap gap-1">
                            ${lawyer.practiceAreas.slice(0, 3).map(area => `
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${area}</span>
                            `).join('')}
                            ${lawyer.practiceAreas.length > 3 ? `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+${lawyer.practiceAreas.length - 3}</span>` : ''}
                        </div>
                    </div>
                    
                    <button class="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderLawyers() {
    if (filteredLawyers.length === 0) {
        lawyersGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
                <p class="text-gray-600">Try adjusting your search criteria or clear filters to see more results.</p>
            </div>
        `;
    } else {
        lawyersGrid.innerHTML = filteredLawyers.map(lawyer => renderLawyerCard(lawyer)).join('');
    }
    
    updateResultsCount();
}

function updateResultsCount() {
    const count = filteredLawyers.length;
    resultsCount.textContent = `Showing ${count} lawyer${count !== 1 ? 's' : ''}`;
}

// Filter functions
function applyFilters() {
    filteredLawyers = lawyersData.filter(lawyer => {
        // Search filter
        const searchTerm = searchInput.value.toLowerCase();
        const matchesSearch = !searchTerm || 
            lawyer.name.toLowerCase().includes(searchTerm) ||
            lawyer.practiceAreas.some(area => area.toLowerCase().includes(searchTerm)) ||
            lawyer.type.toLowerCase().includes(searchTerm);
        
        // Type filter
        const selectedType = typeFilter.value;
        const matchesType = !selectedType || lawyer.type === selectedType;
        
        // Experience filter
        const selectedExperience = experienceFilter.value;
        const matchesExperience = !selectedExperience || lawyer.experience === selectedExperience;
        
        // Practice area filter
        const selectedPracticeArea = practiceAreaFilter.value;
        const matchesPracticeArea = !selectedPracticeArea || 
            lawyer.practiceAreas.includes(selectedPracticeArea);
        
        // Language filter
        const matchesLanguage = selectedLanguages.length === 0 ||
            selectedLanguages.every(lang => lawyer.languages.includes(lang));
        
        // Free consultation filter
        const freeConsultationFilter = document.getElementById('freeConsultationFilter');
        const matchesFreeConsultation = !freeConsultationFilter.checked || lawyer.freeConsultation;
        
        return matchesSearch && matchesType && matchesExperience && 
               matchesPracticeArea && matchesLanguage && matchesFreeConsultation;
    });
    
    renderLawyers();
}

function clearAllFilters() {
    searchInput.value = '';
    typeFilter.value = '';
    experienceFilter.value = '';
    practiceAreaFilter.value = '';
    selectedLanguages = [];
    
    // Reset free consultation filter
    const freeConsultationFilter = document.getElementById('freeConsultationFilter');
    if (freeConsultationFilter) {
        freeConsultationFilter.checked = false;
    }
    
    // Reset language filter buttons
    languageFilters.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('border-gray-300', 'hover:bg-gray-50');
    });
    
    applyFilters();
}

// Modal functions
function openLawyerModal(lawyerId) {
    const lawyer = lawyersData.find(l => l.id === lawyerId);
    if (!lawyer) return;
    
    // Populate modal content
    document.getElementById('modalName').textContent = lawyer.name;
    document.getElementById('modalType').textContent = lawyer.type;
    document.getElementById('modalExperience').textContent = `${getExperienceCategory(lawyer.experience)} experience`;
    document.getElementById('modalBudget').innerHTML = getBudgetDisplay(lawyer.budget);
    document.getElementById('modalPhone').innerHTML = `<i class="fas fa-phone mr-2 text-primary"></i>${lawyer.phone}`;
    document.getElementById('modalEmail').innerHTML = `<i class="fas fa-envelope mr-2 text-primary"></i>${lawyer.email}`;
    document.getElementById('modalNotableCase').textContent = lawyer.notableCase || lawyer.description;
    document.getElementById('modalImage').src = lawyer.image;
    document.getElementById('modalImage').alt = lawyer.name;
    
    // Practice areas
    const practiceAreasDiv = document.getElementById('modalPracticeAreas');
    practiceAreasDiv.innerHTML = lawyer.practiceAreas.map(area => `
        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">${area}</span>
    `).join('');
    
    // Languages
    const languagesDiv = document.getElementById('modalLanguages');
    languagesDiv.innerHTML = lawyer.languages.map(lang => `
        <span class="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-md">
            <span>${getLanguageFlag(lang)}</span>
            <span class="text-sm">${lang}</span>
        </span>
    `).join('');
    
    // Update action buttons based on lawyer type
    const actionButtonsDiv = document.getElementById('modalActionButtons');
    let buttonHTML = '';
    
    if (lawyer.type === 'Freelancer') {
        // For freelancers: WhatsApp + LinkedIn buttons
        const whatsappNumber = lawyer.phone.replace(/[^\d]/g, ''); // Remove non-digits
        const linkedinUrl = lawyer.url;
        
        buttonHTML = `
            <div class="grid grid-cols-1 gap-3">
                <button onclick="openWhatsApp('${whatsappNumber}', '${lawyer.name}')" 
                        class="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center">
                    <i class="fab fa-whatsapp mr-2 text-lg"></i>Chat on WhatsApp
                </button>
                ${linkedinUrl ? `
                    <button onclick="window.open('${linkedinUrl}', '_blank')" 
                            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <i class="fab fa-linkedin mr-2"></i>View LinkedIn Profile
                    </button>
                ` : ''}
            </div>
        `;
    } else {
        // For law firms: Visit website button
        const websiteUrl = lawyer.url;
        buttonHTML = `
            <button onclick="window.open('${websiteUrl}', '_blank')" 
                    class="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                <i class="fas fa-external-link-alt mr-2"></i>Visit Website
            </button>
        `;
    }
    
    actionButtonsDiv.innerHTML = buttonHTML;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// WhatsApp function
function openWhatsApp(phoneNumber, lawyerName) {
    const message = encodeURIComponent(`Hello ${lawyerName}, I found your profile on TopLawyers and I'm interested in your legal services. Could we discuss my case?`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function closeLawyerModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// FAQ functionality
function initializeFAQ() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('i');
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Form submission
function initializeForm() {
    const form = document.getElementById('submitServicesForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show success message
        alert('Thank you for your application! We will review your submission and get back to you within 2-3 business days.');
        
        // Reset form
        form.reset();
    });
}

// Event listeners
function initializeEventListeners() {
    // Search and filter events
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    experienceFilter.addEventListener('change', applyFilters);
    practiceAreaFilter.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Free consultation filter
    const freeConsultationFilter = document.getElementById('freeConsultationFilter');
    if (freeConsultationFilter) {
        freeConsultationFilter.addEventListener('change', applyFilters);
    }
    
    // Language filter events
    languageFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            
            if (selectedLanguages.includes(lang)) {
                // Remove language
                selectedLanguages = selectedLanguages.filter(l => l !== lang);
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('border-gray-300', 'hover:bg-gray-50');
            } else {
                // Add language
                selectedLanguages.push(lang);
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('border-gray-300', 'hover:bg-gray-50');
            }
            
            applyFilters();
        });
    });
    
    // Modal events
    closeModalBtn.addEventListener('click', closeLawyerModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLawyerModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeLawyerModal();
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchLawyersData();
    initializeEventListeners();
    initializeFAQ();
    initializeForm();
});

// Make functions available globally
window.openLawyerModal = openLawyerModal;
window.fetchLawyersData = fetchLawyersData;
window.openWhatsApp = openWhatsApp; 