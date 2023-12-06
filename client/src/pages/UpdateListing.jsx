import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function UpdateListing() {
  const { id } = useParams();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [imageUrls, setImageurls] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    reqularPrice: 0,
    discountedPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    type: "",
    offer: false,
  });

  const getData = async () => {
    try {
      const { data } = await axios.get(`/api/listing/${id}`);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      } else {
        const { imageUrls, ...rest } = data;
        setFormData(rest);
        setImageurls(imageUrls);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleImageUpload = () => {
    setLoading(true);
    if (files.length > 0 && 6 > files.length + imageUrls.length) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setImageurls([...imageUrls, ...urls]);
          setLoading(false);
          setError(null);
        })
        .catch((error) => {
          setLoading(false);
          setError("Image uplaod faild ( 5mb max per image).");
        });
    } else {
      setLoading(false);
      setError("You can only upload 5 images.");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handelImageDelete = (index) => {
    setImageurls(imageUrls.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.reqularPrice < formData.discountedPrice)
      return setError("Discounted price should be less the regular price.");
    if (imageUrls.length < 1)
      return setError("Atleast one image should be uploaded.");
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/listing/update/${id}`, {
        ...formData,
        imageUrls: imageUrls,
      });
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-8">
        Update Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row justify-evenly mx-auto p-1"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            disabled={loading}
            id="name"
            type="text"
            placeholder="title"
            className="border p-3 rounded-lg"
            maxLength="60"
            minLength="5"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            disabled={loading}
            id="description"
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            disabled={loading}
            id="address"
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            maxLength="100"
            minLength="5"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 cursor-pointer">
              <input
                disabled={loading}
                id="sell"
                type="checkbox"
                className="w-5 cursor-pointer"
                checked={formData.type === "sell"}
                onChange={handleChange}
              />
              <label htmlFor="sell" className="cursor-pointer">
                Sell
              </label>
            </div>
            <div className="flex gap-2 cursor-pointer">
              <input
                id="rent"
                type="checkbox"
                className="w-5 cursor-pointer"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <label htmlFor="rent" className="cursor-pointer">
                Rent
              </label>
            </div>
            <div className="flex gap-2 cursor-pointer">
              <input
                disabled={loading}
                id="parking"
                type="checkbox"
                className="w-5 cursor-pointer"
                checked={formData.parking}
                onChange={handleChange}
              />
              <label htmlFor="parking" className="cursor-pointer">
                Parking
              </label>
            </div>
            <div className="flex gap-2 cursor-pointer">
              <input
                disabled={loading}
                id="furnished"
                type="checkbox"
                className="w-5 cursor-pointer"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <label htmlFor="furnished" className="cursor-pointer">
                Furnished
              </label>
            </div>
            <div className="flex gap-2 cursor-pointer">
              <input
                disabled={loading}
                id="offer"
                type="checkbox"
                className="w-5 cursor-pointer"
                checked={formData.offer}
                onChange={handleChange}
              />
              <label htmlFor="offer" className="cursor-pointer">
                Offer
              </label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                disabled={loading}
                id="bedrooms"
                type="number"
                className="p-3 border border-gray-400 h-10 rounded-lg "
                min="1"
                max="20"
                required
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                disabled={loading}
                id="bathrooms"
                type="number"
                className="p-3 border border-gray-400 h-10 rounded-lg "
                min="1"
                max="20"
                required
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                disabled={loading}
                id="reqularPrice"
                type="number"
                className="p-3 border border-gray-400 h-10 w-24 rounded-lg "
                min="500"
                required
                value={formData.reqularPrice}
                onChange={handleChange}
              />
              <label htmlFor="reqularPrice">
                Price {"(₹"}
                {formData.type === "rent" ? " per month)" : ")"}
              </label>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  disabled={loading}
                  id="discountedPrice"
                  type="number"
                  className="p-3 border border-gray-400 h-10 w-24 rounded-lg "
                  min="0"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                />
                <label htmlFor="discountedPrice">
                  Discounted Price {"(₹"}
                  {formData.type === "rent" ? " per month)" : ")"}
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 mt-6 md:mt-0 md:ml-10">
          <p className="font-semibold">
            Images :{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max-5)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              disabled={loading}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="iamge/*"
              onChange={(e) => setFiles(e.target.files)}
              multiple
            />
            <button
              disabled={loading}
              onClick={handleImageUpload}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {loading ? "Loading..." : "Upload"}
            </button>
          </div>
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border rounded-xl"
              >
                <img
                  className="w-20 h-20 object-contain rounded-lg"
                  src={url}
                  alt="image"
                />
                <button
                  type="button"
                  onClick={() => handelImageDelete(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-60"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Update Lisitng"}
          </button>
        </div>
      </form>
      {error && <div className="bg-red-200 rounded-lg p-3 mt-5">{error}</div>}
    </main>
  );
}

export default UpdateListing;
