import { Container, Typography, Box } from '@mui/material';
import HorizontalProductGrid from '@/components/HorizontalProductGrid';
import { Category, Product } from '@/types';
import { headers } from 'next/headers';
import api from '@/lib/api';
import axios from 'axios';

async function getCategoriesWithProducts(host: string | null): Promise<Category[]> {
  if (!host) {
    console.error('Host header is missing, cannot fetch categories.');
    return [];
  }
  
  try {
    const response = await api.get('/public/api/v1/categories/products', {
      headers: { 'X-Shop-Domain': host },
    });
    
    const data = response.data;

    if (typeof data === 'string') {
        return JSON.parse(data);
    }
    return data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching categories: ${error.response.status} ${error.response.statusText}`);
    } else {
      console.error('An unexpected error occurred while fetching categories:', error);
    }
    return [];
  }
}

async function getAllPublishedProducts(host: string | null): Promise<Product[]> {
  if (!host) {
    console.error('Host header is missing, cannot fetch products.');
    return [];
  }
  
  try {
    const response = await api.get('/public/api/v1/products', {
      headers: { 'X-Shop-Domain': host },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching products: ${error.response.status} ${error.response.statusText}`);
    } else {
      console.error('An unexpected error occurred while fetching products:', error);
    }
    return [];
  }
}


export default async function ShopPage() {
  const headersList = headers();
  const host = headersList.get('host')?.split(':')[0];
  const categories = await getCategoriesWithProducts(host);
  
  const hasProductsInCategories = categories.some(category => category.products && category.products.length > 0);

  let allProducts: Product[] = [];
  if (!hasProductsInCategories) {
    allProducts = await getAllPublishedProducts(host);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        New Collection
      </Typography>
      <br/><br /><br /><br/><br /><br />
      
      {hasProductsInCategories ? (
        <Box sx={{ mt: 4 }}>
          {categories.map((category) => {
            const publishedProducts = category.products.filter(product => product.isPublished);
            return (
              publishedProducts.length > 0 && (
                <Box key={category.id} sx={{ mb: 6 }}>
                  <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
                    {category.name}
                  </Typography>
                  <HorizontalProductGrid products={publishedProducts} />
                </Box>
              )
            )
          })}
        </Box>
      ) : allProducts.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <HorizontalProductGrid products={allProducts} />
        </Box>
      ) : (
        <Typography sx={{ mt: 4 }}>
          Aucun produit n'est disponible pour le moment. Veuillez revenir plus tard.
        </Typography>
      )}
    </Container>
  );
}