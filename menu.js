/* ─────────────────────────────────────────
   Bazz Café — main.js
   Performans öncelikleri:
   1. DocumentFragment ile tek seferinde DOM yazımı (reflow yok)
   2. IntersectionObserver ile gerçek lazy load
   3. Kategori geçişinde observer temizlenir
   4. Görsel skeleton — layout shift yok
   5. requestAnimationFrame ile scroll zamanlaması
───────────────────────────────────────── */

const products = {
    "tatlilar": [
        { name: "Medovik", desc: "Sekiz ince katmanlı bal keki ve hafif krema.", price: "₺340", img: "menu-images/medovik.webp" },
        { name: "San Sebastian", desc: "Akışkan dokulu çikolata soslu özel cheesecake.", price: "₺360", img: "menu-images/sebastian.webp" },
        { name: "Brownie", desc: "Belçika çikolatalı, yoğun ve yumuşak tat.", price: "₺320", img: "menu-images/brownie.webp" },
        { name: "Crème Brûlée", desc: "Karamelize şekerli Fransız tatlısı.", price: "₺250", img: "menu-images/creme.webp" },
        { name: "Tiramisu", desc: "Espresso aromalı, gerçek maskarpone peynirli.", price: "₺320", img: "menu-images/tiramisu.webp" },
        { name: "Lotuslu Cheesecake", desc: "Lotus Biscoff aromalı, karamelize lezzet.", price: "₺270", img: "menu-images/lotus.webp" },
        { name: "Çikolatalı Kruvasan", desc: "El açması çıtır katlar, yoğun çikolata dolgusu.", price: "₺340", img: "menu-images/ciKruvasan.webp" },
        { name: "Çilekli Kruvasan", desc: "Mevsim çilekleri ile ferah ve çıtır bir dokunuş.", price: "₺340", img: "menu-images/cKruvasan.webp" },
        { name: "Special Kruvasan", desc: "Mevsimsel malzemelerle hazırlanan imza lezzet.", price: "₺360", img: "menu-images/sKruvasan.webp" },
        { name: "Waffle", desc: "Taze meyveler ve Belçika çikolatası eşliğinde.", price: "₺360", img: "menu-images/waffle.webp" },
    ],
    "sicak-kahveler": [
        { name: "Latte", desc: "Single shot espresso, bol buharlanmış süt ve hafif süt köpüğü.", price: "₺180", img: "menu-images/latte.webp" },
        { name: "Americano", desc: "Çift shot espresso üzerine eklenen sıcak su ile yumuşak içim.", price: "₺180", img: "menu-images/americano.webp" },
        { name: "Cappuccino", desc: "Eşit oranda espresso, sıcak süt ve yoğun kıvamlı süt köpüğü.", price: "₺190", img: "menu-images/cappucino.webp" },
        { name: "Flat White", desc: "Double shot ristretto espresso üzerine pürüzsüz mikro süt köpüğü.", price: "₺200", img: "menu-images/flat.webp" },
        { name: "Cortado", desc: "Eşit miktarda espresso ve sıcak sütün pürüzsüz dengesi.", price: "₺200", img: "menu-images/cortado.webp" },
        { name: "Mocha", desc: "Espresso, çikolata sosu ve sıcak sütün tatlı buluşması.", price: "₺250", img: "menu-images/mocha.webp" },
        { name: "Spanish Latte", desc: "Espresso, sıcak süt ve yoğunlaştırılmış tatlı süt (condensed milk).", price: "₺270", img: "menu-images/spanish.webp" },
        { name: "Red Eye", desc: "Günlük taze demlenmiş filtre kahve üzerine eklenen tek shot espresso.", price: "₺230", img: "menu-images/red.webp" },
        { name: "Türk Kahvesi", desc: "İnce çekilmiş nitelikli kahve çekirdekleri, geleneksel bakır cezve sunumu.", price: "₺130", img: "menu-images/turk.webp" },
        { name: "Espresso", desc: "Basınçla demlenmiş, yoğun gövdeli ve zengin kremalı saf kahve.", price: "₺65", img: "menu-images/espresso.webp" },
        { name: "Filtre Kahve", desc: "Özel seçilmiş çekirdeklerden, damlama yöntemiyle taze demlenmiş klasik.", price: "₺180", img: "menu-images/filtre.webp" }

    ],
    "soguk-kahveler": [
        { name: "Iced Latte", desc: "Bol buz, soğuk süt ve double shot espressonun ferahlatıcı uyumu.", price: "₺180", img: "menu-images/ilatte.webp" },
        { name: "Iced Americano", desc: "Buzlu su üzerine eklenen double shot espresso ile sert ve soğuk içim.", price: "₺180", img: "menu-images/iamericano.webp" },
        { name: "Cold Brew", desc: "Özel harman çekirdeklerin 12 saat boyunca soğuk suyla damıtılmış pürüzsüz tadı.", price: "₺220", img: "menu-images/cold.webp" },
        { name: "Iced Matcha Latte", desc: "A kalite seremonyal matcha tozunun soğuk süt ve buzla buluşması.", price: "₺240", img: "menu-images/matcha.webp" },
        { name: "Iced Strawberry Matcha Latte", desc: "Taze çilek püresi, matcha ve soğuk sütün katmanlı lezzeti.", price: "₺260", img: "menu-images/sMatcha.webp" },
        { name: "Frappe", desc: "Özel kahve karışımı, süt ve buzun kar haline gelene kadar karıştırılmış dokusu.", price: "₺220", img: "menu-images/frappe.webp" },
        { name: "Affogato", desc: "Yoğun espressonun, soğuk vanilyalı dondurma üzerindeki eşsiz dokunuşu.", price: "₺230", img: "menu-images/affagato.webp" },
        { name: "Iced Spanish Latte", desc: "Espresso, buz ve soğuk sütün yoğunlaştırılmış tatlı sütle dengesi.", price: "₺270", img: "menu-images/ıspanish.webp" },
        { name: "Iced Red Eye", desc: "Soğuk demlenmiş filtre kahve üzerine eklenen ekstra shot espresso ve buz.", price: "₺230", img: "menu-images/ired.webp" }
    ],
    "sicak-icecekler": [
        { name: "Çay", desc: "Doğu Karadeniz'in en seçkin yapraklarından taze demlenmiş geleneksel lezzet.", price: "₺40", img: "menu-images/cay3.webp" },
        { name: "Sıcak Çikolata", desc: "Eritilmiş gerçek Belçika çikolatası ve sıcak sütün yoğun kıvamlı buluşması.", price: "₺200", img: "menu-images/cikolata.webp" },
        { name: "Salep", desc: "Hakiki dağ salebi, süt ve üzerine serpilen taze çekilmiş toz tarçın.", price: "₺180", img: "menu-images/salep.webp" },
        { name: "Kış Çayı", desc: "Kuşburnu, hibiskus, adaçayı, kurutulmuş elma ve çubuk tarçın karışımı.", price: "₺160", img: "menu-images/kcayi.webp" },
        { name: "Yeşil Çay", desc: "Hafif içimli, antioksidan deposu kaliteli yeşil çay yaprakları.", price: "₺160", img: "menu-images/ycayi.webp" },
        { name: "Nane Limon Çayı", desc: "Taze nane yaprakları, kurutulmuş limon dilimleri ve ferahlatıcı bitki harmanı.", price: "₺200", img: "menu-images/ncayi.webp" }
    ],
    "soguk-icecekler": [
        { name: "Limonata", desc: "Taze nane yaprakları ve gerçek limon parçalarıyla hazırlanan ferahlatıcı lezzet.", price: "₺160", img: "menu-images/limonata.webp" },
        { name: "Frozen Orange Mango", desc: "Portakal ve tropikal mango püresinin buzla harmanlandığı yoğun kıvamlı serinlik.", price: "₺180", img: "menu-images/orange.webp" },
        { name: "Berry Hibiscus", desc: "Hibiskus çayı ve orman meyvelerinin doğal aromasıyla hazırlanan antioksidan deposu.", price: "₺180", img: "menu-images/berry.webp" },
        { name: "Berry Hibiscus Bubble Tea", desc: "Orman meyveli hibiskus çayı ve ağızda dağılan meyve dolgulu baloncuklar.", price: "₺180", img: "menu-images/bubble1.webp" },
        { name: "Dragon Lime Bubble Tea", desc: "Ejder meyvesi ve misket limonu aromasına eşlik eden keyifli tapiyoka incileri.", price: "₺180", img: "menu-images/bubble2.webp" },
        { name: "Mango Bubble Tea", desc: "Egzotik mango aroması ve özel meyveli baloncuklarla zenginleştirilmiş soğuk çay.", price: "₺180", img: "menu-images/bubble3.webp" },
        { name: "Cool Lime", desc: "Nane ve misket limonu özlerinin birleştiği, günün her saati ferahlatan hafif içim.", price: "₺95", img: "menu-images/cool.webp" },
        { name: "Soda", desc: "Doğal mineralli ve yüksek asitli, ferahlatıcı sade maden suyu.", price: "₺85", img: "menu-images/soda.webp" },
        { name: "Kola", desc: "Buz gibi servis edilen, klasikleşmiş vazgeçilmez soğuk içecek.", price: "₺85", img: "menu-images/kola.webp" },
        { name: "Fanta", desc: "Bol portakal aromalı, enerjik ve meyveli asitli içecek.", price: "₺85", img: "menu-images/fanta.webp" },
        { name: "Su", desc: "Doğal kaynaklardan gelen, serinletici ve saf içme suyu.", price: "₺85", img: "menu-images/su.webp" },
    ]
};

