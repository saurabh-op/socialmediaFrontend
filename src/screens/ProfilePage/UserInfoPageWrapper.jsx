import { useParams } from "react-router-dom";
import UserInfoPage from "../screens/UserInfoPage";

const UserInfoPageWrapper = () => {
  const { id } = useParams();
  return <UserInfoPage userId={id} />;
};

export default UserInfoPageWrapper;
