import React from "react";
import logo from "../assets/images/logo.svg";

import { ApiOutlined } from "@ant-design/icons";

const TopBar = (props) => {
    const { isLoggedIn, handleLogout } = props;
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="App-title">Around Web</span>
            {isLoggedIn ? (
                <div className="logout-container" onClick={handleLogout}>
                    <ApiOutlined className="logout-icon" />
                    <span className="logout-text">logout</span>
                </div>
            ) : null}
        </header>
    );
};

export default TopBar;