import { Col, Row, Spin, Typography } from 'antd';
import { useQuery } from 'react-query';

import { ProductCard } from '@/components';
import { productApi } from '@/services/product.service';

const ProductPage = () => {
  // cách 1: sử dụng useState và useEffect để lấy dữ liệu từ API
  // const [products, setProducts] = useState<IProduct[]>([]);
  // useEffect(() => {
  //   productApi.getProducts().then(res => {
  //     setProducts(res.data?.products || []);
  //   });
  // }, []);

  // cách 2: sử dụng react-query để lấy dữ liệu từ API
  const { data: products, isLoading } = useQuery('products', () => getProductData());
  const getProductData = async () => {
    const res = await productApi.getProducts();
    return res.products || [];
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}>
      <Typography.Title level={2}>Danh sách sản phẩm</Typography.Title>

      <Spin spinning={isLoading} size="large" />
      <Row gutter={[8, 8]} style={{ height: '100%' }}>
        {products?.map(product => (
          <Col
            xs={{ span: 12 }}
            sm={{ span: 8 }}
            md={{ span: 6 }}
            lg={{ span: 4 }}
            key={product.id}>
            <ProductCard data={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductPage;
