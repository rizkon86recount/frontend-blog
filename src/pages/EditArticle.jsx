import { useEffect, useState } from "react"; // Mengimpor React hooks untuk mengelola state dan efek samping.
import { useParams, useNavigate } from "react-router-dom"; // Mengimpor hooks untuk mengambil parameter URL dan navigasi antar halaman.
import axios from "axios"; // Mengimpor axios untuk melakukan HTTP request.
import Navbar from "../components/Navbar"; // Mengimpor komponen Navbar.
import { Editor } from "@tinymce/tinymce-react"; // Mengimpor editor teks TinyMCE.

const EditArticle = () => {
  const { id } = useParams(); // Mengambil parameter `id` dari URL.
  const navigate = useNavigate(); // Untuk navigasi ke halaman lain setelah aksi selesai.

  // State untuk menyimpan data artikel yang sedang di-edit.
  const [article, setArticle] = useState({
    title: "", // Judul artikel.
    content: "", // Isi artikel.
    image: null, // Gambar artikel (bisa null jika tidak ada gambar baru yang diunggah).
  });

  const [imagePreview, setImagePreview] = useState(null); // Untuk menampilkan pratinjau gambar.
  const [error, setError] = useState(""); // Untuk menampilkan pesan error.
  const [validationError, setValidationError] = useState(""); // Validasi form.
  const [modalOpen, setModalOpen] = useState(false); // Menyimpan status modal (terbuka atau tertutup).
  const [modalMessage, setModalMessage] = useState(""); // Pesan di dalam modal.

  // Mengambil data artikel dari API saat komponen dimuat.
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/articles/${id}`
        ); // HTTP GET untuk mengambil data artikel.
        setArticle(response.data); // Menyimpan data artikel ke state.
        setImagePreview(`http://localhost:3000${response.data.image}`); // Menyimpan URL gambar untuk pratinjau.
      } catch (error) {
        setError("Failed to load the article."); // Jika terjadi error, tampilkan pesan.
      }
    };
    fetchArticle();
  }, [id]); // Efek ini dijalankan setiap kali `id` berubah.

  // Handler untuk mengubah input teks.
  const handleChange = (e) =>
    setArticle((prev) => ({ ...prev, [e.target.name]: e.target.value })); // Menyimpan perubahan ke state.

  // Handler untuk mengubah input gambar.
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Mengambil file yang diunggah.
    if (file && file.type.startsWith("image/")) {
      // Memeriksa apakah file adalah gambar.
      const reader = new FileReader(); // Menggunakan FileReader untuk membaca file.
      reader.onloadend = () => setImagePreview(reader.result); // Menampilkan pratinjau setelah file dibaca.
      reader.readAsDataURL(file); // Membaca file sebagai URL data.
      setArticle((prev) => ({ ...prev, image: file })); // Menyimpan file ke state.
    } else {
      setValidationError("The selected file is not an image."); // Pesan validasi jika bukan gambar.
    }
  };

  // Handler untuk mengirimkan form.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman.
    setValidationError(""); // Reset error validasi.

    if (!article.title || !article.content) {
      // Validasi input.
      setValidationError("Title and content are required.");
      return;
    }

    const formData = new FormData(); // Menggunakan FormData untuk mengirim data multipart.
    formData.append("title", article.title);
    formData.append("content", article.content);
    if (article.image) formData.append("image", article.image);

    try {
      await axios.put(`http://localhost:3000/api/articles/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Header untuk multipart form.
      });
      setModalMessage("Article updated successfully!"); // Pesan sukses.
      setModalOpen(true); // Buka modal sukses.
      setTimeout(() => {
        navigate(`/articles/${id}`); // Arahkan ke halaman artikel setelah 2 detik.
        setModalOpen(false); // Tutup modal.
      }, 2000);
    } catch (error) {
      setError("Failed to update the article."); // Pesan error jika update gagal.
    }
  };

  if (error)
    // Jika ada error, tampilkan di layar.
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <>
      <Navbar /> {/* Komponen Navbar */}
      <div className="w-full mx-auto p-4 sm:p-6 lg:p-10 mt-10">
        <h2 className="text-3xl font-bold mb-10 text-center">Edit Article</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input untuk judul */}
          <div>
            <label htmlFor="title" className="block text-xl font-semibold mb-4">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={article.title}
              onChange={handleChange}
              className="w-full p-5 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          {/* Input untuk konten */}
          <div>
            <label
              htmlFor="content"
              className="block text-xl font-semibold mb-4"
            >
              Content
            </label>
            <Editor
              apiKey="your-api-key"
              value={article.content}
              onEditorChange={(newContent) =>
                setArticle((prev) => ({ ...prev, content: newContent }))
              }
              init={{
                height: 400,
                menubar: false,
                plugins: ["link", "image", "textcolor", "lists", "media"],
                toolbar:
                  "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image",
              }}
            />
          </div>

          {/* Input untuk gambar */}
          <div>
            <label htmlFor="image" className="block text-xl font-semibold mb-4">
              Image
            </label>
            {imagePreview && (
              <div className="mb-5">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <input
              id="image"
              name="image"
              type="file"
              onChange={handleImageChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md"
            />
          </div>

          {/* Pesan validasi */}
          {validationError && (
            <div className="bg-red-500 text-white p-4 rounded-md">
              {validationError}
            </div>
          )}

          {/* Tombol submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-10 py-5 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200"
          >
            Update Article
          </button>
        </form>

        {/* Modal sukses */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-lg font-semibold">{modalMessage}</p>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-4 w-full bg-blue-600 text-white px-10 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditArticle; // Ekspor komponen.
