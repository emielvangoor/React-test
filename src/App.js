import React from "react";
import "./styles.css";
import styled from "styled-components";

const Name = ({ name }) => {
  return <div>{name ?? "Emiel"} is de beste</div>;
};

const StyledName = styled(Name)`
  background-color: red;
`;

export default function App() {
  return (
    <div className="App">
      <StyledName name="Zoe" />
      <Name name="Saskia" />
      <h1>Emiel is gek</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
