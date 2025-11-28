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
    const pesananBox = document.getElementById("pesanan");
    const catatanBox = document.getElementById("catatan");

    const pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
    if (Array.isArray(pesanan) && pesanan.length > 0 && pesananBox) {
      const daftarPesanan = pesanan
        .map((p) => `${p.nama} x${p.jumlah} (Rp${p.harga * p.jumlah})`)
        .join("\n");

      pesananBox.value = daftarPesanan;
    }

    // Submit → kirim ke WhatsApp
    if (formPesan) {
      formPesan.addEventListener("submit", (e) => {
        e.preventDefault();

        const nama = document.getElementById("nama").value;
        const jenis = document.getElementById("jenis").value;
        const jumlah = document.getElementById("jumlah").value;
        const tanggal = document.getElementById("tanggal").value;

        const pesananText = pesananBox ? pesananBox.value : "";
        const catatanText = catatanBox ? catatanBox.value : "";

        const pesan = `Halo! Saya ingin melakukan ${jenis}.\n\nNama: ${nama}\nJumlah: ${jumlah}\nTanggal: ${tanggal}\nPesanan:\n${pesananText}\n\nCatatan tambahan:\n${catatanText}`;

        const url = `https://wa.me/6285881280298?text=${encodeURIComponent(
          pesan
        )}`;

        // Hapus pesanan setelah terkirim
        localStorage.removeItem("pesanan");

        window.open(url, "_blank");
      });
    }
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
