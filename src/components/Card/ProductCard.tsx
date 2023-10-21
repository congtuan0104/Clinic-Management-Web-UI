import { IProduct } from '@/types';

interface IProductCardProps {
  data: IProduct;
}

const ProductCard = ({ data }: IProductCardProps) => {
  return <div>{data.title}</div>;
};

export default ProductCard;
