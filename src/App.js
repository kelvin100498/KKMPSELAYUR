import React, { useEffect, useState } from 'react';
import './App.css';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import logo2 from './asset/logo2.png';
import strukturImage from './asset/strukturOrganisasi.png';
import kemenkop from './asset/kemenkop.png';
import palembangLogo from './asset/palembangLogo.png';
import logoKementrianDesa from './asset/kementrianDesa.png';
import logoSeiSelayur from './asset/logoSeiSelayur.png';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('produk');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15; // 🔥 sekarang 15 item per halaman
  const [runningTexts, setRunningTexts] = useState([]);

  const SHEET_URL =
    'https://script.google.com/macros/s/AKfycbx4hJsNeTHgEnk8nGmrzEGMHBooqvfxOK4Z2izDYBSwL9-jlXX3pSC0wZq9ivc4oH6S/exec';

  useEffect(() => {
    // Mulai fetch data segera
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const texts = data
          .map((item) => item.running_text)
          .filter((txt) => txt && txt.trim() !== '');
        setRunningTexts(texts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal fetch data:', err);
        setLoading(false);
      });

    // Timer untuk splash screen tetap 2.5 detik
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung data per halaman
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const separator = '\u00A0'.repeat(30) + '  ' + '\u00A0'.repeat(60);

  if (showSplash) {
    return (
      <motion.div
        className='splash-screen'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <motion.img
          src={logoSeiSelayur}
          alt='Logo'
          className='splash-logo'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        {/* <motion.h2
          className='splash-text'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          Koperasi Kelurahan Merah Putih
          <br />
          Sungaiselayur
        </motion.h2> */}
      </motion.div>
    );
  }

  return (
    <div className='app'>
      {/* Navbar */}
      <nav className='navbar'>
        <div className='navbar-left'>
          <img
            src={logoSeiSelayur}
            alt='Logo Koperasi'
            className='navbar-logo'
          />
          <div className='logo'>
            <div className='logo-title'>Koperasi Kelurahan Merah Putih</div>
            <div className='logo-subtitle'>Sungaiselayur</div>
          </div>
        </div>

        <div className='menu'>
          <button
            className={activeTab === 'produk' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('produk')}
          >
            Produk
          </button>
          <button
            className={
              activeTab === 'organisasi' ? 'nav-btn active' : 'nav-btn'
            }
            onClick={() => setActiveTab('organisasi')}
          >
            Susunan Organisasi
          </button>
          <button
            className={activeTab === 'visi' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('visi')}
          >
            Visi & Misi
          </button>
        </div>
      </nav>

      {activeTab === 'produk' && runningTexts.length > 0 && (
        <div className='running-text'>
          <marquee behavior='scroll' direction='left' scrollamount='5'>
            {runningTexts.join(separator)}
          </marquee>
        </div>
      )}

      {/* Konten utama dengan animasi */}
      <div className='content'>
        <AnimatePresence mode='wait'>
          {activeTab === 'produk' && (
            <motion.div
              key='produk'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className='section-title'>Etalase Produk Unggulan</h2>

              <motion.input
                type='text'
                placeholder='Cari produk...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className='search-bar'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />

              {loading ? (
                <p className='loading'>Loading produk...</p>
              ) : (
                <>
                  <motion.div
                    className='product-grid'
                    initial='hidden'
                    animate='show'
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {currentProducts
                      .filter((item) => item.nama && item.harga) // hanya tampilkan yang ada nama & harga
                      .map((item, i) => (
                        <motion.div
                          key={i}
                          className='product-card'
                          variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.3 }}
                          whileHover={{
                            scale: 1.0,
                            y: -6,
                            transition: { duration: 0.1 },
                          }}
                        >
                          <img
                            src={item.foto}
                            alt={item.nama}
                            className='product-img'
                          />
                          <h3>{item.nama}</h3>
                          <p className='price'>
                            Rp {parseInt(item.harga).toLocaleString('id-ID')}
                            {item.item_type ? ` / ${item.item_type}` : ''}
                          </p>
                          <p className='stock'>
                            Stok:{' '}
                            <b className={item.stok > 0 ? 'tersedia' : 'habis'}>
                              {item.stok > 0 ? item.stok : 'Habis'}
                            </b>
                          </p>
                        </motion.div>
                      ))}
                  </motion.div>

                  {/* Pagination */}
                  <div className='pagination'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        className={
                          currentPage === index + 1 ? 'active-page' : ''
                        }
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'organisasi' && (
            <motion.div
              key='organisasi'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className='section-title'>Susunan Organisasi</h2>

              <div>
                <img
                  src={strukturImage}
                  alt='Logo Koperasi'
                  className='struktur-organisasi'
                />
              </div>

              <div className='organisasi-wrapper'>
                <ul className='list'>
                  <h2 className='section-title'>Pengurus</h2>
                  <li>KETUA: DEDE YOGA TRISNA</li>
                  <li>WAKIL KETUA BIDANG USAHA: TRY CAHYO WIBOWO, SH</li>
                  <li>WAKIL KETUA BIDANG ANGGOTA: EDY YUSUF</li>
                  <li>SEKRETARIS: A. TAOEFIKS</li>
                  <li>WAKIL SEKRETARIS: BAHRUDIN</li>
                  <li>BENDAHARA: ENIEK SUKARNI</li>
                  <li>WAKIL BENDAHARA: WAWAN SETIAWAN</li>
                </ul>

                <ul className='list'>
                  <h2 className='section-title'>Pengawas</h2>
                  <li>KETUA: ARSUN SAHADI, SE.MSi</li>
                  <li>PENGAWAS 1: SUHARTO</li>
                  <li>PENGAWAS 2: SYARFUDDIN. SE, MM</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'visi' && (
            <motion.div
              key='visi'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className='section-title'>Visi & Misi</h2>
              <p>
                <b>Visi:</b>
                <p>
                  {' '}
                  Mewujudkan kemandirian ekonomi masyarakat kelurahan, melalui
                  koperasi yang adil, transparan, dan berpihak pada rakyat,
                  dengan tujuan untuk membangun ekonomi kelurahan yang kuat,
                  menciptakan lapangan kerja, dan meningkatkan kesejahteraan
                  masyarakat kelurahan melalui semangat gotong royong dan
                  pemanfaatan potensi lokal.
                </p>
              </p>
              <p>
                <b>Misi:</b>
              </p>
              <ul className='list'>
                <li>
                  - Menyediakan layanan keuangan syariah yang aman dan bebas
                  riba.
                </li>
                <li> - Mendorong pemasaran produk UMKM secara kolektif.</li>
                <li>
                  - Memberdayakan warga kelurahan dengan pelatihan,
                  pendampingan, dan digitalisasi usaha.
                </li>
                <li>
                  - Menjadi pusat distribusi kebutuhan pokok dengan harga
                  terjangkau.
                </li>
                <li>
                  - Menumbuhkan rasa memiliki dan semangat gotong royong di
                  setiap kegiatan ekonomi kelurahan.
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className='footer'>
        <div>
          <div className='footer-left'>
            <img
              src={logoSeiSelayur}
              alt='Logo Koperasi'
              className='footer-logo'
            />
            <div className='footer-text'>
              <span className='footer-title'>
                Koperasi Kelurahan Merah Putih
              </span>
              <span className='footer-subtitle'>Sungaiselayur</span>
            </div>
          </div>
          <div className='backgroundWhite'>
            <img
              src={logo2}
              alt='Logo Koperasi'
              className='footer-logo-koprasiIndo'
            />
            <img
              src={kemenkop}
              alt='Logo Koperasi'
              className='footer-logo-kemenkop'
            />
            <img
              src={palembangLogo}
              alt='Logo Koperasi'
              className='footer-logo-palembang'
            />
            <img
              src={logoKementrianDesa}
              alt='Logo Koperasi'
              className='footer-logo-kemendes'
            />
          </div>
        </div>

        <div className='footer-center'>
          <p>
            📍 Jalan Mayor Zen, lorong Kemayoran RT.22 RW.06 No.36 Kelurahan
            Sungaiselayur, kecamatan Kalidoni Palembang
          </p>
          <p>✉️ koperasimerahputihselayur@gmail.com</p>
          <p>AHU-0018900.AH.01.29.TAHUN 2025</p>
        </div>
        <div className='footer-right'>
          <div className='footer-right-wrapper'>
            <a
              href='https://wa.me/6282177401440'
              target='_blank'
              rel='noreferrer'
            >
              <FaWhatsapp size={24} /> <span> 082177401440 </span>
            </a>
            <a href='https://facebook.com' target='_blank' rel='noreferrer'>
              <FaFacebook size={20} /> <span>kkmpsungaiselayur</span>
            </a>
            <a href='https://instagram.com' target='_blank' rel='noreferrer'>
              <FaInstagram size={24} /> <span>kkmpsungaiselayur</span>
            </a>
          </div>
        </div>
      </footer>
      <div className='footer-copy'>
        © {new Date().getFullYear()} KKMP Sungaiselayur. All rights reserved.
      </div>
    </div>
  );
}

export default App;
