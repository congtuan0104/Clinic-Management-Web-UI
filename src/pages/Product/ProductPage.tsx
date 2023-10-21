// import { useQuery } from 'react-query';

// import { productApi } from '@/services/product.service';

const ProductPage = () => {
  // cách 1: sử dụng useState và useEffect để lấy dữ liệu từ API
  // const [products, setProducts] = useState<IProduct[]>([]);
  // useEffect(() => {
  //   productApi.getProducts().then(res => {
  //     setProducts(res.data?.products || []);
  //   });
  // }, []);

  // cách 2: sử dụng react-query để lấy dữ liệu từ API
  // const { data: products, isLoading } = useQuery('products', () => getProductData());
  // const getProductData = async () => {
  //   const res = await productApi.getProducts();
  //   return res.products || [];
  // };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}>
      Danh sách sản phẩm
    </div>
  );
};

export default ProductPage;
