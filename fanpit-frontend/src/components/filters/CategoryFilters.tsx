'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';

interface Category {
  id: string;
  name: string;
  color: {
    bg: string;
    text: string;
    gradient: string;
  };
}

const categories: Category[] = [
  { 
    id: 'conference', 
    name: 'Conference', 
    color: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500/10 to-blue-100 hover:from-blue-500/20 hover:to-blue-200'
    }
  },
  { 
    id: 'workshop', 
    name: 'Workshop', 
    color: { 
      bg: 'bg-green-50', 
      text: 'text-green-600',
      gradient: 'bg-gradient-to-r from-green-500/10 to-green-100 hover:from-green-500/20 hover:to-green-200'
    }
  },
  { 
    id: 'meetup', 
    name: 'Meetup', 
    color: { 
      bg: 'bg-purple-50', 
      text: 'text-purple-600',
      gradient: 'bg-gradient-to-r from-purple-500/10 to-purple-100 hover:from-purple-500/20 hover:to-purple-200'
    }
  },
  { 
    id: 'social', 
    name: 'Social', 
    color: { 
      bg: 'bg-pink-50', 
      text: 'text-pink-600',
      gradient: 'bg-gradient-to-r from-pink-500/10 to-pink-100 hover:from-pink-500/20 hover:to-pink-200'
    }
  },
  { 
    id: 'business', 
    name: 'Business', 
    color: { 
      bg: 'bg-indigo-50', 
      text: 'text-indigo-600',
      gradient: 'bg-gradient-to-r from-indigo-500/10 to-indigo-100 hover:from-indigo-500/20 hover:to-indigo-200'
    }
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    color: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-600',
      gradient: 'bg-gradient-to-r from-orange-500/10 to-orange-100 hover:from-orange-500/20 hover:to-orange-200'
    }
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    color: { 
      bg: 'bg-red-50', 
      text: 'text-red-600',
      gradient: 'bg-gradient-to-r from-red-500/10 to-red-100 hover:from-red-500/20 hover:to-red-200'
    }
  },
  { 
    id: 'education', 
    name: 'Education', 
    color: { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-600',
      gradient: 'bg-gradient-to-r from-yellow-500/10 to-yellow-100 hover:from-yellow-500/20 hover:to-yellow-200'
    }
  },
  { 
    id: 'other', 
    name: 'Other', 
    color: { 
      bg: 'bg-gray-50', 
      text: 'text-gray-600',
      gradient: 'bg-gradient-to-r from-gray-500/10 to-gray-100 hover:from-gray-500/20 hover:to-gray-200'
    }
  },
];

interface CategoryFiltersProps {
  onSearch: (query: string) => void;
  type: 'events' | 'experiences';
  searchPlaceholder?: string;
}

export default function CategoryFilters({ onSearch, type, searchPlaceholder }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAll, setShowAll] = useState(false);
  const currentCategory = searchParams.get('category');

  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCategory === categoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Search Section */}
      <section className="mb-8">
        <SearchBar
          type={type}
          onSearch={onSearch}
          placeholder={searchPlaceholder}
        />
      </section>

      {/* Categories */}
      <section className="mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                rounded-full px-6 py-2 transition-all duration-300 ease-in-out
                ${currentCategory === category.id
                  ? `${category.color.gradient} ${category.color.text} font-medium shadow-md`
                  : `${category.color.gradient} text-gray-700`
                }
                transform hover:scale-105 hover:shadow-md
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
        {categories.length > 6 && (
          <div className="mt-4 text-center">
            <button
              className="text-sm text-gray-600 hover:text-[#7C3AED] transition-colors duration-300"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>
        )}
      </section>
    </>
  );
}