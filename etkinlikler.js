document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.event-card');

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("eventModal");
    const modalBody = document.getElementById("modalBody");
    const closeBtn = document.querySelector(".close-modal");

    // Etkinlik detayları
    const eventDetails = {
        "V60 Demleme Atölyesi": {
            img: "images/etkinlik-foto1.webp",
            text: "Bu atölyede, su sıcaklığından döküş hızına kadar V60 demlemenin tüm inceliklerini öğreneceksiniz. Katılımcılara etkinlik sonunda 250gr deneme paketi hediye edilecektir. Kontenjan 8 kişi ile sınırlıdır.",
            date: "12 Haziran - Saat: 14:00"
        },
        "Gece Jazzı": {
            img: "images/etkinlik-foto1.webp",
            text: "Yerel sanatçılarımızın performans sergileyeceği bu gecede, menümüze özel Jazz aromalı harmanlar eşlik edecek. Rezervasyon yaptırmanız önerilir.",
            date: "18 Haziran - Saat: 20:30"
        }
    };

    // Detaylar Butonu
    document.querySelectorAll('.event-btn').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.event-card');
            const title = card.querySelector('h3').innerText;
            const data = eventDetails[title];

            if (data) {
                modalBody.innerHTML = `
                    <img src="${data.img}" class="modal-detail-img">
                    <h2 class="modal-detail-title">${title}</h2>
                    <p style="color:var(--accent); font-weight:600; margin-bottom:10px;">${data.date}</p>
                    <p class="modal-detail-text">${data.text}</p>
                `;
                modal.style.display = "block";
            }
        });
    });

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }
});

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});