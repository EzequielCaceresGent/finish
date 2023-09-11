import styled from "styled-components";


export default function Overlay({children, show}) {
    const Div = styled.div`
        
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: ${show ? "flex" : "none"};
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
        justify-content: center;
        align-items: center;

    `;
    return (
        <Div>{children}</Div>
    );
}