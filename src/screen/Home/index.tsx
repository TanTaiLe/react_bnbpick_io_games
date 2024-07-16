import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {trans} from "@language/index.ts";

export const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
        <Button type={"primary"} onClick={() => navigate('/dashboard')}>{trans('button.go_to_dashboard')}</Button>
    </div>
  );
}