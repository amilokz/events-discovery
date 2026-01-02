// Wait for the DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', function() {
    console.log('Event discovery page loaded!');
    
    // Get references to important elements
    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const resetSearch = document.getElementById('resetSearch');
    const eventCount = document.getElementById('eventCount');
    const loadingElement = document.getElementById('loading');
    const noResults = document.getElementById('noResults');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    // Store all events in memory
    let allEvents = [];
    
    // Show loading state
    function showLoading() {
        loadingElement.style.display = 'block';
        eventsGrid.innerHTML = '';
        noResults.style.display = 'none';
    }
    
    // Hide loading state
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('show');
        // Change icon based on state
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('show');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // Clear search input
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.focus();
        displayEvents(allEvents);
    });
    
    // Reset search (from no results message)
    resetSearch.addEventListener('click', function() {
        searchInput.value = '';
        displayEvents(allEvents);
    });
    
    // Search functionality - filter events as user types
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            displayEvents(allEvents);
            return;
        }
        
        // Filter events based on search term
        const filteredEvents = allEvents.filter(event => {
            // Check if search term matches event name, description, or location
            return event.name.toLowerCase().includes(searchTerm) ||
                   event.description.toLowerCase().includes(searchTerm) ||
                   event.location.toLowerCase().includes(searchTerm);
        });
        
        displayEvents(filteredEvents);
    });
    
    // Function to create an event card element
    function createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        // Create different icons for different event types
        let eventIcon = 'fa-calendar-alt'; // default
        
        if (event.type === 'music') {
            eventIcon = 'fa-music';
        } else if (event.type === 'workshop') {
            eventIcon = 'fa-chalkboard-teacher';
        } else if (event.type === 'food') {
            eventIcon = 'fa-utensils';
        } else if (event.type === 'sports') {
            eventIcon = 'fa-running';
        } else if (event.type === 'tech') {
            eventIcon = 'fa-laptop-code';
        }
        
        card.innerHTML = `
            <div class="event-image">
                <i class="fas ${eventIcon}"></i>
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.name}</h3>
                <div class="event-meta">
                    <div class="event-date">
                        <i class="far fa-calendar"></i>
                        ${event.date}
                    </div>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </div>
                </div>
                <p class="event-description">${event.description}</p>
                <button class="btn-register" onclick="handleRegister('${event.id}')">
                    <i class="fas fa-user-plus"></i> Register Now
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Display events in the grid
    function displayEvents(events) {
        // Clear current events
        eventsGrid.innerHTML = '';
        
        // Update event count
        eventCount.textContent = events.length;
        
        // If no events found, show no results message
        if (events.length === 0) {
            noResults.style.display = 'block';
            eventsGrid.style.display = 'none';
            return;
        }
        
        // Hide no results message
        noResults.style.display = 'none';
        eventsGrid.style.display = 'grid';
        
        // Create and append event cards
        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    }
    
    // Handle registration button click
    window.handleRegister = function(eventId) {
        // Find the event
        const event = allEvents.find(e => e.id === eventId);
        
        if (event) {
            // Show a simple alert for now
            alert(`Thank you for registering for: ${event.name}\n\nWe'll send you more details to your email.`);
            
            // In a real app, you would send this to a server
            console.log(`User registered for event: ${event.name}`);
            
            // Optional: Change button text/state
            const buttons = document.querySelectorAll('.btn-register');
            buttons.forEach(btn => {
                if (btn.onclick && btn.onclick.toString().includes(eventId)) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Registered!';
                    btn.style.backgroundColor = 'var(--success-color)';
                    btn.disabled = true;
                }
            });
        }
    };
    
    // Function to load events from our JSON data
    async function loadEvents() {
        showLoading();
        
        try {
            // In a real app, this would be a fetch to an API
            // For now, we'll simulate a network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Load events from our JSON data (we'll create this next)
            allEvents = getEventData();
            
            // Display all events initially
            displayEvents(allEvents);
            
            // Log success
            console.log(`Successfully loaded ${allEvents.length} events`);
            
        } catch (error) {
            // Handle errors gracefully
            console.error('Failed to load events:', error);
            eventsGrid.innerHTML = `
                <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>We couldn't load the events. Please try refreshing the page.</p>
                </div>
            `;
        } finally {
            hideLoading();
        }
    }
    
    // Function to get event data
    function getEventData() {
        // In a real app, this would come from an API or JSON file
        // For this project, we'll return hardcoded data
        return [
            {
                id: 'event1',
                name: 'Summer Music Festival',
                date: 'June 15, 2024 • 4:00 PM',
                location: 'Central Park',
                description: 'Join us for a day of live music featuring local bands and artists. Food trucks and art vendors will be on site.',
                type: 'music'
            },
            {
                id: 'event2',
                name: 'Web Development Workshop',
                date: 'June 22, 2024 • 10:00 AM',
                location: 'Tech Hub Downtown',
                description: 'Learn the basics of HTML, CSS, and JavaScript in this hands-on workshop. Perfect for beginners!',
                type: 'tech'
            },
            {
                id: 'event3',
                name: 'Food Truck Friday',
                date: 'June 28, 2024 • 5:00 PM',
                location: 'Main Street Square',
                description: 'Sample delicious food from 20+ local food trucks. Live music and family-friendly activities.',
                type: 'food'
            },
            {
                id: 'event4',
                name: 'Yoga in the Park',
                date: 'July 5, 2024 • 8:00 AM',
                location: 'Riverside Park',
                description: 'Start your weekend with a relaxing yoga session. All skill levels welcome. Bring your own mat.',
                type: 'sports'
            },
            {
                id: 'event5',
                name: 'Art & Wine Night',
                date: 'July 12, 2024 • 7:00 PM',
                location: 'Local Art Gallery',
                description: 'Create your own masterpiece while enjoying local wines. No artistic experience required!',
                type: 'workshop'
            }
        ];
    }
    
    // Initialize the page
    function init() {
        console.log('Initializing event discovery page...');
        
        // Load events
        loadEvents();
        
        // Set focus to search input
        searchInput.focus();
        
        // Add a welcome message in console
        console.log('Welcome to Event Discovery! Search for events using the search bar.');
    }
    
    // Start everything
    init();
});