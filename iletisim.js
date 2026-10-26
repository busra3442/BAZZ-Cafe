document.addEventListener('DOMContentLoaded', () => {
    
    const leftPanel = document.querySelector('.reveal-left');
    const rightPanel = document.querySelector('.reveal-right');
    
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });


    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.submit-btn');
        const btnText = btn.querySelector('.btn-text');
        
        btn.style.pointerEvents = "none";
        btnText.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

        setTimeout(() => {
            btn.style.background = "#2ecc71";
            btnText.innerHTML = '<i class="fas fa-check"></i> Gönderildi!';
            
            contactForm.reset();

            setTimeout(() => {
                btn.style.background = "";
                btnText.innerHTML = "Gönder";
                btn.style.pointerEvents = "all";
            }, 3000);
        }, 2000);
    });
});

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});