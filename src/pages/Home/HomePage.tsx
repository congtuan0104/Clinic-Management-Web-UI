import { Button, Checkbox, Input } from 'antd';
import { Link } from 'react-router-dom';

import { PATHS } from '@/routes';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>HOME PAGE</h1>

      <Button shape="round" size="large" type="primary">
        Button
      </Button>
      <div>
        <Checkbox>Checkbox 1</Checkbox>
        <Checkbox>Checkbox 2</Checkbox>
      </div>
      <label style={{ fontSize: '16px' }} htmlFor="username">
        Username
      </label>
      <Input style={{ maxWidth: '400px' }} id="username" size="large" placeholder="Username" />
      <Link to={PATHS.PRODUCT}>Xem danh sách sản phẩm</Link>
    </div>
  );
};

export default HomePage;
