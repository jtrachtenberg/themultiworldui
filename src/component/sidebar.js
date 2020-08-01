import React, { Component } from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
display: flex;
flex-direction: column;
align-items: left;
height: 100vh;
width: 270px;
background-color: #252529;
color: #fff;
`

/*const SidebarMenu = styled.ul`
    display: flex;
    align-items: center;
    flex-direction: column;
    list-style: none;
    width: 100%;
`*/

class Sidebar extends Component {
    render() {
        return <SidebarContainer></SidebarContainer>
    }
}
export default Sidebar