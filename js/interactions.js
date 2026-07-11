    import { state } from './theme.js';
import { translations } from './i18n.js';

export function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    navbar.style.boxShadow = window.scrollY > 20 ? "0 4px 30px rgba(0,0,0,0.4)" : "none";
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= (sec.offsetTop - 100)) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === current);
    });
  });

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("hidden");
  });
}

export function initSmoothScroll() {
  document.querySelectorAll(".scroll-link").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        const navH = document.getElementById("navbar").offsetHeight;
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
          window.scrollTo({ top, behavior: "smooth" });
        }
        document.getElementById("mobileMenu").classList.add("hidden");
      }
    });
  });
}

// contact.js
export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const msgError = document.getElementById('messageError');

  const submitBtn = document.getElementById('submitBtn');
  const successToast = document.getElementById('successToast');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Reset lỗi khi người dùng gõ lại
  const resetError = (input, errorEl) => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      if (errorEl) errorEl.classList.add('hidden');
    });
  };

  resetError(nameInput, nameError);
  resetError(emailInput, emailError);
  resetError(msgInput, msgError);

  // Khởi tạo EmailJS
  emailjs.init({
    publicKey: "e21jOODe993uBB72n",
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    let isValid = true;

    // === VALIDATION ===
    if (name.length < 2) {
      nameInput.classList.add('error');
      nameError.classList.remove('hidden');
      isValid = false;
    }

    if (!validateEmail(email)) {
      emailInput.classList.add('error');
      emailError.classList.remove('hidden');
      isValid = false;
    }

    if (message.length < 5) {
      msgInput.classList.add('error');
      msgError.classList.remove('hidden');
      isValid = false;
    }

    // Nếu có lỗi → DỪNG, không gửi
    if (!isValid) {
      return;
    }

    // === GỬI EMAIL (chỉ khi hợp lệ) ===
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    var templateParams = {
      contactName : document.getElementById('contactName').value,
      contactEmail : document.getElementById('contactEmail').value,
      contactMessage : document.getElementById('contactMessage').value,
    };

    emailjs.send('contact_naq', 'template_h10s0iw', templateParams)
      .then(() => {
        successToast.classList.remove('hidden');
        form.reset();
        setTimeout(() => successToast.classList.add('hidden'), 6000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        alert('Gửi email thất bại. Vui lòng thử lại sau.');
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  });
}