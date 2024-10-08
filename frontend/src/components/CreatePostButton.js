import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });

        // get form data
        this.postForm
            .validateFields()
            .then((form) => {
                const { description, uploadPost } = form;
                const { type, originFileObj } = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];
                if (postType) {
                    let formData = new FormData();
                    formData.append("message", description);
                    formData.append("media_file", originFileObj);

                    const opt = {
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                        },
                        data: formData,
                    };

                    axios(opt)
                        .then((res) => {
                            if (res.status === 200) {
                                message.success("Post uploaded!");
                                this.postForm.resetFields();
                                this.handleCancel();
                                this.props.onShowPost(postType);
                            }
                        })
                        .catch((err) => {
                            console.log("Post failed: ", err.message);
                            message.error("Post failed!");
                        })
                        .finally(() => {
                            this.setState({ confirmLoading: false });
                        });
                }
            })
            .catch((err) => {
                console.log("Validate failed: ", err);
            });
    };

    handleCancel = () => {
        console.log("Clicked cancel button");
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    New Post
                </Button>
                <Modal
                    title="Post"
                    open={visible}
                    onOk={this.handleOk}
                    okText="Upload"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
                </Modal>
            </div>
        );
    }
}
export default CreatePostButton;