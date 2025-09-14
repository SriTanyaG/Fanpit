'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/api.types';
import Gallery from '@/components/Gallery';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
  };

  const handleGalleryUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    // Validate file count
    if (galleryImages.length + files.length > 20) {
      alert('Maximum 20 images allowed');
      return;
    }
    
    // Validate file sizes and types
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image.`);
        return;
      }
    }
    
    try {
      setGalleryLoading(true);
      
      // Upload images to backend
      const uploadPromises = Array.from(files).map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json()).then(data => data.url);
      });
      
      const uploadedImages = await Promise.all(uploadPromises);
      
      setGalleryImages(prev => [...prev, ...uploadedImages]);
    } catch (err: any) {
      alert(err.message || 'Failed to upload images');
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryRemove = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Form */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          {/* Gallery */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <Gallery
              images={galleryImages}
              onImageUpload={handleGalleryUpload}
              onImageRemove={handleGalleryRemove}
              canEdit={true}
              maxImages={20}
            />
            {galleryLoading && (
              <div className="mt-4 text-center text-gray-500">
                Uploading images...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}