import { useLocation, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}>
      <h1>404</h1>
      <h2>Không tìm thấy trang</h2>
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default NotFoundPage;
