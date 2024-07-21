import { api } from '~/utils/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Categories = () => {

  const router = useRouter();
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Fetch paginated categories
  const { data, isLoading } = api.category.getPaginatedCategories.useQuery({
    page,
    perPage,
  });

  // Fetch user selected categories
  const { data: userCategories, isLoading: isLoadingUserCategories } = api.category.getUserCategories.useQuery();

  // Mutation to mark a category as selected
  const markCategory = api.category.markCategory.useMutation();

  // State to hold selected category IDs
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    if (userCategories) {
      setSelectedCategoryIds(userCategories.map(category => category.id));
    }
  }, [userCategories]);

  if (isLoading || isLoadingUserCategories) {
    return <div>Loading...</div>;
  }

  const handleCategorySelect = async (categoryId: number) => {
    const newSelectedCategoryIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    setSelectedCategoryIds(newSelectedCategoryIds);

    await markCategory.mutateAsync({ categoryId });
  };

  const handlePagination = (newPage: number) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil((data?.totalCount || 0) / perPage);
    const paginationItems = [];

    paginationItems.push(
      <button
        key="prev"
        onClick={() => handlePagination(page - 1)}
        className="text-black"
        disabled={page === 1}
      >
        Prev
      </button>
    );

    let startPage = Math.max(1, page - 3);
    let endPage = Math.min(totalPages, startPage + 6);

    if (endPage - startPage < 6) {
      startPage = Math.max(1, endPage - 6);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <button
          key={i}
          onClick={() => handlePagination(i)}
          className={`px-3 py-1 rounded ${
            page === i ? 'text-black' : 'text-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    paginationItems.push(
      <button
        key="next"
        onClick={() => handlePagination(page + 1)}
        className="mx-1 px-3 py-1 round text-black"
        disabled={page >= totalPages}
      >
        Next
      </button>
    );

    return paginationItems;
  };



  const handleLogout =  (): void => {
    // Remove token from cookies and local storage
    document.cookie = 'token=; path=/;';
    localStorage.removeItem('token');
    router.push('/login'); // Redirect to the login page
  };

  return (

  <>
          <div className='flex  justify-end'>
          <button
            title='Logout'
            onClick={handleLogout}
          >
            <i className="fa-solid fa-arrow-right-from-bracket px-3"></i>
            
            
          </button>
          </div>
        
    <div className="flex  py-10 items-center justify-center">
     
      <div className="border-2 p-8 rounded-lg h-4/6 w-100 py-10">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Please mark your interest!
          </h2>
          
          <p className="mt-4 text-center font-bold text-sm text-black">
            we will keep you notified
          </p>
          <p className="mt-5 font-bold text-xl text-black">
            My saved interests!
          </p>
        </div>

        <ul className="mt-4 list-none p-0 ">
          {data?.categories.map(category => (
            <li key={category.id} className="mb-2 flex items-center ">
              <input 
            
                type="checkbox"
                checked={selectedCategoryIds.includes(category.id)}
                onChange={() => handleCategorySelect(category.id)}
                className="mr-3 accent-black "
              />
              <label>{category.name}</label>
            </li>
          ))}
        </ul>
        <div className="flex mt-10">{renderPagination()}</div>
      </div>
    </div>
    </>
  );
};

export default Categories;
