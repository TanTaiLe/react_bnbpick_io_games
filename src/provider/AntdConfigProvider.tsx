import  {PropsWithChildren} from "react";
import { ConfigProvider } from "antd";
import themeConfig from "@config/theme.config";

interface IProps extends PropsWithChildren {}

const AntdConfigProvider  = (props: IProps) => {
    // Setting Modal、Message、Notification static config.
    ConfigProvider.config({
        prefixCls: "ant",
        iconPrefixCls: "anticon",
        theme: themeConfig,
    });

    return (
            <ConfigProvider theme={themeConfig}>
                {props.children}
            </ConfigProvider>
    );
};

export default AntdConfigProvider;
