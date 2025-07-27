import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Camera, Edit, Save, X, Loader2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [setProfilePic] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const fetchingUserId = async () => {
    const { data: userData, error } = await supabase.auth.getUser();

    if (userData?.user?.id) {
      const user_id = userData.user.id;
      setUserId(user_id);

      try {
        await fetchUserProfile(user_id);
        await fetchUserStyles(user_id);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false); // ✅ PENTING
      }
    } else {
      console.error("User belum login atau error:", error);
      setLoading(false); // ✅ Jangan lupa set ini juga jika error
    }
  };

  useEffect(() => {
    fetchingUserId();
  }, []);

  const fetchUserProfile = async (user_id) => {
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (profile) {
      setUser(profile);
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setProfilePic(profile.profile_picture || "/default-avatar.png");
    } else if (error) {
      console.error("Gagal mengambil profil:", error);
    }
  };

  const fetchUserStyles = async (user_id) => {
    const { data: userStyles, error } = await supabase
      .from("style_wardrobe")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (userStyles) {
      setStyles(userStyles);
    } else if (error) {
      console.error("Gagal mengambil style:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      alert("Username tidak boleh kosong");
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: username.trim(),
          bio: bio.trim(),
          // updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      // Update state lokal
      setUser((prev) => ({
        ...prev,
        username: username.trim(),
        bio: bio.trim(),
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan bio:", error.message);
      alert("Gagal menyimpan perubahan bio. Coba lagi nanti.");
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-picture/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-picture")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-picture")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setProfilePic(publicUrl);
      setUser((prev) => ({
        ...prev,
        profile_picture: publicUrl,
      }));
    } catch (error) {
      console.error("Upload foto gagal:", error.message);
      alert("Upload foto gagal. Coba lagi nanti.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pt-24">
      {/* Header Back Button */}
      <div className="fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 z-40 flex items-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[#2E8B57] absolute left-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-[#2E8B57] w-full text-center">
          Profil
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 bg-gray-100">
              <img
                src={user?.profile_picture || "default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            </div>
            <label
              htmlFor="profile-pic-upload"
              className={`absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Ubah foto profil"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Camera size={20} />
              )}
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center mb-4">
              {isEditing ? (
                <div className="flex flex-col space-y-2 w-full">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                    placeholder="Username"
                    maxLength={30}
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                    rows={3}
                    placeholder="Bio"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (!user) return;
                        setUsername(user.username || "");
                        setBio(user.bio || "");
                        setIsEditing(true);
                      }}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold">{username}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="ml-4 text-green-600 hover:text-green-800"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                  <p className="text-gray-800 mt-1">{bio || "No bio yet"}</p>
                </>
              )}
            </div>

            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <p className="font-semibold">{styles.length}</p>
                <p className="text-gray-600 text-sm">Styles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Styles</h2>
        {styles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              You haven't uploaded any styles yet.
            </p>
            <button
              onClick={() => navigate("/addstyle")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Your First Style
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {styles.map((style) => (
              <div
                key={style.id}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/detail_style/${style.id}`)}
              >
                <img
                  src={style.gambar}
                  alt={style.style_name || "Style"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-style.jpg";
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
