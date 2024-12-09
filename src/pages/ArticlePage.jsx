import { useEffect, useState } from "react"; // Mengimpor hooks useEffect dan useState dari React
import { useParams } from "react-router-dom"; // Mengimpor useParams untuk mendapatkan parameter URL
import Navbar from "../components/Navbar"; // Mengimpor komponen Navbar

function ArticlePage() {
  const { id } = useParams(); // Mendapatkan parameter 'id' dari URL
  const [article, setArticle] = useState(null); // State untuk menyimpan data artikel
  const [loading, setLoading] = useState(true); // State untuk status loading
  const [error, setError] = useState(null); // State untuk menyimpan pesan error

  // Menggunakan useEffect untuk memuat data artikel saat komponen dirender
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true); // Menandai bahwa data sedang dimuat
      setError(null); // Reset error sebelum memulai permintaan

      try {
        // Mengambil data artikel dari API menggunakan fetch
        const response = await fetch(
          `http://localhost:3000/api/articles/${id}` // URL API dengan ID artikel
        );

        if (!response.ok) {
          throw new Error("Failed to fetch article"); // Jika respons gagal, lempar error
        }

        const data = await response.json(); // Mengonversi respons ke format JSON
        setArticle(data); // Menyimpan data artikel ke state
      } catch (error) {
        setError(error.message); // Menyimpan pesan error jika terjadi kesalahan
      } finally {
        setLoading(false); // Menandai bahwa pemuatan selesai
      }
    };

    fetchArticle(); // Memanggil fungsi untuk memuat data artikel
  }, [id]); // useEffect akan dijalankan ulang jika nilai 'id' berubah

  // Menampilkan pesan loading jika data sedang dimuat
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

  // Menampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Menampilkan pesan jika artikel tidak ditemukan
  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl text-yellow-600">Article not found</div>
      </div>
    );
  }

  // Jika data tersedia, menampilkan isi artikel
  return (
    <>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Konten Artikel */}
        <div className="flex-1 overflow-hidden bg-white shadow-xl py-8">
          {/* Gambar Artikel */}
          <div className="relative w-full max-w-4xl mx-auto mb-6">
            <img
              src={`http://localhost:3000${article.image}`} // Menampilkan gambar artikel
              alt={article.title} // Alt text gambar
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Konten Artikel */}
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
              {article.title} {/* Menampilkan judul artikel */}
            </h1>
            <div
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }} // Menampilkan konten artikel
            />
            {/* Tombol Share */}
            <div className="flex justify-start space-x-6 mt-8">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105">
                Share this Article {/* Tombol untuk membagikan artikel */}
              </button>
            </div>

            {/* Tanggal Publikasi */}
            <div className="mt-6 text-gray-500 text-sm">
              <span>
                Published on {new Date(article.createdAt).toLocaleDateString()}{" "}
                {/* Menampilkan tanggal publikasi artikel */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticlePage; // Mengeksport komponen untuk digunakan di tempat lain
