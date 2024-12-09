import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 8;

  // Hitung total artikel
  const totalArticles = articles.length;

  // Menentukan artikel yang akan ditampilkan berdasarkan halaman aktif
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalArticles / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch artikel saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/api/articles");
        if (!response.ok) throw new Error("Failed to fetch articles");

        const data = await response.json();

        // Urutkan artikel berdasarkan ID terbaru di frontend
        const sortedArticles = data.sort((a, b) => b.id - a.id);

        setArticles(sortedArticles);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fungsi untuk menambahkan artikel baru
  const addArticle = async (newArticle) => {
    try {
      // Kirim permintaan POST untuk menambahkan artikel baru
      const response = await axios.post(
        "http://localhost:3000/api/articles",
        newArticle
      );

      // Menambahkan artikel baru di awal daftar artikel
      setArticles([response.data, ...articles]); // Menambahkan artikel baru di awal array
    } catch (error) {
      console.error("Error adding article", error);
    }
  };

  // Fungsi untuk menangani penghapusan artikel
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/articles/${id}`);
      setArticles(articles.filter((article) => article.id !== id)); // Hapus artikel dari state setelah dihapus
      closeModal(); // Tutup modal setelah hapus
    } catch (error) {
      console.error("Error deleting article", error);
    }
  };

  // Fungsi untuk membuka modal
  const openModal = (id) => {
    setArticleToDelete(id); // Set artikel yang akan dihapus
    setIsModalOpen(true); // Buka modal
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false); // Tutup modal
    setArticleToDelete(null); // Reset artikel yang akan dihapus
  };

  // Tampilkan loading jika masih loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

  // Tampilkan error jika ada kesalahan
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <Navbar />
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold mb-6">Home</h1>
          <Link
            to="/add-article"
            className="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add New Article
          </Link>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {article.image && (
                  <img
                    src={`http://localhost:3000${article.image}`}
                    alt={article.title}
                    className="w-full h-56 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
                <p
                  className="text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: article.content.slice(0, 150) + "...",
                  }}
                ></p>

                <Link
                  to={`/articles/${article.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/edit-article/${article.id}`}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openModal(article.id)} // Buka modal konfirmasi hapus
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageClick(number)}
                className={`mx-2 py-2 px-4 rounded-md ${
                  number === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this article?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(articleToDelete)} // Hapus artikel
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
