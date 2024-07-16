import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { trans } from "@language/index";

export const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Result
        status="403"
        title="403"
        subTitle={trans("error.not_authorized")}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            {trans("button.back_home")}
          </Button>
        }
      />
    </div>
  );
};
