document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // ============================================
  //   MENU PAGE + REKOMENDASI PAGE
  // ============================================
  if (path.includes("menu.html") || path.includes("rekomendasi.html")) {
    const tombolPesan = document.querySelectorAll(".btn-pesan");

    tombolPesan.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".menu-card");

        const nama = card.dataset.nama;
        const harga = parseInt(card.dataset.harga);

        // Ambil data pesanan dari localStorage
        let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
        if (!Array.isArray(pesanan)) pesanan = [];

        // Tambahkan item
        const item = pesanan.find((m) => m.nama === nama);
        if (item) {
          item.jumlah += 1;
        } else {
          pesanan.push({ nama, harga, jumlah: 1 });
        }

        // Simpan kembali
        localStorage.setItem("pesanan", JSON.stringify(pesanan));

        alert(`${nama} berhasil ditambahkan ke pesanan!`);
      });
    });

    // Tombol "Lihat Pesanan"
    const tombolLihat = document.querySelectorAll(".btn-lihat");
    tombolLihat.forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = "kontak.html";
      });
    });
  }

  // ============================================
  //                 KONTAK PAGE
  // ============================================
  else if (path.includes("kontak.html")) {
    const formPesan = document.getElementById("formPesan");
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");
    const catatanBox = document.getElementById("catatan");

    let pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

    function renderCart() {
      cartList.innerHTML = "";
      let totalHarga = 0;

      pesanan.forEach((p, index) => {
        const item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
        <div class="item-info">
          <h4>${p.nama}</h4>
          <p>Rp ${p.harga.toLocaleString()}</p>
        </div>

        <div class="qty-box">
          <button class="minus">-</button>
          <span>${p.jumlah}</span>
          <button class="plus">+</button>
          <button class="del-btn">🗑️</button>
        </div>
      `;

        item.querySelector(".plus").addEventListener("click", () => {
          p.jumlah++;
          updateCart();
        });

        item.querySelector(".minus").addEventListener("click", () => {
          if (p.jumlah > 1) {
            p.jumlah--;
          } else {
            pesanan.splice(index, 1);
          }
          updateCart();
        });

        item.querySelector(".del-btn").addEventListener("click", () => {
          pesanan.splice(index, 1);
          updateCart();
        });

        cartList.appendChild(item);

        totalHarga += p.harga * p.jumlah;
      });

      cartTotal.textContent = `Rp ${totalHarga.toLocaleString()}`;
      localStorage.setItem("pesanan", JSON.stringify(pesanan));
    }

    function updateCart() {
      renderCart();
    }

    renderCart();

    formPesan.addEventListener("submit", (e) => {
      e.preventDefault();

      const nama = document.getElementById("nama").value;
      const jenis = document.getElementById("jenis").value;
      const jumlah = document.getElementById("jumlah").value;
      const tanggal = document.getElementById("tanggal").value;
      const catatan = catatanBox.value;

      let pesanWA = `Halo! Saya ingin melakukan ${jenis}.\n\nNama: ${nama}\nJumlah orang/porsi: ${jumlah}\nTanggal: ${tanggal}\n\nPesanan:\n`;

      pesanan.forEach((p) => {
        pesanWA += `• ${p.nama} x${p.jumlah}\n`;
      });

      pesanWA += `\nCatatan:\n${catatan}`;

      const link = `https://wa.me/6285881280298?text=${encodeURIComponent(
        pesanWA
      )}`;

      window.open(link, "_blank");
      localStorage.removeItem("pesanan");
    });
  }
  // ============================================
  //                 TESTIMONI PAGE (DINAMIS)
  // ============================================
  else if (path.includes("testimoni.html")) {
    const reviewContainer = document.getElementById("reviewContainer");
    const paginationBox = document.querySelector(".pagination");
    const submitBtn = document.querySelector(".review-form button");

    // Default testimoni
    const defaultTestimoni = [
      {
        nama: "Ahmad Syaifullah",
        bulan: "June 2024",
        rating: 5,
        foto: "https://randomuser.me/api/portraits/men/32.jpg",
        isi: "Sangat enak! Bebek bumbu hitamnya juara…",
      },
      {
        nama: "Budi Santoso",
        bulan: "May 2024",
        rating: 5,
        foto: "https://randomuser.me/api/portraits/men/15.jpg",
        isi: "Rasa Madura paling otentik! Wajib coba…",
      },
      {
        nama: "Citra Lestari",
        bulan: "April 2024",
        rating: 5,
        foto: "https://randomuser.me/api/portraits/women/22.jpg",
        isi: "Bebek bumbu hitam terenak sejauh ini…",
      },
    ];

    // Testimoni user dari localStorage
    let userTesti = JSON.parse(localStorage.getItem("testimoniUser")) || [];

    // Gabungkan
    let semuaTestimoni = [...defaultTestimoni, ...userTesti];

    // Pagination
    const itemsPerPage = 3;
    let currentPage = 1;

    function generateStars(n) {
      return "★★★★★☆☆☆☆☆".slice(0, n);
    }

    function renderReviews() {
      reviewContainer.innerHTML = "";

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const list = semuaTestimoni.slice(start, end);

      list.forEach((t) => {
        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `
          <img src="${t.foto}" class="profile">
          <div class="review-content">
            <h4>${t.nama}</h4>
            <span>${t.bulan}</span>
            <p class="stars">${generateStars(t.rating)}</p>
            <p>${t.isi}</p>
          </div>
        `;

        reviewContainer.appendChild(card);
      });
    }

    function renderPagination() {
      paginationBox.innerHTML = "";
      const totalPages = Math.ceil(semuaTestimoni.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const span = document.createElement("span");
        span.className = "page";
        span.textContent = i;

        if (i === currentPage) span.classList.add("active");

        span.addEventListener("click", () => {
          currentPage = i;
          renderReviews();
          renderPagination();
        });

        paginationBox.appendChild(span);
      }
    }

    // Render pertama
    renderReviews();
    renderPagination();

    // ============= Tambah Ulasan =============
    submitBtn.addEventListener("click", () => {
      const nama = document.getElementById("nameInput").value.trim();
      const rating = parseInt(document.getElementById("ratingInput").value);
      const isi = document.getElementById("textInput").value.trim();

      if (!nama || !isi) {
        alert("Nama dan ulasan tidak boleh kosong!");
        return;
      }

      const bulan = new Date().toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      });

      const newReview = {
        nama,
        bulan,
        rating,
        isi,
        foto: "https://randomuser.me/api/portraits/lego/1.jpg",
      };

      userTesti.push(newReview);
      localStorage.setItem("testimoniUser", JSON.stringify(userTesti));

      semuaTestimoni = [...defaultTestimoni, ...userTesti];

      currentPage = 1;
      renderReviews();
      renderPagination();

      document.getElementById("nameInput").value = "";
      document.getElementById("textInput").value = "";

      alert("Ulasan berhasil ditambahkan!");
    });
  }
});
