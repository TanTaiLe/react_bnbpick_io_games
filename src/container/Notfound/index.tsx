import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { trans } from "@language/index";

export const Notfound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Result
        status="404"
        title="404"
        subTitle={trans("error.notfound")}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            {trans("button.back_home")}
          </Button>
        }
      />
    </div>
  );
};
