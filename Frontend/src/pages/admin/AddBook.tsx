import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const AddBook = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [genre, setGenre] = useState("");
  const [copiesAvailable, setCopiesAvailable] = useState("1");
  const [chargePerDay, setChargePerDay] = useState("1.0");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("ISBN", ISBN);
      formData.append("publishedDate", publishedDate);
      formData.append("genre", genre);
      formData.append("copiesAvailable", copiesAvailable);
      formData.append("chargePerDay", chargePerDay);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/books");
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add New Book</h1>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author *
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="ISBN"
                className="block text-sm font-medium text-gray-700"
              >
                ISBN *
              </label>
              <input
                type="text"
                id="ISBN"
                value={ISBN}
                onChange={(e) => setISBN(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="publishedDate"
                className="block text-sm font-medium text-gray-700"
              >
                Published Date *
              </label>
              <input
                type="date"
                id="publishedDate"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700"
              >
                Genre *
              </label>
              <input
                type="text"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="copiesAvailable"
                className="block text-sm font-medium text-gray-700"
              >
                Copies Available *
              </label>
              <input
                type="number"
                id="copiesAvailable"
                value={copiesAvailable}
                onChange={(e) => setCopiesAvailable(e.target.value)}
                min="0"
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="chargePerDay"
                className="block text-sm font-medium text-gray-700"
              >
                Charge Per Day ($) *
              </label>
              <input
                type="number"
                id="chargePerDay"
                value={chargePerDay}
                onChange={(e) => setChargePerDay(e.target.value)}
                min="0"
                step="0.01"
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/books")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
