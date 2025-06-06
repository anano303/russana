import { ProductGrid } from "@/modules/products/components/product-grid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProducts } from "@/modules/products/api/get-products";


interface SearchPageProps {
  params: Promise<{
    keyword?: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function SearchPage({
  searchParams,
  params,
}: SearchPageProps) {
  const { keyword } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  // Fetch products based on the search keyword
  const { items: products, pages: totalPages } = await getProducts(
    currentPage,
    12,
    keyword ? { keyword } : undefined
  );

  return (
    <div className="Container">
      <div className="py-10 space-y-8">
        <div className="flex items-center space-x-4">
          <button>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </button>
          <h1 className="text-2xl font-bold">Search Results: {keyword}</h1>
        </div>
        <ProductGrid
          products={products || []}
          searchKeyword={keyword}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
