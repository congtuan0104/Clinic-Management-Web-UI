import { Button, Image, Typography } from 'antd';

import { IProduct } from '@/types';

interface IProductCardProps {
  data: IProduct;
}

const ProductCard = ({ data }: IProductCardProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Image
          preview={false}
          src={data.thumbnail}
          style={{ borderRadius: '5px', width: '100%', objectFit: 'cover' }}
        />
        <Typography.Text type="secondary" strong>
          {data.title}
        </Typography.Text>
        <div>
          <Typography.Text>{data.price} USD</Typography.Text>
          <Typography.Text style={{ marginLeft: '15px' }}>Còn lại: {data.stock}</Typography.Text>
        </div>
      </div>
      <Button type="primary">Mua</Button>
    </div>
  );
};

export default ProductCard;
