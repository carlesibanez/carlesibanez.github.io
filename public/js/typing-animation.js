document.addEventListener('DOMContentLoaded', function() {
    const titles = ["Autonomous Systems Engineer", "Computer Vision Specialist", "AI Enthusiast"];
    let currentTitleIndex = 0;
    let isDeleting = false;
    let currentText = '';
    const typingSpeed = 50;
    const deletingSpeed = 50;
    const pauseAfterTyping = 1500;

    function typeText() {
        const displayElement = document.getElementById('typing-text');
        const fullTitle = titles[currentTitleIndex];

        if (isDeleting) {
            currentText = fullTitle.substring(0, currentText.length - 1);
        } else {
            currentText = fullTitle.substring(0, currentText.length + 1);
        }

        displayElement.textContent = currentText;

        if (!isDeleting && currentText === fullTitle) {
            setTimeout(() => isDeleting = true, pauseAfterTyping);
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(typeText, speed);
    }

    typeText();
});
