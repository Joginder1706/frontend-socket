import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import getCookie from '../utils/getCookie';

const API_URL = "https://fansmaps-node-ygset.ondigitalocean.app/api";
// const API_URL = "http://localhost:5000/api";

const BlockUser = ({ visible, onClose, selectedUserId, loggedInUser }) => {
    const navigate = useNavigate();
    const handleBlock = async () => {
        let { id } = getCookie("loggedin");
        if (!id || !selectedUserId) return;
        try {
            const response = await axios.post(`${API_URL}/block-user/${id}`,
                { id: selectedUserId },
                {
                    headers: {
                        'Content-Type': 'application/json',  
                    }
                }
            );

            // Check if the response is successful
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            navigate("/inbox");
        } catch (error) {
            console.error('Error saving filters:', error);
        } finally {
            onClose();
        }
    };

    const handleHideInstead = () => {
        onClose();
    };

    return (
        <>
            <Modal
                title={null}
                visible={visible}
                onCancel={onClose}
                footer={null}
                centered
                width={400}
            >
                <div className="text-center">
                    <h3>Are you sure you want to Block this member?</h3>
                    <p>Blocking a member cannot be reversed</p>
                    <div className="flex justify-center mt-5">
                        <Button
                            onClick={handleHideInstead}
                            style={{
                                background: '#f0f0f0',
                                color: '#000',
                                border: '1px solid #ccc',
                                marginRight: '10px'
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={loggedInUser?.block_users?.includes(selectedUserId) ? true : false}
                            onClick={handleBlock}
                            style={{
                                background: loggedInUser?.block_users?.includes(selectedUserId) ? 'gray' : '#C80000',
                                color: '#fff',
                                border: 'none'
                            }}
                        >
                            BLOCK
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default BlockUser;
