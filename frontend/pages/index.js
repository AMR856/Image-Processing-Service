import { useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function fetchApi(path, options = {}) {
  const opts = {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  };

  return fetch(`${BASE_URL}${path}`, opts).then(async (res) => {
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(body?.message || `${res.status} ${res.statusText}`);
    }
    return body;
  });
}

export default function Home() {
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [imageData, setImageData] = useState({ uploadId: "", publicId: "" });
  const [imageList, setImageList] = useState([]);
  const [imageStatus, setImageStatus] = useState(null);
  const [foundImage, setFoundImage] = useState(null);
  const [transformConfig, setTransformConfig] = useState({
    id: "",
    resizeWidth: "",
    resizeHeight: "",
    rotate: "",
    grayscale: false,
    sepia: false,
    format: "",
  });
  const [transformResult, setTransformResult] = useState(null);

  const handleChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("Registering...");
    try {
      const payload = { email: loginData.email, password: loginData.password };
      const result = await fetchApi("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus(`Register success: ${JSON.stringify(result.data)}`);
    } catch (err) {
      setStatus(`Register failed: ${err.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");
    try {
      const payload = { email: loginData.email, password: loginData.password };
      const result = await fetchApi("/users/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus(
        `Login success (${result.data.token ? "token returned" : "no token in response"})`,
      );
    } catch (err) {
      setStatus(`Login failed: ${err.message}`);
    }
  };

  const loadProfile = async () => {
    setStatus("Loading profile...");
    try {
      const result = await fetchApi("/users/profile");
      setUser(result.data);
      setStatus("Profile loaded");
    } catch (err) {
      setStatus(`Profile failed: ${err.message}`);
      setUser(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.image.files[0];
    if (!file) {
      setStatus("Pick an image first");
      return;
    }
    setStatus("Uploading image...");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await fetchApi("/images", {
        method: "POST",
        body: formData,
      });
      setImageData({ uploadId: result.data.uploadId, publicId: "" });
      setStatus(`Enqueued upload ID: ${result.data.uploadId}`);
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`);
    }
  };

  const checkUploadStatus = async () => {
    if (!imageData.uploadId) {
      setStatus("No uploadId yet");
      return;
    }
    setStatus("Checking upload status...");
    try {
      const result = await fetchApi(`/images/${imageData.uploadId}/status`);
      setImageStatus(result.data);
      setStatus(`Status: ${result.data.status}`);
      if (result.data.publicId)
        setImageData((prev) => ({ ...prev, publicId: result.data.publicId }));
    } catch (err) {
      setStatus(`Status check failed: ${err.message}`);
    }
  };

  const fetchPublicImage = async () => {
    if (!imageData.publicId) {
      setStatus("No publicId available");
      return;
    }
    setStatus("Fetching image URL...");
    try {
      const result = await fetchApi(
        `/images/get-image?publicId=${imageData.publicId}`,
      );
      setFoundImage(result.data.url);
      setStatus("Got public image URL");
    } catch (err) {
      setStatus(`Fetch failed: ${err.message}`);
      setFoundImage(null);
    }
  };
  const listImages = async () => {
    setStatus("Loading image list...");
    try {
      const result = await fetchApi("/images?page=1&limit=10");
      setImageList(result.data || []);
      setStatus(`Loaded ${result.data.length} images`);
    } catch (err) {
      setStatus(`List failed: ${err.message}`);
      setImageList([]);
    }
  };

  const transformImage = async (e) => {
    e.preventDefault();
    if (!transformConfig.id) {
      setStatus("Set image publicId in transform form");
      return;
    }
    setStatus("Applying transformation...");
    try {
      const body = { transformations: {} };
      if (transformConfig.resizeWidth && transformConfig.resizeHeight) {
        body.transformations.resize = {
          width: Number(transformConfig.resizeWidth),
          height: Number(transformConfig.resizeHeight),
        };
      }
      if (transformConfig.rotate)
        body.transformations.rotate = Number(transformConfig.rotate);
      if (transformConfig.grayscale || transformConfig.sepia) {
        body.transformations.filters = {
          grayscale: transformConfig.grayscale,
          sepia: transformConfig.sepia,
        };
      }
      if (transformConfig.format)
        body.transformations.format = transformConfig.format;

      const result = await fetchApi(
        `/images/transform?id=${encodeURIComponent(transformConfig.id)}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      setTransformResult(result.data.url);
      setStatus("Transform executed");
    } catch (err) {
      setStatus(`Transform failed: ${err.message}`);
      setTransformResult(null);
    }
  };

  return (
    <div className="container">
      <h1>Image Processing UI (Next.js)</h1>
      <div className="card">
        <h2>Auth</h2>
        <small>
          All auth routes: /users/register, /users/login, /users/profile
        </small>

        <form onSubmit={handleRegister}>
          <h3>Register</h3>
          <input
            type="email"
            name="email"
            value={loginData.email}
            placeholder="Email"
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <input
            type="password"
            name="password"
            value={loginData.password}
            placeholder="Password"
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <button type="submit">Register</button>
        </form>

        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <button type="submit">Login</button>
        </form>

        <button onClick={loadProfile}>Load Profile</button>
        {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      </div>

      <div className="card">
        <h2>Images</h2>
        <small>
          Endpoints: POST /images, GET /images/:publicId, GET
          /images/:id/status, GET /images
        </small>

        <form onSubmit={handleUpload}>
          <h3>Upload</h3>
          <input type="file" name="image" accept="image/*" required />
          <button type="submit">Upload</button>
        </form>

        <div>
          <button onClick={checkUploadStatus}>Check Upload Status</button>
          <button onClick={fetchPublicImage}>Fetch Image by PublicId</button>
          <button onClick={listImages}>Load Current User Images</button>
        </div>

        <div>
          <strong>Upload ID:</strong> {imageData.uploadId}
          <br />
          <strong>Public ID:</strong> {imageData.publicId}
        </div>

        {imageStatus && <pre>{JSON.stringify(imageStatus, null, 2)}</pre>}
        {foundImage && (
          <div>
            <p>Public image URL:</p>
            <img
              src={foundImage}
              alt="from cloudinary"
              style={{ maxWidth: "100%", marginTop: 12 }}
            />
            <p>{foundImage}</p>
          </div>
        )}

        <h3>Transform</h3>
        <form onSubmit={transformImage}>
          <input
            name="id"
            placeholder="publicId"
            value={transformConfig.id}
            onChange={(e) =>
              setTransformConfig((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <input
            name="resizeWidth"
            placeholder="resize width"
            value={transformConfig.resizeWidth}
            onChange={handleChange(setTransformConfig)}
          />
          <input
            name="resizeHeight"
            placeholder="resize height"
            value={transformConfig.resizeHeight}
            onChange={handleChange(setTransformConfig)}
          />
          <input
            name="rotate"
            placeholder="rotate degrees"
            value={transformConfig.rotate}
            onChange={handleChange(setTransformConfig)}
          />
          <label>
            <input
              type="checkbox"
              name="grayscale"
              checked={transformConfig.grayscale}
              onChange={handleChange(setTransformConfig)}
            />{" "}
            grayscale
          </label>
          <label>
            <input
              type="checkbox"
              name="sepia"
              checked={transformConfig.sepia}
              onChange={handleChange(setTransformConfig)}
            />{" "}
            sepia
          </label>
          <input
            name="format"
            placeholder="format (jpg/png/webp)"
            value={transformConfig.format}
            onChange={handleChange(setTransformConfig)}
          />
          <button type="submit">Transform</button>
        </form>

        {transformResult && (
          <div>
            <p>Transform URL:</p>
            <img
              src={transformResult}
              alt="transformed"
              style={{ maxWidth: "100%", marginTop: 12 }}
            />
            <p>{transformResult}</p>
          </div>
        )}

        <h3>User images list</h3>
        {imageList.length > 0 ? (
          <pre>{JSON.stringify(imageList, null, 2)}</pre>
        ) : (
          <p>No images loaded yet</p>
        )}
      </div>

      <div className="card">
        <h2>Status</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}
