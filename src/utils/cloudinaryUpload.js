// utils/cloudinaryUpload.js

import axios from 'axios';

const CLOUD_NAME = 'dkpdde3x6';

// Upload presets for each role
const PRESETS = {
  user: 'user_outfits',
  seller: 'seller_outfits' // ✅ your actual seller preset
};

/**
 * Uploads an image to Cloudinary based on role.
 * @param {string} imageUri - Local image URI.
 * @param {'user' | 'seller'} role - Role type.
 * @returns {Promise<string>} - Secure Cloudinary URL.
 */
export const uploadImageToCloudinary = async (imageUri, role = 'user') => {
  const preset = PRESETS[role] || PRESETS.user;
  const folder = role === 'seller' ? 'seller_outfits' : 'user_outfits';

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`
  });
  formData.append('upload_preset', preset);
  formData.append('folder', folder);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res.data.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
};