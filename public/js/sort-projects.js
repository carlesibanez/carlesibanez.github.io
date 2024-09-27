let currentSort = 'date';  // Initially sorted by date
    
    function sortProjects(criteria) {
        const projectsContainer = document.querySelector('.projects-container');
        const projectCards = Array.from(projectsContainer.getElementsByClassName('project-card'));

        // Sort by either title or date
        if (criteria === 'title') {
            projectCards.sort((a, b) => {
                const titleA = a.getAttribute('data-title').toLowerCase();
                const titleB = b.getAttribute('data-title').toLowerCase();
                return titleA.localeCompare(titleB);
            });
        } else if (criteria === 'date') {
            projectCards.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));
                return dateB - dateA;  // Newest first
            });
        }

        // Clear the container and append sorted cards
        projectsContainer.innerHTML = '';
        projectCards.forEach(card => projectsContainer.appendChild(card));

        // Update the button to toggle sorting method
        if (currentSort === 'date') {
            currentSort = 'title';
            document.getElementById('sort-button').innerText = 'Sort by Title';
        } else {
            currentSort = 'date';
            document.getElementById('sort-button').innerText = 'Sort by Date';
        }
    }