const detailSection = document.getElementById("category-detail-section");
const titleEl = document.getElementById("category-detail-title");
const productGrid = document.getElementById("product-grid");
const backBtn = document.getElementById("back-to-cats");
const categoriesSection = document.getElementById("categories-section");

/* Aktif observer referansı — kategori değişince disconnect edilir */
let activeObserver = null;

/* ─────────────────────────────────────────
   IntersectionObserver factory
   rootMargin: 200px — kart görünmeden 200px
   önce yüklemeye başlar, kullanıcı kasma
   hissetmez.
───────────────────────────────────────── */
function makeLazyObserver() {
    return new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
            obs.unobserve(img);
        });
    }, { rootMargin: "200px 0px", threshold: 0 });
}

/* ─────────────────────────────────────────
   Tek ürün kartı oluşturur.
   - Görsel: data-src (observer tetikleyene kadar boş)
   - Skeleton div: görsel yüklenince kaldırılır
   - width/height attribute: CLS sıfır
───────────────────────────────────────── */
function buildCard(product, index, category) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = category;
    card.style.animationDelay = index < 8 ? `${index * 0.055}s` : "0s";

    /* Görsel alanı */
    const imgWrap = document.createElement("div");
    imgWrap.className = "product-img-wrap";

    const skeleton = document.createElement("div");
    skeleton.className = "img-skeleton";

    const img = document.createElement("img");
    img.dataset.src = product.img;   /* observer src'yi buradan alır */
    img.alt = product.name;
    img.width = 400;
    img.height = 160;
    img.decoding = "async";
    img.addEventListener("load", () => { skeleton.remove(); img.classList.add("img-loaded"); }, { once: true });
    img.addEventListener("error", () => { skeleton.classList.add("img-error"); }, { once: true });

    const overlay = document.createElement("div");
    overlay.className = "product-img-overlay";

    imgWrap.append(skeleton, img, overlay);

    /* Metin içeriği */
    const content = document.createElement("div");
    content.className = "product-content";
    /* innerHTML sadece güvenilir statik veriye — XSS riski yok */
    content.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-bottom">
            <span class="product-price">${product.price}</span>
        </div>`;

    card.append(imgWrap, content);
    return card;
}

/* ─────────────────────────────────────────
   Kategori kartı tıklaması
───────────────────────────────────────── */
document.querySelectorAll(".cat-card, .cat-card--wide").forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;
        const list = products[category];
        if (!list) return;

        /* Önceki lazy observer kapat */
        if (activeObserver) { activeObserver.disconnect(); activeObserver = null; }

        titleEl.textContent = card.querySelector(".cat-name").innerText;

        /* DocumentFragment — tüm kartlar tek seferde DOM'a eklenir,
           her kart için ayrı reflow tetiklenmez */
        const frag = document.createDocumentFragment();
        list.forEach((p, i) => frag.appendChild(buildCard(p, i, category)));
        productGrid.replaceChildren(frag);

        /* Yeni observer kur ve tüm görselleri izle */
        activeObserver = makeLazyObserver();
        productGrid.querySelectorAll("img[data-src]").forEach(img => activeObserver.observe(img));

        detailSection.style.display = "block";

        /* Scroll'u paint sonrasına ertele — ani titreme önlenir */
        requestAnimationFrame(() =>
            detailSection.scrollIntoView({ behavior: "smooth", block: "start" })
        );
    });
});

/* ── Geri butonu ── */
backBtn.addEventListener("click", () => {
    if (activeObserver) { activeObserver.disconnect(); activeObserver = null; }
    detailSection.style.display = "none";
    requestAnimationFrame(() =>
        categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" })
    );
});

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});