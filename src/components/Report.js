import React, { useState } from "react";
import { Modal, Select, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
const { Option } = Select;
const { TextArea } = Input;

const ReportProfileModal = ({ visible, onClose, selectedUserData }) => {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async () => {
        if (!file || !description || !reason) {
            alert("All fields are required!")
        }

        const formData = new FormData();
        formData.append('place_id', selectedUserData?.place_id);
        formData.append('evidence_file', file); // Ensure file is an actual File object
        formData.append('report_description', description);
        formData.append('report_reason', reason);
        formData.append('api_data', 'yes');

        try {
            const response = await axios.post("https://www.fansmaps.com/save-report.php", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            alert("Submitted Successfully");
        } catch (error) {
            console.error("Error uploading file:", error.response);
            alert("Submission failed!");
        }

        onClose();
    };

    const handleFileChange = async (e) => {
        const file = e.fileList[0].originFileObj;
        if (!file) {
            alert("Please select a file");
            return;
        }
        const formData = new FormData();
        formData.append('upload_evidence', file);

        try {
            const response = await axios.post("https://www.fansmaps.com/user/process-upload-evidence.php", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 10000,
            });
            if (response?.data?.result == 'success') {
                setFile(response.data.filename)
                console.log("file", response.data.filename)
                alert("File uploaded successfully");
            } else {
                alert("File upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error.response);
            alert("Error uploading file");
        }
    };

    return (
        <Modal
            visible={visible}
            title="Report this Profile"
            onCancel={onClose}
            footer={null}
        >
            <div className="flex flex-col gap-4">
                <label className="font-semibold">Reason</label>
                <Select
                    placeholder="Select a reason"
                    value={reason}
                    onChange={(value) => setReason(value)}
                    className="w-full"
                >
                    <Option value="Soliciting Sexual Services For Compensation">
                        Soliciting Sexual Services For Compensation
                    </Option>
                    <Option value="Suspected Underage Profile">
                        Suspected Underage Profile
                    </Option>
                    <Option value="Potentially Looking for Underage Profile">
                        Potentially Looking for Underage Profile
                    </Option>
                    <Option value="Fake/Scam/Spammer Profile">
                        Fake/Scam/Spammer Profile
                    </Option>
                    <Option value="Criminal Activities">Criminal Activities</Option>
                    <Option value="Profile Content Inappropriate">
                        Profile Content Inappropriate
                    </Option>
                    <Option value="Inappropriate Conduct/Messages/Rudeness">
                        Inappropriate Conduct/Messages/Rudeness
                    </Option>
                </Select>

                <label className="font-semibold">Description</label>
                <TextArea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />

                <label className="font-semibold">Upload Evidence</label>
                <Upload
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    className="w-full"
                >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                </Upload>

                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose}>Close</Button>
                    <Button onClick={handleSubmit} type="primary">
                        Submit
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ReportProfileModal;
