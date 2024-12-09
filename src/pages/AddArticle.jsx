import { useState } from "react"; // Import hook untuk mengelola state lokal di komponen
import axios from "axios"; // Library untuk melakukan HTTP request
import { useNavigate } from "react-router-dom"; // Hook untuk navigasi antar halaman
import Navbar from "../components/Navbar.jsx"; // Import komponen Navbar
import { Editor } from "@tinymce/tinymce-react"; // Import Editor dari TinyMCE untuk konten artikel

// Komponen utama
const AddArticle = () => {
  // State untuk form input
  const [form, setForm] = useState({
    title: "", // Menyimpan judul artikel
    content: "", // Menyimpan isi artikel
    image: null, // Menyimpan file gambar
  });

  const [errors, setErrors] = useState({}); // State untuk pesan error validasi
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal konfirmasi
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk status pengiriman form
  const navigate = useNavigate(); // Navigasi setelah form berhasil dikirim

  // Fungsi untuk memvalidasi form
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!form.title) {
      newErrors.title = "Title is required"; // Validasi judul
      valid = false;
    }

    if (!form.content) {
      newErrors.content = "Content is required"; // Validasi konten
      valid = false;
    }

    if (!form.image) {
      newErrors.image = "Image is required"; // Validasi gambar
      valid = false;
    }

    setErrors(newErrors); // Menyimpan error ke state
    return valid; // Mengembalikan apakah form valid
  };

  // Fungsi untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    if (!validateForm()) return; // Jika validasi gagal, hentikan proses
    setIsSubmitting(true); // Set tombol ke mode pengiriman

    const formData = new FormData(); // Membuat objek FormData untuk kirim data multipart
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]); // Menambahkan field ke FormData
    });

    try {
      await axios.post("http://localhost:3000/api/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Header untuk upload file
      });
      setIsModalOpen(true); // Tampilkan modal jika berhasil
      setTimeout(() => navigate("/"), 2000); // Arahkan ke halaman utama setelah 2 detik
    } catch (error) {
      alert("Failed to add article"); // Tampilkan pesan error jika gagal
    } finally {
      setIsSubmitting(false); // Reset tombol pengiriman
    }
  };

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value, files } = e.target; // Ambil nama field dan value
    setForm((prevForm) => ({
      ...prevForm,
      [name]: files ? files[0] : value, // Jika file, simpan file, jika tidak simpan value
    }));
  };

  return (
    <>
      <Navbar /> {/* Komponen navigasi */}
      <div className="w-full h-screen p-4 sm:p-6 md:p-10 bg-gray-100 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Add New Article
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input judul */}
          <div>
            <label
              htmlFor="title"
              className="block text-base md:text-xl font-semibold mb-2"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-lg"
              placeholder="Enter the title here"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Editor konten */}
          <div>
            <label
              htmlFor="content"
              className="block text-base md:text-xl font-semibold mb-2"
            >
              Content
            </label>
            <Editor
              apiKey="wleeg8f23v1ez81ky6zio8q40i5owdcvamrpyzqj3vj4v90f" // API key TinyMCE
              value={form.content}
              onEditorChange={(newContent) =>
                setForm((prevForm) => ({ ...prevForm, content: newContent }))
              } // Simpan perubahan konten
              init={{
                height: 300,
                menubar: false,
                plugins: ["link", "image", "lists", "media"], // Plugin editor
                toolbar:
                  "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image",
              }}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          {/* Input gambar */}
          <div>
            <label
              htmlFor="image"
              className="block text-base md:text-xl font-semibold mb-2"
            >
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-md"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Tombol submit */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-10 py-5 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Article"}{" "}
              {/* Tampilkan status tombol */}
            </button>
          </div>
        </form>
      </div>
      {/* Modal konfirmasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-xl font-semibold text-center">
              Article Added Successfully!
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddArticle; // Ekspor komponen agar bisa digunakan di file lain
