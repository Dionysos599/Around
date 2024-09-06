import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { BASE_URL, TOKEN_KEY } from "../constants";
import { jwtDecode } from "jwt-decode";

function PhotoGallery(props) {
    const [images, setImages] = useState(props.images);

    const imageArr = images.map((image) => {
        return {
            ...image,
            customOverlay: (
                <div className="caption">
                    <div className="info">{`${image.user}: ${image.caption}`}</div>
                    <Button
                        style={{ marginTop: "3px", marginLeft: "5px" }}
                        key="deleteImage"
                        type="dashed"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => onDeleteImage(image.postId, image.user)}
                    >
                        Delete Image
                    </Button>
                </div>
            ),
        };
    });

    const onDeleteImage = (postId, owner) => {
        const token = localStorage.getItem(TOKEN_KEY);

        try {
            const decodedToken = jwtDecode(token);
            const currentUser = decodedToken.username;

            if (currentUser !== owner) {
                message.error("You can only delete your own posts");
                return;
            }

            if (window.confirm(`Delete this post?`)) {
                const newImageArr = images.filter((img) => img.postId !== postId);
                const opt = {
                    method: "DELETE",
                    url: `${BASE_URL}/post/${postId}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                axios(opt)
                    .then((res) => {
                        if (res.status === 200) {
                            setImages(newImageArr);
                            message.success("post deleted successfully!");
                        }
                    })
                    .catch((err) => {
                        message.error("Delete post failed!");
                        console.log("delete post failed: ", err.message);
                    });
            }
        } catch (error) {
            console.error("Failed to decode token:", error);
            message.error("Could not verify user identity.");
        }
    };

    useEffect(() => {
        setImages(props.images);
    }, [props.images]);

    return (
        <div className="wrapper">
            <Gallery
                images={imageArr}
                enableImageSelection={false}
                backdropClosesModal={true}
            />
        </div>
    );
}

PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default PhotoGallery;