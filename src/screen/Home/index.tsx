import { Btn } from "@component/DesignSystem/Btn";

export const Home = () => {

  return (
    <div>
      <h1>1. Button</h1>
      <h2>Normal</h2>
      <Btn>SPIN</Btn>
      <h2>Block</h2>
      <Btn block>SPIN</Btn>
      <h2>Vertical</h2>
      <Btn vertical>HIGHER or EQUAL <br /> 15.38%</Btn>
    </div>
  );
}